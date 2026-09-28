import { api } from './api';
import { TeammateMatch, TeamRequest, User, Project } from '../types';

export interface TeammateFilterParams {
  department?: string;
  skills?: string;
  interests?: string;
  semester?: string;
  availability?: string | number;
  experience?: string;
  projectId?: string;
  domain?: string;
  search?: string;
  includeDismissed?: boolean;
}

export const matchingService = {
  async getRecommendations(params: TeammateFilterParams = {}): Promise<TeammateMatch[]> {
    const query = new URLSearchParams();
    if (params.projectId) query.append('projectId', params.projectId);
    if (params.domain && params.domain !== 'All') query.append('domain', params.domain);
    if (params.department && params.department !== 'All') query.append('department', params.department);
    if (params.skills && params.skills !== 'All') query.append('skills', params.skills);
    if (params.interests && params.interests !== 'All') query.append('interests', params.interests);
    if (params.semester && params.semester !== 'All') query.append('semester', params.semester);
    if (params.availability && params.availability !== 'All') query.append('availability', String(params.availability));
    if (params.experience && params.experience !== 'All') query.append('experience', params.experience);
    if (params.search) query.append('search', params.search);
    if (params.includeDismissed) query.append('includeDismissed', 'true');

    const qs = query.toString();
    const res = await api.get<{ matches: TeammateMatch[] }>(`/team-matches/recommendations${qs ? `?${qs}` : ''}`);
    return res.matches;
  },

  async sendRequest(data: {
    toUserId: string;
    projectId: string;
    type?: 'join_request' | 'invite';
    message?: string;
    compatibilityScore?: number;
    matchHighlights?: string[];
  }): Promise<TeamRequest> {
    const res = await api.post<{ request: TeamRequest }>('/team-matches/request', data);
    return res.request;
  },

  async addToTeam(data: {
    userId: string;
    projectId: string;
    role?: string;
  }): Promise<{ message: string; project: Project }> {
    return api.post<{ message: string; project: Project }>('/team-matches/add-to-team', data);
  },

  async dismissRecommendation(candidateId: string): Promise<{ message: string; candidateId: string }> {
    return api.post<{ message: string; candidateId: string }>(`/team-matches/dismiss/${candidateId}`);
  },

  async restoreRecommendation(candidateId: string): Promise<{ message: string; candidateId: string }> {
    return api.post<{ message: string; candidateId: string }>(`/team-matches/undismiss/${candidateId}`);
  },

  async getMyRequests(): Promise<{ incoming: TeamRequest[]; outgoing: TeamRequest[] }> {
    return api.get<{ incoming: TeamRequest[]; outgoing: TeamRequest[] }>('/team-matches/my-requests');
  },

  async respondToRequest(requestId: string, status: 'accepted' | 'rejected'): Promise<TeamRequest> {
    const res = await api.patch<{ request: TeamRequest }>(`/team-matches/request/${requestId}/respond`, { status });
    return res.request;
  },

  async getStudents(params: { department?: string; skill?: string; lookingForTeam?: boolean; search?: string } = {}): Promise<User[]> {
    const query = new URLSearchParams();
    if (params.department && params.department !== 'All') query.append('department', params.department);
    if (params.skill && params.skill !== 'All') query.append('skill', params.skill);
    if (params.lookingForTeam !== undefined) query.append('lookingForTeam', String(params.lookingForTeam));
    if (params.search) query.append('search', params.search);
    const qs = query.toString();
    const res = await api.get<{ students: User[] }>(`/users/students${qs ? `?${qs}` : ''}`);
    return res.students;
  },

  async getFacultyMentors(): Promise<User[]> {
    const res = await api.get<{ faculty: User[] }>('/users/faculty');
    return res.faculty;
  }
};
