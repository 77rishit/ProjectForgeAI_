import { api } from './api';
import { Project, Task, Milestone } from '../types';

export interface ProjectDetailResponse {
  project: Project;
  tasks: Task[];
  milestones: Milestone[];
}

export const projectService = {
  async getProjects(params: { category?: string; status?: string; search?: string } = {}): Promise<Project[]> {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.status) query.append('status', params.status);
    if (params.search) query.append('search', params.search);
    const qs = query.toString();
    const res = await api.get<{ projects: Project[] }>(`/projects${qs ? `?${qs}` : ''}`);
    return res.projects;
  },

  async getMyProjects(): Promise<Project[]> {
    const res = await api.get<{ projects: Project[] }>('/projects/my');
    return res.projects;
  },

  async getFacultySupervised(): Promise<Project[]> {
    const res = await api.get<{ projects: Project[] }>('/projects/supervised');
    return res.projects;
  },

  async getProjectById(id: string): Promise<ProjectDetailResponse> {
    return api.get<ProjectDetailResponse>(`/projects/${id}`);
  },

  async createProject(data: Partial<Project>): Promise<Project> {
    const res = await api.post<{ project: Project }>('/projects', data);
    return res.project;
  },

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    const res = await api.put<{ project: Project }>(`/projects/${id}`, data);
    return res.project;
  },

  async deleteProject(id: string): Promise<void> {
    await api.delete(`/projects/${id}`);
  },

  async addMember(projectId: string, userId: string, role: string): Promise<Project> {
    const res = await api.post<{ project: Project }>(`/projects/${projectId}/members`, { userId, role });
    return res.project;
  },

  async removeMember(projectId: string, memberId: string): Promise<Project> {
    const res = await api.delete<{ project: Project }>(`/projects/${projectId}/members/${memberId}`);
    return res.project;
  },

  async respondToMentorRequest(projectId: string, status: 'approved' | 'rejected', mentorNotes?: string): Promise<Project> {
    const res = await api.post<{ project: Project }>(`/projects/${projectId}/mentor-response`, { status, mentorNotes });
    return res.project;
  },

  async assessProjectHealth(projectId: string): Promise<{ assessment: any; project: Project }> {
    return api.post(`/projects/${projectId}/assess-health`);
  }
};
