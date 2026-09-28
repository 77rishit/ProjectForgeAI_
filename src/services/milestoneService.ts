import { api } from './api';
import { Milestone, RubricScores } from '../types';

export const milestoneService = {
  async getMilestonesByProject(projectId: string): Promise<Milestone[]> {
    const res = await api.get<{ milestones: Milestone[] }>(`/milestones/project/${projectId}`);
    return res.milestones;
  },

  async createMilestone(data: {
    projectId: string;
    title: string;
    description?: string;
    order?: number;
    targetDate: string;
    deliverables?: { title: string; completed: boolean }[];
  }): Promise<Milestone> {
    const res = await api.post<{ milestone: Milestone }>('/milestones', data);
    return res.milestone;
  },

  async updateMilestone(id: string, updates: Partial<Milestone>): Promise<Milestone> {
    const res = await api.put<{ milestone: Milestone }>(`/milestones/${id}`, updates);
    return res.milestone;
  },

  async submitMilestone(id: string, submissionNotes: string, submissionUrl?: string): Promise<Milestone> {
    const res = await api.post<{ milestone: Milestone }>(`/milestones/${id}/submit`, { submissionNotes, submissionUrl });
    return res.milestone;
  },

  async reviewMilestone(id: string, data: {
    feedback: string;
    rubricScores: RubricScores;
    approved: boolean;
  }): Promise<Milestone> {
    const res = await api.post<{ milestone: Milestone }>(`/milestones/${id}/review`, data);
    return res.milestone;
  },

  async getRubricSuggestion(id: string): Promise<{
    suggestion: {
      feedback: string;
      suggestedScores: RubricScores;
    };
  }> {
    return api.get(`/milestones/${id}/rubric-suggestion`);
  }
};
