import { Response } from 'express';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { Milestone } from '../models/Milestone.js';
import { AuthRequest } from '../middleware/auth.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { aiService } from '../services/ai/index.js';
import { logActivity } from '../services/activityService.js';
import { createNotification } from '../services/notificationService.js';

export async function getProjects(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { category, department, status, search, page = '1', limit = '50' } = req.query;
    const filter: Record<string, any> = {};

    if (category) filter.category = category;
    if (department) filter.department = department;
    if (status) filter.status = status;
    if (search) {
      const regex = new RegExp(search as string, 'i');
      filter.$or = [{ title: regex }, { description: regex }, { technologies: regex }, { requiredSkills: regex }];
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 50;

    const total = await Project.countDocuments(filter);
    const projects = await Project.find(filter)
      .populate('owner', 'name email profileImage department semester')
      .populate('members.user', 'name email profileImage department skills preferredRole')
      .populate('facultyMentor', 'name email profileImage department')
      .sort({ updatedAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    ApiResponse.success(res, { projects }, 'Projects retrieved successfully', 200, {
      page: pageNum,
      limit: limitNum,
      total
    });
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error fetching projects', 500);
  }
}

export async function getMyProjects(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      ApiResponse.error(res, 'Not authenticated', 401);
      return;
    }

    const userId = req.user._id;
    const projects = await Project.find({
      $or: [{ owner: userId }, { 'members.user': userId }]
    })
      .populate('owner', 'name email profileImage department semester')
      .populate('members.user', 'name email profileImage department skills preferredRole')
      .populate('facultyMentor', 'name email profileImage department')
      .sort({ updatedAt: -1 });

    ApiResponse.success(res, { projects });
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error fetching personal projects', 500);
  }
}

export async function getFacultySupervisedProjects(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      ApiResponse.error(res, 'Not authenticated', 401);
      return;
    }

    const facultyId = req.user._id;
    const projects = await Project.find({ facultyMentor: facultyId })
      .populate('owner', 'name email profileImage department semester')
      .populate('members.user', 'name email profileImage department skills')
      .sort({ updatedAt: -1 });

    ApiResponse.success(res, { projects });
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error fetching supervised projects', 500);
  }
}

export async function getProjectById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const project = await Project.findById(id)
      .populate('owner', 'name email profileImage department semester skills bio github linkedin portfolio')
      .populate('members.user', 'name email profileImage department semester skills preferredRole github linkedin portfolio')
      .populate('facultyMentor', 'name email profileImage department bio');

    if (!project) {
      ApiResponse.error(res, 'Project not found', 404);
      return;
    }

    const tasks = await Task.find({ project: project._id })
      .populate('assignedTo', 'name profileImage email');

    const milestones = await Milestone.find({ project: project._id })
      .populate('review.faculty', 'name email profileImage department')
      .sort({ order: 1 });

    ApiResponse.success(res, {
      project,
      tasks,
      milestones
    });
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error fetching project detail', 500);
  }
}

