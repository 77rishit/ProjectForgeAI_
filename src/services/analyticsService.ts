import { api } from './api';
import { StudentAnalytics, FacultyAnalytics, AdminAnalytics } from '../types';

export const analyticsService = {
  async getStudentAnalytics(): Promise<StudentAnalytics> {
    const res = await api.get<{ analytics: StudentAnalytics }>('/analytics/student');
    return res.analytics;
  },

  async getFacultyAnalytics(): Promise<FacultyAnalytics> {
    const res = await api.get<{ analytics: FacultyAnalytics }>('/analytics/faculty');
    return res.analytics;
  },

  async getAdminAnalytics(): Promise<AdminAnalytics> {
    const res = await api.get<{ analytics: AdminAnalytics }>('/analytics/admin');
    return res.analytics;
  }
};
