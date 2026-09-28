import { api } from './api';
import { ActivityItem } from '../types';

export const activityService = {
  async getUserActivities(): Promise<ActivityItem[]> {
    try {
      const res = await api.get<{ activities: ActivityItem[] }>('/activities/user');
      return res.activities || [];
    } catch {
      return [];
    }
  },

  async getProjectActivities(projectId: string): Promise<ActivityItem[]> {
    try {
      const res = await api.get<{ activities: ActivityItem[] }>(`/activities/project/${projectId}`);
      return res.activities || [];
    } catch {
      return [];
    }
  }
};
