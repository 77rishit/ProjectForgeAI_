import { api } from './api';
import { User, UserRole } from '../types';

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ForgotPasswordResponse {
  message: string;
  resetToken?: string;
  resetUrl?: string;
  expiresIn?: string;
}

export const authService = {
  async register(data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    department?: string;
    semester?: string | number;
    skills?: string[];
    interests?: string[];
    availability?: number | string;
    availabilityHours?: number;
    preferredRole?: string;
    bio?: string;
    github?: string;
    linkedin?: string;
    portfolio?: string;
  }): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/register', data);
    if (res.token) {
      localStorage.setItem('projectforge_token', res.token);
    }
    return res;
  },

  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/login', credentials);
    if (res.token) {
      localStorage.setItem('projectforge_token', res.token);
    }
    return res;
  },

  async demoLogin(role: UserRole): Promise<AuthResponse> {
    const res = await api.get<AuthResponse>(`/auth/demo/${role}`);
    if (res.token) {
      localStorage.setItem('projectforge_token', res.token);
    }
    return res;
  },

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    return api.post<ForgotPasswordResponse>('/auth/forgot-password', { email });
  },

  async resetPassword(data: { token: string; newPassword: string }): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/reset-password', data);
    if (res.token) {
      localStorage.setItem('projectforge_token', res.token);
    }
    return res;
  },

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
    return api.post<{ message: string }>('/auth/change-password', data);
  },

  async getCurrentUser(): Promise<User> {
    const res = await api.get<{ user: User }>('/auth/me');
    return res.user;
  },

  async getUserProfile(id: string): Promise<User> {
    const res = await api.get<{ user: User }>(`/auth/profile/${id}`);
    return res.user;
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    const res = await api.put<{ user: User }>('/auth/profile', updates);
    return res.user;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('projectforge_token');
    }
  }
};

