import { Request, Response } from 'express';
import { openAIService } from '../services/ai/openAiService.js';
import { aiService as legacyAiService } from '../services/ai/index.js';
import { AIConversation } from '../models/AIConversation.js';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { Milestone } from '../models/Milestone.js';

// Standard friendly error message required by specification
const AI_UNAVAILABLE_MESSAGE = 'AI unavailable right now. Please try again.';

function formatAiError(error: any): string {
  if (error?.code === 'credit_balance_exhausted' || error?.message?.includes('credits remaining') || error?.message?.includes('credit_balance_exhausted')) {
    return 'AI unavailable right now: OpenAI credit balance exhausted. Please add credits at platform.openai.com/settings/organization/billing.';
  }
  if (error?.status === 401 || error?.code === 'invalid_api_key') {
    return 'AI unavailable right now: Invalid OpenAI API key. Please verify your credentials.';
  }
  return AI_UNAVAILABLE_MESSAGE;
}

/**
 * POST /api/ai/chat
 * Context-aware Project AI Assistant with optional conversation persistence
 */
export async function chatWithAssistant(req: Request, res: Response): Promise<void> {
  try {
    const { message, context } = req.body;
    const userId = (req as any).user?._id;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      res.status(400).json({ success: false, message: 'Message is required.' });
      return;
    }

    // Retrieve previous conversation history if projectId is provided
    let conversation = null;
    let history: { role: 'user' | 'assistant'; content: string }[] = [];

    if (userId && context?.projectId) {
      try {
        conversation = await AIConversation.findOne({ user: userId, project: context.projectId });
        if (conversation) {
          history = conversation.messages.map((m) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content
          }));
        }
      } catch (err) {
        console.warn('[AIController] Failed to query conversation history:', err);
      }
    }

    // If context doesn't have tasks/milestones but has projectId, load from DB
    const enrichedContext = { ...context };
    if (context?.projectId && (!context.tasks || !context.milestones)) {
      try {
        const [dbTasks, dbMilestones] = await Promise.all([
          Task.find({ project: context.projectId }).select('title status priority').limit(10),
          Milestone.find({ project: context.projectId }).select('title status targetDate').limit(5)
        ]);
        if (!enrichedContext.tasks) enrichedContext.tasks = dbTasks;
        if (!enrichedContext.milestones) enrichedContext.milestones = dbMilestones;
      } catch (err) {
        console.warn('[AIController] Failed to fetch project details for context:', err);
      }
    }

    // Call OpenAI
    const aiResponse = await openAIService.chat(message, enrichedContext, history);

    // Persist conversation to MongoDB
    if (userId && context?.projectId) {
      try {
        if (!conversation) {
          conversation = new AIConversation({
            user: userId,
            project: context.projectId,
            messages: []
          });
        }
        conversation.messages.push({ role: 'user', content: message.trim(), createdAt: new Date() });
        conversation.messages.push({ role: 'assistant', content: aiResponse.trim(), createdAt: new Date() });
        await conversation.save();
      } catch (saveErr) {
        console.error('[AIController] Failed to persist AI message:', saveErr);
      }
    }

    res.json({
      success: true,
      message: aiResponse
    });
  } catch (error: any) {
    console.error('[AIController chat error]:', error?.message || error);
    res.status(503).json({
      success: false,
      message: formatAiError(error)
    });
  }
}

/**
 * GET /api/ai/chat/:projectId
 * Get conversation history for a specific project
 */
export async function getProjectChatHistory(req: Request, res: Response): Promise<void> {
  try {
    const { projectId } = req.params;
    const userId = (req as any).user?._id;

    if (!projectId || !userId) {
      res.status(400).json({ success: false, message: 'ProjectId and authentication are required.' });
      return;
    }

    const conversation = await AIConversation.findOne({ user: userId, project: projectId });

    res.json({
      success: true,
      messages: conversation?.messages || []
    });
  } catch (error: any) {
    console.error('[AIController getChatHistory error]:', error?.message || error);
    res.status(500).json({ success: false, message: 'Failed to retrieve conversation history.' });
  }
}

/**
 * POST /api/ai/project-ideas
 * Generate 3-5 structured ideas tailored to skills & interests
 */
export async function generateProjectIdeas(req: Request, res: Response): Promise<void> {
  try {
    const { skills, interests, department, semester, experienceLevel, preferredDomain } = req.body;

    const ideas = await openAIService.generateProjectIdeas({
      skills,
      interests,
      department,
      semester,
      experienceLevel,
      preferredDomain
    });

    res.json({
      success: true,
      ideas
    });
  } catch (error: any) {
    console.error('[AIController project-ideas error]:', error?.message || error);
    res.status(503).json({
      success: false,
      message: formatAiError(error)
    });
  }
}

/**
 * POST /api/ai/team-match
 * Objectively analyze compatibility between a project and candidate
 */