export async function createProject(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      ApiResponse.error(res, 'Not authenticated', 401);
      return;
    }

    const {
      title,
      description,
      category,
      department,
      requiredSkills,
      facultyMentor,
      startDate,
      deadline,
      technologies,
      tags,
      objectives,
      repositoryUrl,
      deploymentUrl,
      githubUrl,
      demoUrl,
      architectureBlueprint,
      maxMembers
    } = req.body;

    if (!title || !description) {
      ApiResponse.error(res, 'Project title and description are required.', 400);
      return;
    }

    const techList = technologies || tags || [];
    const repo = repositoryUrl || githubUrl || '';
    const deploy = deploymentUrl || demoUrl || '';

    const project = new Project({
      title,
      description,
      category: category || 'AI / Machine Learning',
      department: department || req.user.department || 'Computer Science & Engineering',
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
      owner: req.user._id,
      members: [
        {
          user: req.user._id,
          role: 'Team Lead / Project Owner',
          joinedAt: new Date()
        }
      ],
      maxMembers: maxMembers ? Number(maxMembers) : 4,
      facultyMentor: facultyMentor || undefined,
      mentorApprovalStatus: facultyMentor ? 'pending' : 'none',
      startDate: startDate ? new Date(startDate) : new Date(),
      deadline: deadline ? new Date(deadline) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      technologies: Array.isArray(techList) ? techList : [],
      objectives: Array.isArray(objectives) ? objectives : [],
      repositoryUrl: repo,
      deploymentUrl: deploy,
      architectureBlueprint: architectureBlueprint || null,
      healthScore: 92
    });

    await project.save();

    // Default milestones
    const defaultMilestones = [
      {
        project: project._id,
        title: 'Milestone 1: Requirement Specification & Tech Stack Architecture',
        description: 'Finalize core user stories, database schemas, and toolchain environment.',
        order: 1,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: 'pending',
        progress: 0,
        deliverables: [
          { title: 'System Requirement Specification (SRS)', completed: false },
          { title: 'Database schema & API contracts', completed: false },
          { title: 'Initial GitHub repo with CI/CD linter', completed: false }
        ]
      },
      {
        project: project._id,
        title: 'Milestone 2: Core Prototype & Model / Logic Integration',
        description: 'Demonstrate functional MVP with core algorithms or workflows running.',
        order: 2,
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        status: 'pending',
        progress: 0,
        deliverables: [
          { title: 'Working backend APIs and database migration', completed: false },
          { title: 'Core UI screens and interactive workflows', completed: false },
          { title: 'End-to-end integration test execution', completed: false }
        ]
      },
      {
        project: project._id,
        title: 'Milestone 3: Final Production Release & Faculty Evaluation',
        description: 'Live deployment, security hardening, user documentation, and final defense.',
        order: 3,
        dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        status: 'pending',
        progress: 0,
        deliverables: [
          { title: 'Live production demo deployment', completed: false },
          { title: 'Comprehensive test coverage and security audit', completed: false },
          { title: 'Capstone presentation deck and video walkthrough', completed: false }
        ]
      }
    ];

    await Milestone.insertMany(defaultMilestones);

    await logActivity(req.user._id, 'PROJECT_CREATED', project._id, {
      title: project.title,
      category: project.category
    });

    if (facultyMentor) {
      await createNotification(
        facultyMentor,
        'milestone_review',
        'Mentorship Requested',
        `${req.user.name} requested you as mentor for project "${project.title}".`,
        project._id
      );
    }

    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email profileImage department semester')
      .populate('members.user', 'name email profileImage department skills')
      .populate('facultyMentor', 'name email profileImage department');

    ApiResponse.created(res, { project: populatedProject }, 'Project created successfully');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error creating project', 500);
  }
}

export async function updateProject(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      ApiResponse.error(res, 'Project not found', 404);
      return;
    }

    const isOwner = req.user && project.owner.toString() === req.user._id.toString();
    const isMember = req.user && project.members?.some((m: any) => (m.user?._id || m.user).toString() === req.user._id.toString());
    const isAdmin = req.user && req.user.role === 'admin';

    if (!isOwner && !isMember && !isAdmin) {
      ApiResponse.error(res, 'Only project members or an administrator can update project details.', 403);
      return;
    }

    const allowed = [
      'title',
      'description',
      'category',
      'department',
      'requiredSkills',
      'status',
      'progress',
      'startDate',
      'deadline',
      'technologies',
      'tags',
      'objectives',
      'repositoryUrl',
      'deploymentUrl',
      'githubUrl',
      'demoUrl',
      'architectureBlueprint',
      'maxMembers',
      'facultyMentor'
    ];

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'tags') project.technologies = req.body[field];
        else if (field === 'githubUrl') project.repositoryUrl = req.body[field];
        else if (field === 'demoUrl') project.deploymentUrl = req.body[field];
        else (project as any)[field] = req.body[field];
      }
    });

    if (req.body.facultyMentor && req.body.facultyMentor !== project.facultyMentor?.toString()) {
      project.mentorApprovalStatus = 'pending';
    }

    await project.save();

    await logActivity(req.user!._id, 'PROJECT_UPDATED', project._id, {
      title: project.title
    });

    const updated = await Project.findById(project._id)
      .populate('owner', 'name email profileImage department semester')
      .populate('members.user', 'name email profileImage department skills')
      .populate('facultyMentor', 'name email profileImage department');

    ApiResponse.success(res, { project: updated }, 'Project updated successfully');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error updating project', 500);
  }
}

