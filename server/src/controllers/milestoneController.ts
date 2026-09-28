import { Response } from 'express';
import { Milestone } from '../models/Milestone.js';
import { Project } from '../models/Project.js';
import { AuthRequest } from '../middleware/auth.js';
import { aiService } from '../services/ai/index.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { logActivity } from '../services/activityService.js';
import { createNotification } from '../services/notificationService.js';

export async function getMilestonesByProject(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { projectId } = req.params;
    const filter = {
      $or: [{ project: projectId }, { projectId }]
    };

    const milestones = await Milestone.find(filter)
      .populate('review.faculty', 'name email avatar profileImage department')
      .sort({ order: 1, dueDate: 1 });

    ApiResponse.success(res, { milestones }, 'Milestones retrieved successfully');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error fetching milestones', 500);
  }
}

export async function createMilestone(req: AuthRequest, res: Response): Promise<void> {
  try {
    const projectId = req.body.project || req.body.projectId;
    const { title, description, order, dueDate, targetDate, deliverables } = req.body;
    const finalDate = dueDate || targetDate;

    if (!projectId || !title || !finalDate) {
      ApiResponse.error(res, 'Project ID, title, and dueDate/targetDate are required.', 400);
      return;
    }

    const milestone = new Milestone({
      project: projectId,
      projectId,
      title,
      description: description || '',
      order: order ? Number(order) : 1,
      dueDate: new Date(finalDate),
      targetDate: new Date(finalDate),
      deliverables: Array.isArray(deliverables) ? deliverables : []
    });

    await milestone.save();

    if (req.user) {
      await logActivity({
        user: req.user._id,
        project: milestone.project,
        action: 'created_milestone',
        metadata: { milestoneId: milestone._id, title: milestone.title }
      });
    }

    ApiResponse.created(res, { milestone }, 'Milestone created successfully');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error creating milestone', 500);
  }
}

export async function updateMilestone(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const milestone = await Milestone.findById(id);

    if (!milestone) {
      ApiResponse.error(res, 'Milestone not found', 404);
      return;
    }

    const allowed = ['title', 'description', 'order', 'dueDate', 'targetDate', 'status', 'progress', 'deliverables'];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'targetDate') {
          milestone.dueDate = new Date(req.body[field]);
        } else if (field === 'dueDate') {
          milestone.dueDate = new Date(req.body[field]);
        } else {
          (milestone as any)[field] = req.body[field];
        }
      }
    });

    // Auto-calculate progress if deliverables are present
    if (milestone.deliverables && milestone.deliverables.length > 0) {
      const completed = milestone.deliverables.filter(d => d.completed).length;
      milestone.progress = Math.round((completed / milestone.deliverables.length) * 100);
    }

    await milestone.save();

    if (req.user) {
      await logActivity({
        user: req.user._id,
        project: milestone.project,
        action: 'updated_milestone',
        metadata: { milestoneId: milestone._id, title: milestone.title, status: milestone.status }
      });
    }

    ApiResponse.success(res, { milestone }, 'Milestone updated successfully');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error updating milestone', 500);
  }
}

export async function submitMilestone(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { submissionNotes, submissionUrl } = req.body;

    const milestone = await Milestone.findById(id);
    if (!milestone) {
      ApiResponse.error(res, 'Milestone not found', 404);
      return;
    }

    milestone.submissionNotes = submissionNotes || '';
    milestone.submissionUrl = submissionUrl || '';
    milestone.submittedAt = new Date();
    milestone.status = 'submitted';

    await milestone.save();

    if (req.user) {
      await logActivity({
        user: req.user._id,
        project: milestone.project,
        action: 'submitted_milestone',
        metadata: { milestoneId: milestone._id, title: milestone.title }
      });
    }

    // Notify project faculty mentor if assigned
    const project = await Project.findById(milestone.project);
    if (project && project.facultyMentor) {
      await createNotification({
        user: project.facultyMentor,
        type: 'milestone_review',
        title: `Milestone Ready for Review: ${milestone.title}`,
        message: `Team "${project.title}" has submitted milestone "${milestone.title}" for your evaluation.`,
        relatedProject: project._id
      });
    }

    ApiResponse.success(res, { milestone }, 'Milestone submitted for faculty review');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error submitting milestone', 500);
  }
}

export async function reviewMilestone(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user || (req.user.role !== 'faculty' && req.user.role !== 'admin')) {
      ApiResponse.error(res, 'Only faculty or admin can review and grade milestones.', 403);
      return;
    }

    const { id } = req.params;
    const { feedback, rubricScores, approved } = req.body;

    const milestone = await Milestone.findById(id);
    if (!milestone) {
      ApiResponse.error(res, 'Milestone not found', 404);
      return;
    }

    const scores = rubricScores || {
      innovation: 4,
      technicalExecution: 4,
      documentation: 4,
      teamwork: 4,
      presentation: 4
    };

    const overallScore = Math.round(
      ((scores.innovation + scores.technicalExecution + scores.documentation + scores.teamwork + scores.presentation) / 25) * 100
    );

    milestone.review = {
      faculty: req.user._id,
      reviewedAt: new Date(),
      feedback: feedback || 'Milestone evaluated according to project rubrics.',
      rubricScores: scores,
      overallScore,
      approved: Boolean(approved)
    };

    milestone.status = approved ? 'approved' : 'revision_requested';
    if (approved) {
      milestone.progress = 100;
    }
    await milestone.save();

    const populated = await Milestone.findById(milestone._id).populate('review.faculty', 'name email avatar profileImage department');

    // Notify project owner
    const project = await Project.findById(milestone.project);
    if (project) {
      await createNotification({
        user: project.owner,
        type: 'milestone_review',
        title: `Milestone ${approved ? 'Approved' : 'Needs Revision'}: ${milestone.title}`,
        message: `Prof. ${req.user.name} evaluated milestone "${milestone.title}" with score ${overallScore}/100.`,
        relatedProject: project._id
      });

      await logActivity({
        user: req.user._id,
        project: project._id,
        action: approved ? 'approved_milestone' : 'requested_milestone_revision',
        metadata: { milestoneId: milestone._id, overallScore }
      });
    }

    ApiResponse.success(res, { milestone: populated }, 'Milestone evaluation submitted successfully');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error submitting milestone review', 500);
  }
}

export async function getRubricSuggestion(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const milestone = await Milestone.findById(id);
    if (!milestone) {
      ApiResponse.error(res, 'Milestone not found', 404);
      return;
    }

    const project = await Project.findById(milestone.project);
    const suggestion = await aiService.generateRubricFeedback(milestone, project);

    ApiResponse.success(res, { suggestion }, 'AI rubric suggestion generated');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error generating AI rubric suggestion', 500);
  }
}