export async function analyzeTeamMatch(req: Request, res: Response): Promise<void> {
  try {
    const { project, candidate } = req.body;

    if (!project || !project.title) {
      res.status(400).json({ success: false, message: 'Valid project object with title is required.' });
      return;
    }
    if (!candidate) {
      res.status(400).json({ success: false, message: 'Candidate object is required.' });
      return;
    }

    const matchAnalysis = await openAIService.matchTeam(project, candidate);

    res.json({
      success: true,
      ...matchAnalysis
    });
  } catch (error: any) {
    console.error('[AIController team-match error]:', error?.message || error);
    res.status(503).json({
      success: false,
      message: formatAiError(error)
    });
  }
}

/**
 * POST /api/ai/project-breakdown
 * Generate structured milestones and tasks
 */
export async function breakDownProject(req: Request, res: Response): Promise<void> {
  try {
    const { title, description, technologies, duration } = req.body;

    if (!title || !description) {
      res.status(400).json({ success: false, message: 'Title and description are required for breakdown.' });
      return;
    }

    const breakdown = await openAIService.breakDownProject({
      title,
      description,
      technologies,
      duration
    });

    res.json({
      success: true,
      milestones: breakdown.milestones
    });
  } catch (error: any) {
    console.error('[AIController project-breakdown error]:', error?.message || error);
    res.status(503).json({
      success: false,
      message: formatAiError(error)
    });
  }
}

/**
 * POST /api/ai/project-health
 * Analyze project health, risks, and recommendations
 */
export async function assessProjectHealth(req: Request, res: Response): Promise<void> {
  try {
    let { project, tasks, milestones, deadlines, projectId } = req.body;

    // If projectId provided, load live project data from database
    if (projectId) {
      const dbProject = await Project.findById(projectId);
      if (dbProject) {
        project = {
          title: dbProject.title,
          description: dbProject.description,
          progress: dbProject.progress,
          deadline: dbProject.deadline,
          status: dbProject.status
        };
      }
      if (!tasks) {
        tasks = await Task.find({ project: projectId }).select('title status priority dueDate');
      }
      if (!milestones) {
        milestones = await Milestone.find({ project: projectId }).select('title status targetDate');
      }
    }

    if (!project || !project.title) {
      res.status(400).json({ success: false, message: 'Project title is required for health analysis.' });
      return;
    }

    const health = await openAIService.assessProjectHealth({
      project,
      tasks: tasks || [],
      milestones: milestones || [],
      deadlines: deadlines || []
    });

    // Optionally update project in MongoDB if projectId exists
    if (projectId) {
      try {
        const score = health.status === 'On Track' ? 92 : health.status === 'At Risk' ? 68 : 42;
        await Project.findByIdAndUpdate(projectId, {
          healthScore: score,
          healthAssessment: {
            status: health.status === 'On Track' ? 'healthy' : health.status === 'At Risk' ? 'at-risk' : 'critical',
            summary: health.summary,
            recommendations: health.recommendations,
            analyzedAt: new Date()
          }
        });
      } catch (updateErr) {
        console.warn('[AIController] Failed to persist health update to Project:', updateErr);
      }
    }

    res.json({
      success: true,
      ...health
    });
  } catch (error: any) {
    console.error('[AIController project-health error]:', error?.message || error);
    res.status(503).json({
      success: false,
      message: formatAiError(error)
    });
  }
}

/**
 * POST /api/ai/synthesize-architecture
 * Architecture Blueprint synthesizer
 */
export async function synthesizeArchitecture(req: Request, res: Response): Promise<void> {
  try {
    const { title, objective, pattern, model, vectorDb, capabilities } = req.body;

    if (!title || !objective) {
      res.status(400).json({ success: false, message: 'Title and objective are required for architecture synthesis.' });
      return;
    }

    const blueprint = await legacyAiService.synthesizeArchitecture({
      title,
      objective,
      pattern,
      model,
      vectorDb,
      capabilities
    });

    res.json({ success: true, blueprint });
  } catch (error: any) {
    console.error('[AIController synthesizeArchitecture error]:', error?.message || error);
    res.status(503).json({ success: false, message: AI_UNAVAILABLE_MESSAGE });
  }
}

/**
 * POST /api/ai/generate-ideas (Legacy route)
 */
export async function generateIdeasLegacy(req: Request, res: Response): Promise<void> {
  try {
    const { domain, skills, interests, difficulty } = req.body;
    const ideas = await legacyAiService.generateProjectIdeas({
      domain,
      skills,
      interests,
      difficulty
    });
    res.json({ success: true, ideas });
  } catch (error: any) {
    console.error('[AIController generateIdeas error]:', error?.message || error);
    res.status(503).json({ success: false, message: AI_UNAVAILABLE_MESSAGE });
  }
}
