import { Response } from 'express';
import { ProjectIdea } from '../models/ProjectIdea.js';
import { Project } from '../models/Project.js';
import { Milestone } from '../models/Milestone.js';
import { AuthRequest } from '../middleware/auth.js';
import { aiService } from '../services/ai/index.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { logActivity } from '../services/activityService.js';

export async function getIdeas(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { domain, category, difficulty, department, technology, requiredSkill, duration, search } = req.query;
    const filter: Record<string, any> = {};

    const cat = category || domain;
    if (cat && cat !== 'All') filter.category = cat;
    if (difficulty && difficulty !== 'All') filter.difficulty = difficulty;
    if (department && department !== 'All') filter.department = department;
    if (technology && technology !== 'All') filter.technologies = { $regex: new RegExp(technology as string, 'i') };
    if (requiredSkill && requiredSkill !== 'All') filter.requiredSkills = { $regex: new RegExp(requiredSkill as string, 'i') };
    if (duration && duration !== 'All') filter.estimatedDuration = { $regex: new RegExp(duration as string, 'i') };

    if (search) {
      const regex = new RegExp(search as string, 'i');
      filter.$or = [
        { title: regex },
        { description: regex },
        { technologies: regex },
        { requiredSkills: regex },
        { tags: regex }
      ];
    }

    const ideas = await ProjectIdea.find(filter)
      .populate('suggestedBy', 'name email avatar profileImage department')
      .sort({ createdAt: -1 });

    if (req.user) {
      const previousProjects = await Project.find({
        $or: [{ owner: req.user._id }, { 'members.user': req.user._id }]
      });

      const enrichedIdeas = ideas.map((idea) => {
        const match = aiService.calculateIdeaMatch(req.user, idea, previousProjects);
        const isBookmarked = idea.bookmarkedBy?.some((id: any) => id.toString() === req.user._id.toString());
        const obj = idea.toObject();
        return {
          ...obj,
          matchPercentage: match.matchPercentage,
          matchReasons: match.matchReasons,
          skillMatches: match.skillMatches,
          interestMatches: match.interestMatches,
          isBookmarked: Boolean(isBookmarked)
        };
      });

      ApiResponse.success(res, { ideas: enrichedIdeas }, 'Project ideas retrieved successfully');
      return;
    }

    ApiResponse.success(res, { ideas }, 'Project ideas retrieved successfully');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error fetching project ideas', 500);
  }
}

export async function getRecommendedIdeas(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      ApiResponse.error(res, 'Not authenticated', 401);
      return;
    }

    const previousProjects = await Project.find({
      $or: [{ owner: req.user._id }, { 'members.user': req.user._id }]
    });

    const allIdeas = await ProjectIdea.find().populate('suggestedBy', 'name email avatar profileImage department');
    const recommended = await aiService.recommendProjectIdeas(req.user, allIdeas, previousProjects);

    const formatted = recommended.map((item) => ({
      ...item,
      isBookmarked: (item.bookmarkedBy || []).some((b: any) => b.toString() === req.user._id.toString())
    }));

    ApiResponse.success(
      res,
      { ideas: formatted },
      'AI project idea recommendations retrieved successfully'
    );
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error generating recommendations', 500);
  }
}

export async function getIdeaById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const idea = await ProjectIdea.findById(id).populate('suggestedBy', 'name email avatar profileImage department');

    if (!idea) {
      ApiResponse.error(res, 'Project idea not found', 404);
      return;
    }

    let matchData = null;
    let isBookmarked = false;
    if (req.user) {
      const previousProjects = await Project.find({
        $or: [{ owner: req.user._id }, { 'members.user': req.user._id }]
      });
      matchData = aiService.calculateIdeaMatch(req.user, idea, previousProjects);
      isBookmarked = idea.bookmarkedBy?.some((bId: any) => bId.toString() === req.user._id.toString());
    }

    ApiResponse.success(
      res,
      {
        idea: {
          ...idea.toObject(),
          isBookmarked,
          matchPercentage: matchData?.matchPercentage ?? 75,
          matchReasons: matchData?.matchReasons ?? []
        },
        matchData
      },
      'Project idea retrieved successfully'
    );
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error fetching project idea', 500);
  }
}

export async function createIdea(req: AuthRequest, res: Response): Promise<void> {
  try {
    const {
      title,
      description,
      category,
      domain,
      difficulty,
      requiredSkills,
      technologies,
      recommendedStack,
      estimatedDuration,
      department,
      generatedByAI,
      tags
    } = req.body;

    if (!title || !description) {
      ApiResponse.error(res, 'Title and description are required.', 400);
      return;
    }

    const newIdea = new ProjectIdea({
      title,
      description,
      category: category || domain || 'AI / Machine Learning',
      difficulty: difficulty || 'Intermediate',
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
      technologies: Array.isArray(technologies) ? technologies : (Array.isArray(recommendedStack) ? recommendedStack : []),
      estimatedDuration: estimatedDuration || '1 Semester (12-16 weeks)',
      department: department || (req.user?.department || 'Computer Science & Engineering'),
      generatedByAI: Boolean(generatedByAI),
      suggestedBy: req.user?._id,
      tags: Array.isArray(tags) ? tags : []
    });

    await newIdea.save();

    if (req.user) {
      await logActivity({
        user: req.user._id,
        action: 'created_project_idea',
        metadata: { ideaId: newIdea._id, title: newIdea.title }
      });
    }

    ApiResponse.created(res, { idea: newIdea }, 'Project idea created successfully');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error creating project idea', 500);
  }
}

