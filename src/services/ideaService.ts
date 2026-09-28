import { api } from './api';
import { ProjectIdea, Project, ProjectIdeaMatchData } from '../types';

export interface IdeaFilterParams {
  category?: string;
  domain?: string;
  department?: string;
  difficulty?: string;
  technology?: string;
  requiredSkill?: string;
  duration?: string;
  search?: string;
}

export const ideaService = {
  async getIdeas(params: IdeaFilterParams = {}): Promise<ProjectIdea[]> {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.domain && params.domain !== 'All') query.append('domain', params.domain);
    if (params.department && params.department !== 'All') query.append('department', params.department);
    if (params.difficulty && params.difficulty !== 'All') query.append('difficulty', params.difficulty);
    if (params.technology && params.technology !== 'All') query.append('technology', params.technology);
    if (params.requiredSkill && params.requiredSkill !== 'All') query.append('requiredSkill', params.requiredSkill);
    if (params.duration && params.duration !== 'All') query.append('duration', params.duration);
    if (params.search) query.append('search', params.search);

    const qs = query.toString();
    const res = await api.get<{ ideas: ProjectIdea[] }>(`/ideas${qs ? `?${qs}` : ''}`);
    return res.ideas;
  },

  async getRecommendedIdeas(): Promise<ProjectIdea[]> {
    const res = await api.get<{ ideas: ProjectIdea[] }>('/ideas/recommendations');
    return res.ideas;
  },

  async getIdeaById(id: string): Promise<{ idea: ProjectIdea; matchData?: ProjectIdeaMatchData }> {
    const res = await api.get<{ idea: ProjectIdea; matchData?: ProjectIdeaMatchData }>(`/ideas/${id}`);
    return res;
  },

  async generateIdeas(params: {
    domain?: string;
    skills?: string[];
    interests?: string[];
    difficulty?: string;
  }): Promise<ProjectIdea[]> {
    const res = await api.post<{ ideas: ProjectIdea[] }>('/ideas/generate', params);
    return res.ideas;
  },

  async toggleBookmark(id: string): Promise<{ bookmarked: boolean }> {
    return api.post<{ bookmarked: boolean }>(`/ideas/${id}/bookmark`);
  },

  async adoptIdea(id: string): Promise<{ project: Project; message: string }> {
    return api.post<{ project: Project; message: string }>(`/ideas/${id}/adopt`);
  }
};
