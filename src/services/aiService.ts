import { api } from './api';
import { ArchitectureBlueprint } from '../types';

export interface ProjectIdeaAI {
  title: string;
  description: string;
  technologies: string[];
  difficulty: string;
  estimatedDuration: string;
  reason: string;
}

export interface TeamMatchAI {
  compatibility: number;
  reason: string;
  strengths: string[];
  missingSkills: string[];
}

export interface ProjectBreakdownTask {
  title: string;
  estimatedDays: number;
}

export interface ProjectBreakdownMilestone {
  title: string;
  description: string;
  tasks: ProjectBreakdownTask[];
}

export interface ProjectHealthAI {
  status: 'On Track' | 'At Risk' | 'Critical';
  summary: string;
  risks: string[];
  recommendations: string[];
}

export interface AIChatMessage {
  _id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: string;
}

export const aiService = {
  /**
   * Project AI Copilot Chat (POST /api/ai/chat)
   */
  async chat(
    message: string,
    context?: {
      projectId?: string;
      projectTitle?: string;
      description?: string;
      technologies?: string[];
      progress?: number;
      tasks?: any[];
      milestones?: any[];
    }
  ): Promise<{ success: boolean; message: string }> {
    return api.post<{ success: boolean; message: string }>('/ai/chat', {
      message,
      context
    });
  },

  /**
   * Fetch persisted AI chat history for a project (GET /api/ai/chat/:projectId)
   */
  async getChatHistory(projectId: string): Promise<AIChatMessage[]> {
    const res = await api.get<{ success: boolean; messages: AIChatMessage[] }>(`/ai/chat/${projectId}`);
    return res.messages || [];
  },

  /**
   * Generate 3-5 structured project ideas (POST /api/ai/project-ideas)
   */
  async generateProjectIdeas(params: {
    skills?: string[];
    interests?: string[];
    department?: string;
    semester?: string;
    experienceLevel?: string;
    preferredDomain?: string;
  }): Promise<ProjectIdeaAI[]> {
    const res = await api.post<{ success: boolean; ideas: ProjectIdeaAI[] }>('/ai/project-ideas', params);
    return res.ideas || [];
  },

  /**
   * Evaluate candidate fit against project (POST /api/ai/team-match)
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
  ): Promise<TeamMatchAI> {
    return api.post<TeamMatchAI>('/ai/team-match', { project, candidate });
  },

  /**
   * Generate structured milestones and tasks breakdown (POST /api/ai/project-breakdown)
   */
  async breakDownProject(data: {
    title: string;
    description: string;
    technologies?: string[];
    duration?: string;
  }): Promise<{ milestones: ProjectBreakdownMilestone[] }> {
    return api.post<{ success: boolean; milestones: ProjectBreakdownMilestone[] }>('/ai/project-breakdown', data);
  },

  /**
   * Audit project health, risks, and recommendations (POST /api/ai/project-health)
   */
  async assessProjectHealth(data: {
    projectId?: string;
    project?: {
      title: string;
      description?: string;
      progress?: number;
      deadline?: string;
      status?: string;
    };
    tasks?: any[];
    milestones?: any[];
    deadlines?: any[];
  }): Promise<ProjectHealthAI> {
    return api.post<ProjectHealthAI>('/ai/project-health', data);
  },

  /**
   * Synthesize Architecture Blueprint (POST /api/ai/synthesize-architecture)
   */
  async synthesizeArchitecture(data: {
    title: string;
    objective: string;
    pattern?: string;
    model?: string;
    vectorDb?: string;
    capabilities?: string[];
  }): Promise<ArchitectureBlueprint> {
    const res = await api.post<{ blueprint: ArchitectureBlueprint }>('/ai/synthesize-architecture', data);
    return res.blueprint;
  },

  /**
   * Legacy ideas route
   */
  async generateIdeas(params: {
    domain?: string;
    skills?: string[];
    interests?: string[];
    difficulty?: string;
  }): Promise<any[]> {
    const res = await api.post<{ ideas: any[] }>('/ai/generate-ideas', params);
    return res.ideas;
  }
};