export async function updateIdea(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const idea = await ProjectIdea.findById(id);

    if (!idea) {
      ApiResponse.error(res, 'Project idea not found', 404);
      return;
    }

    const allowed = [
      'title',
      'description',
      'category',
      'domain',
      'difficulty',
      'requiredSkills',
      'technologies',
      'estimatedDuration',
      'department',
      'tags'
    ];

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'domain') {
          idea.category = req.body[field];
        } else {
          (idea as any)[field] = req.body[field];
        }
      }
    });

    await idea.save();
    ApiResponse.success(res, { idea }, 'Project idea updated successfully');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error updating project idea', 500);
  }
}

export async function deleteIdea(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const idea = await ProjectIdea.findById(id);

    if (!idea) {
      ApiResponse.error(res, 'Project idea not found', 404);
      return;
    }

    await ProjectIdea.findByIdAndDelete(id);
    ApiResponse.success(res, null, 'Project idea deleted successfully');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error deleting project idea', 500);
  }
}

export async function generateIdeas(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { domain, skills, interests, difficulty } = req.body;

    const ideas = await aiService.generateProjectIdeas({
      domain,
      skills: Array.isArray(skills) ? skills : req.user?.skills || [],
      interests: Array.isArray(interests) ? interests : req.user?.interests || [],
      difficulty
    });

    ApiResponse.success(res, { ideas }, 'AI project ideas generated successfully');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error generating AI project ideas', 500);
  }
}

export async function bookmarkIdea(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      ApiResponse.error(res, 'Not authenticated', 401);
      return;
    }

    const { id } = req.params;
    const idea = await ProjectIdea.findById(id);

    if (!idea) {
      ApiResponse.error(res, 'Idea not found', 404);
      return;
    }

    const userId = req.user._id;
    const hasBookmarked = idea.bookmarkedBy.some((b) => b.toString() === userId.toString());

    if (hasBookmarked) {
      idea.bookmarkedBy = idea.bookmarkedBy.filter((b) => b.toString() !== userId.toString());
    } else {
      idea.bookmarkedBy.push(userId);
    }

    await idea.save();
    ApiResponse.success(
      res,
      { bookmarked: !hasBookmarked },
      hasBookmarked ? 'Bookmark removed' : 'Idea bookmarked'
    );
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error toggling bookmark', 500);
  }
}

export async function adoptIdea(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      ApiResponse.error(res, 'Not authenticated', 401);
      return;
    }

    const { id } = req.params;
    const idea = await ProjectIdea.findById(id);

    if (!idea) {
      ApiResponse.error(res, 'Project idea not found', 404);
      return;
    }

    // Synthesize architecture blueprint directly from idea details
    const blueprint = await aiService.synthesizeArchitecture({
      title: idea.title,
      objective: idea.description || idea.solutionOverview || ''
    });

    const project = new Project({
      title: idea.title,
      description: idea.description,
      abstract: idea.description,
      category: idea.category,
      department: idea.department || req.user.department || 'Computer Science & Engineering',
      requiredSkills: idea.requiredSkills || [],
      technologies: idea.technologies || [],
      status: 'planning',
      owner: req.user._id,
      lead: req.user._id,
      members: [
        {
          user: req.user._id,
          role: 'Team Lead',
          joinedAt: new Date()
        }
      ],
      tags: [...(idea.technologies || []), ...(idea.tags || [])],
      architectureBlueprint: blueprint,
      healthScore: 95
    });

    await project.save();

    // Create 3 structured milestones
    const defaultMilestones = [
      {
        project: project._id,
        projectId: project._id,
        title: 'Milestone 1: Problem Validation & Architecture Spec',
        description: `Refine ${idea.title} specifications, set up Git repository, and define system models.`,
        order: 1,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        deliverables: [
          { title: 'Project specification document', completed: false },
          { title: 'Data schema definition', completed: false }
        ]
      },
      {
        project: project._id,
        projectId: project._id,
        title: 'Milestone 2: Functional Prototype Development',
        description: `Implement core algorithm/workflows with ${(idea.technologies || []).slice(0, 2).join(' and ') || 'core stack'}.`,
        order: 2,
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        targetDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        deliverables: [
          { title: 'Core system implementation', completed: false },
          { title: 'Mid-term demo recording', completed: false }
        ]
      },
      {
        project: project._id,
        projectId: project._id,
        title: 'Milestone 3: Final Deployment & Defense',
        description: 'Publish production release, finalize documentation, and present project outcomes.',
        order: 3,
        dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        deliverables: [
          { title: 'Production release bundle', completed: false },
          { title: 'Capstone report & slides', completed: false }
        ]
      }
    ];

    await Milestone.insertMany(defaultMilestones);

    await logActivity({
      user: req.user._id,
      project: project._id,
      action: 'adopted_idea',
      metadata: { ideaId: idea._id, projectTitle: project.title }
    });

    ApiResponse.created(
      res,
      { project },
      `Idea "${idea.title}" adopted into a new project!`
    );
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error adopting project idea', 500);
  }
}

