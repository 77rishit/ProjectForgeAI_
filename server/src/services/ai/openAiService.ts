import OpenAI from 'openai';
import { ENV } from '../../config/env.js';

let openaiClient: OpenAI | null = null;
let lastUsedKey: string = '';

function getOpenAIClient(): OpenAI {
  const key = process.env.OPENAI_API_KEY || ENV.OPENAI_API_KEY || '';
  if (!key || key.trim() === '' || key.includes('your_')) {
    throw new Error('OPENAI_API_KEY is not configured on the server. Please set a valid key in server .env.');
  }

  if (!openaiClient || lastUsedKey !== key) {
    lastUsedKey = key;
    openaiClient = new OpenAI({
      apiKey: key
    });
  }

  return openaiClient;
}

export interface ProjectIdeaOutput {
  title: string;
  description: string;
  technologies: string[];
  difficulty: string;
  estimatedDuration: string;
  reason: string;
}

export interface TeamMatchOutput {
  compatibility: number;
  reason: string;
  strengths: string[];
  missingSkills: string[];
}

export interface ProjectBreakdownMilestone {
  title: string;
  description: string;
  tasks: {
    title: string;
    estimatedDays: number;
  }[];
}

export interface ProjectHealthOutput {
  status: 'On Track' | 'At Risk' | 'Critical';
  summary: string;
  risks: string[];
  recommendations: string[];
}

export class OpenAIService {
  private get model(): string {
    return ENV.OPENAI_MODEL || 'gpt-4o-mini';
  }

  /**
   * Core reusable AI response generator
   */
  async generateAIResponse(
    prompt: string,
    systemPrompt: string = 'You are the ProjectForge AI Academic Engineering Assistant.',
    jsonMode: boolean = false
  ): Promise<string> {
    const client = getOpenAIClient();

    try {
      const response = await client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        response_format: jsonMode ? { type: 'json_object' } : undefined
      });

      const choice = response.choices[0]?.message?.content;
      if (!choice) {
        throw new Error('Received empty response from OpenAI API.');
      }

