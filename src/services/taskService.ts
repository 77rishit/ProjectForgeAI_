import { api } from './api';
import { Task } from '../types';

export const taskService = {
  async getMyTasks(): Promise<Task[]> {
    const res = await api.get<{ tasks: Task[] }>('/tasks/my-tasks');
    return res.tasks;
  },

  async getTasksByProject(projectId: string): Promise<Task[]> {
    const res = await api.get<{ tasks: Task[] }>(`/tasks/project/${projectId}`);
    return res.tasks;
  },

  async createTask(data: {
    projectId: string;
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    assignee?: string;
    milestoneId?: string;
    dueDate?: string;
    tags?: string[];
  }): Promise<Task> {
    const res = await api.post<{ task: Task }>('/tasks', data);
    return res.task;
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const res = await api.put<{ task: Task }>(`/tasks/${id}`, updates);
    return res.task;
  },

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  }
};