export async function respondToMentorRequest(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { status, mentorNotes } = req.body;

    if (!req.user || req.user.role !== 'faculty') {
      ApiResponse.error(res, 'Only faculty members can respond to mentorship requests.', 403);
      return;
    }

    const project = await Project.findById(id);
    if (!project) {
      ApiResponse.error(res, 'Project not found', 404);
      return;
    }

    if (project.facultyMentor?.toString() !== req.user._id.toString()) {
      ApiResponse.error(res, 'You are not assigned as the requested mentor for this project.', 403);
      return;
    }

    project.mentorApprovalStatus = status;
    if (mentorNotes) project.mentorNotes = mentorNotes;
    await project.save();

    await logActivity(req.user._id, 'MENTOR_DECISION', project._id, { status, mentorNotes });

    await createNotification(
      project.owner,
      'project_update',
      `Mentorship Request ${status.toUpperCase()}`,
      `Prof. ${req.user.name} has ${status} your mentorship request.`,
      project._id
    );

    ApiResponse.success(res, { project }, `Mentorship request ${status} successfully`);
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error processing mentor response', 500);
  }
}

export async function addMember(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { userId, role } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      ApiResponse.error(res, 'Project not found', 404);
      return;
    }

    const alreadyMember = project.members.some((m) => m.user.toString() === userId);
    if (alreadyMember) {
      ApiResponse.error(res, 'User is already a member of this project', 400);
      return;
    }

    if (project.members.length >= project.maxMembers) {
      ApiResponse.error(res, `Project has reached maximum team capacity of ${project.maxMembers}`, 400);
      return;
    }

    project.members.push({
      user: userId,
      role: role || 'Collaborator',
      joinedAt: new Date()
    });

    await project.save();

    await logActivity(req.user!._id, 'MEMBER_ADDED', project._id, { userId, role });

    await createNotification(
      userId,
      'project_update',
      'Added to Project Team',
      `You were added to "${project.title}" as ${role || 'Collaborator'}.`,
      project._id
    );

    ApiResponse.success(res, { project }, 'Member added successfully');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error adding team member', 500);
  }
}

export async function removeMember(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id, memberId } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      ApiResponse.error(res, 'Project not found', 404);
      return;
    }

    if (project.owner.toString() === memberId) {
      ApiResponse.error(res, 'Cannot remove the project owner. Transfer ownership first.', 400);
      return;
    }

    project.members = project.members.filter((m) => m.user.toString() !== memberId);
    await project.save();

    await logActivity(req.user!._id, 'MEMBER_REMOVED', project._id, { memberId });

    ApiResponse.success(res, { project }, 'Member removed successfully');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error removing member', 500);
  }
}

export async function deleteProject(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      ApiResponse.error(res, 'Project not found', 404);
      return;
    }

    const isOwner = req.user && project.owner.toString() === req.user._id.toString();
    const isAdmin = req.user && req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      ApiResponse.error(res, 'Only project owner or administrator can delete a project.', 403);
      return;
    }

    await Task.deleteMany({ project: project._id });
    await Milestone.deleteMany({ project: project._id });
    await Project.findByIdAndDelete(project._id);

    await logActivity(req.user!._id, 'PROJECT_DELETED', project._id, {
      title: project.title
    });

    ApiResponse.success(res, null, 'Project and associated tasks/milestones deleted successfully');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error deleting project', 500);
  }
}

export async function triggerHealthAssessment(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      ApiResponse.error(res, 'Project not found', 404);
      return;
    }

    const tasks = await Task.find({ project: project._id });
    const milestones = await Milestone.find({ project: project._id });

    const assessment = await aiService.assessProjectHealth(project, tasks, milestones);
    project.healthScore = assessment.healthScore;
    project.healthAssessment = {
      status: assessment.status,
      summary: assessment.summary,
      recommendations: assessment.recommendations,
      analyzedAt: new Date()
    };

    await project.save();

    await logActivity(req.user!._id, 'HEALTH_ASSESSMENT_RUN', project._id, {
      healthScore: assessment.healthScore,
      status: assessment.status
    });

    ApiResponse.success(res, { assessment, project }, 'Health assessment updated');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error assessing project health', 500);
  }
}