      return choice.trim();
    } catch (error: any) {
      this.handleOpenAIError(error);
      throw error;
    }
  }

  /**
   * Project Assistant Chat with Project Context and Chat History
   */
  async chat(
    message: string,
    context: {
      projectId?: string;
      projectTitle?: string;
      description?: string;
      technologies?: string[];
      progress?: number;
      tasks?: { title: string; status: string; priority?: string }[];
      milestones?: { title: string; status: string; targetDate?: string }[];
    } = {},
    history: { role: 'user' | 'assistant'; content: string }[] = []
  ): Promise<string> {
    const client = getOpenAIClient();

    // Construct concise project context (sanitized, no sensitive internals)
    let projectContextStr = 'You are the dedicated ProjectForge AI Copilot for this capstone project.';
    if (context.projectTitle) {
      projectContextStr += `\nProject Title: ${context.projectTitle}`;
    }
    if (context.description) {
      projectContextStr += `\nProject Overview: ${context.description}`;
    }
    if (context.technologies && context.technologies.length > 0) {
      projectContextStr += `\nTech Stack: ${context.technologies.join(', ')}`;
    }
    if (context.progress !== undefined) {
      projectContextStr += `\nOverall Completion: ${context.progress}%`;
    }
    if (context.tasks && context.tasks.length > 0) {
      const taskList = context.tasks
        .slice(0, 10)
        .map((t) => `- [${t.status}] ${t.title}${t.priority ? ` (${t.priority} priority)` : ''}`)
        .join('\n');
      projectContextStr += `\nCurrent Tasks:\n${taskList}`;
    }
    if (context.milestones && context.milestones.length > 0) {
      const milestoneList = context.milestones
        .slice(0, 5)
        .map((m) => `- [${m.status}] ${m.title}`)
        .join('\n');
      projectContextStr += `\nMilestones:\n${milestoneList}`;
    }

    projectContextStr += `\nProvide technical, encouraging, and highly specific guidance based ONLY on this project's real context. Be concise and actionable.`;

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: projectContextStr }
    ];

    // Include recent history (up to last 10 messages)
    const recentHistory = history.slice(-10);
    for (const msg of recentHistory) {
      messages.push({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      });
    }

    messages.push({ role: 'user', content: message });

    try {
      const response = await client.chat.completions.create({
        model: this.model,
        messages,
        temperature: 0.7
      });

      const reply = response.choices[0]?.message?.content;
      if (!reply) {
        throw new Error('Empty assistant reply received from OpenAI.');
      }
      return reply.trim();
    } catch (error: any) {
      this.handleOpenAIError(error);
      throw error;
    }
  }

  /**
   * Generate 3-5 structured capstone project ideas
   */
  async generateProjectIdeas(params: {
    skills?: string[];
    interests?: string[];
    department?: string;
    semester?: string;
    experienceLevel?: string;
    preferredDomain?: string;
  }): Promise<ProjectIdeaOutput[]> {
    const client = getOpenAIClient();

    const systemPrompt = `You are an elite academic computer science and engineering mentor at ProjectForge AI.
Generate 3 to 5 realistic, innovative, high-impact semester or capstone project ideas.
Respond ONLY with a valid JSON object matching this schema:
{
  "ideas": [
    {
      "title": "Clear concise project title",
      "description": "Comprehensive explanation of what the project does and the problem it solves",
      "technologies": ["Array", "of", "relevant", "frameworks", "libraries"],
      "difficulty": "Beginner" | "Intermediate" | "Advanced",
      "estimatedDuration": "e.g. 6-8 weeks or 1 semester",
      "reason": "Specific reason why this fits the student's skills and interests"
    }
  ]
}`;

    const userPrompt = `Student Profile:
Department: ${params.department || 'Computer Science & Engineering'}
Semester: ${params.semester || 'Final Year'}
Experience Level: ${params.experienceLevel || 'Intermediate'}
Preferred Domain: ${params.preferredDomain || 'AI / Machine Learning'}
Known Skills: ${params.skills && params.skills.length > 0 ? params.skills.join(', ') : 'React, TypeScript, Node.js, Python'}
Interests: ${params.interests && params.interests.length > 0 ? params.interests.join(', ') : 'Distributed Systems, Machine Learning, Cloud'}`;

    try {
      const response = await client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from OpenAI project idea generator.');
      }

      const parsed = JSON.parse(content);
      const ideas: ProjectIdeaOutput[] = parsed.ideas || [];

      // Validate output structure
      if (!Array.isArray(ideas) || ideas.length === 0) {
        throw new Error('OpenAI returned invalid structure: missing ideas array.');
      }

      for (const idea of ideas) {
        if (!idea.title || !idea.description) {
          throw new Error('OpenAI returned malformed idea without title or description.');
        }
        if (!Array.isArray(idea.technologies)) {
          idea.technologies = ['TypeScript', 'React', 'Node.js'];
        }
      }

      return ideas;
    } catch (error: any) {
      this.handleOpenAIError(error);
      throw error;
    }
  }

  /**
   * Analyze team compatibility between a project and a candidate
   */
  async matchTeam(
    project: {
      title: string;
      description: string;
      requiredSkills?: string[];
    },
    candidate: {
      name?: string;
      skills?: string[];
      interests?: string[];
      experience?: string;
    }
  ): Promise<TeamMatchOutput> {
    const client = getOpenAIClient();

    const systemPrompt = `You are a technical recruiter and project advisor for university engineering teams.
Evaluate the candidate's actual fit for the target project objectively based strictly on the provided skills and requirements.
Do NOT invent skills that are not stated.
Respond ONLY with a valid JSON object matching this schema:
{
  "compatibility": 85,
  "reason": "Detailed 2-3 sentence explanation of fit",
  "strengths": ["Specific skills or aspects where candidate excels"],
  "missingSkills": ["Specific missing skills required by the project"]
}
Note: compatibility must be an integer between 0 and 100.`;

    const userPrompt = `Project Requirements:
Title: ${project.title}
Description: ${project.description}
Required Skills: ${project.requiredSkills?.join(', ') || 'None specified'}

Candidate Profile:
Name: ${candidate.name || 'Candidate'}
Skills: ${candidate.skills?.join(', ') || 'None'}
Interests: ${candidate.interests?.join(', ') || 'None'}
Experience: ${candidate.experience || 'Undergraduate coursework'}`;

    try {
      const response = await client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.5,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from OpenAI team match evaluator.');
      }

      const parsed: TeamMatchOutput = JSON.parse(content);
      return {
        compatibility: Math.max(0, Math.min(100, Math.round(parsed.compatibility || 75))),
        reason: parsed.reason || 'Candidate has matching core technologies for the project requirements.',
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        missingSkills: Array.isArray(parsed.missingSkills) ? parsed.missingSkills : []
      };
    } catch (error: any) {
      this.handleOpenAIError(error);
      throw error;
    }
  }

  /**
   * Project Breakdown into Milestones and Tasks
   */
  async breakDownProject(data: {
    title: string;
    description: string;
    technologies?: string[];
    duration?: string;
  }): Promise<{ milestones: ProjectBreakdownMilestone[] }> {
    const client = getOpenAIClient();

    const systemPrompt = `You are an agile software project manager for academic engineering projects.
Deconstruct the project into 3 to 5 realistic, chronological milestone phases.
Each milestone must contain 3 to 5 concrete actionable development tasks with realistic day estimates.
Respond ONLY with a valid JSON object matching this schema:
{
  "milestones": [
    {
      "title": "Phase 1: Architecture & Data Modeling",
      "description": "Establish repository, data schemas, and authentication",
      "tasks": [
        {
          "title": "Initialize Express TypeScript API & Mongoose connection",
          "estimatedDays": 2
        }
      ]
    }
  ]
}`;

    const userPrompt = `Project Title: ${data.title}
Overview: ${data.description}
Technologies: ${data.technologies?.join(', ') || 'React, Node.js, MongoDB'}
Expected Timeline: ${data.duration || '8-10 weeks'}`;

    try {
      const response = await client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.6,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from OpenAI project breakdown.');
      }

      const parsed = JSON.parse(content);
      const milestones: ProjectBreakdownMilestone[] = parsed.milestones || [];

      if (!Array.isArray(milestones) || milestones.length === 0) {
        throw new Error('OpenAI returned invalid structure: missing milestones array.');
      }

      return { milestones };
    } catch (error: any) {
      this.handleOpenAIError(error);
      throw error;
    }
  }

  /**
   * Project Health & Risk Assessment
   */
  async assessProjectHealth(data: {
    project: {
      title: string;
      description?: string;
      progress?: number;
      deadline?: string | Date;
      status?: string;
    };
    tasks?: { title: string; status: string; priority?: string; dueDate?: string | Date }[];
    milestones?: { title: string; status: string; targetDate?: string | Date }[];
    deadlines?: { title?: string; date?: string | Date }[];
  }): Promise<ProjectHealthOutput> {
    const client = getOpenAIClient();

    const systemPrompt = `You are a strict project auditor and risk analyst for university engineering projects.
Analyze the actual project progress, tasks, overdue deadlines, and milestone completion.
Evaluate risks realistically.
Respond ONLY with a valid JSON object matching this schema:
{
  "status": "On Track" | "At Risk" | "Critical",
  "summary": "2-sentence executive summary of project health",
  "risks": [
    "Specific identified risk or overdue bottleneck"
  ],
  "recommendations": [
    "Actionable step to mitigate risks and complete deliverables"
  ]
}`;

    const totalTasks = data.tasks?.length || 0;
    const completedTasks = data.tasks?.filter((t) => t.status === 'done').length || 0;
    const overdueTasks = data.tasks?.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length || 0;

    const userPrompt = `Project Status:
Title: ${data.project.title}
Progress: ${data.project.progress ?? 0}%
Deadline: ${data.project.deadline ? new Date(data.project.deadline).toLocaleDateString() : 'None set'}
Total Tasks: ${totalTasks} (${completedTasks} completed, ${overdueTasks} overdue)
Tasks summary: ${data.tasks?.slice(0, 8).map((t) => `${t.title} [${t.status}]`).join('; ') || 'None'}
Milestones summary: ${data.milestones?.map((m) => `${m.title} [${m.status}]`).join('; ') || 'None'}`;

    try {
      const response = await client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.4,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from OpenAI health analyzer.');
      }

      const parsed: ProjectHealthOutput = JSON.parse(content);
      const validStatuses: ProjectHealthOutput['status'][] = ['On Track', 'At Risk', 'Critical'];

      return {
        status: validStatuses.includes(parsed.status) ? parsed.status : 'On Track',
        summary: parsed.summary || 'Project is progressing according to schedule.',
        risks: Array.isArray(parsed.risks) ? parsed.risks : [],
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : []
      };
    } catch (error: any) {
      this.handleOpenAIError(error);
      throw error;
    }
  }

  /**
   * Central error handling to safeguard secrets and provide helpful client messages
   */
  private handleOpenAIError(error: any): void {
    console.error('❌ [OpenAIService Error]:', error?.message || error);
    // Sanitize any API key that might accidentally appear in error logs
    if (error?.message && ENV.OPENAI_API_KEY) {
      error.message = error.message.replace(ENV.OPENAI_API_KEY, 'sk-***REDACTED***');
    }
  }
}

export const openAIService = new OpenAIService();
