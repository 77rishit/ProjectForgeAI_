import { api } from './api';
import { CalendarEvent } from '../types';

export const calendarService = {
  async getEvents(): Promise<CalendarEvent[]> {
    const res = await api.get<{ events: CalendarEvent[] }>('/calendar');
    return res.events;
  },

  async createEvent(data: Partial<CalendarEvent>): Promise<CalendarEvent> {
    const res = await api.post<{ event: CalendarEvent }>('/calendar', data);
    return res.event;
  },

  async updateEvent(id: string, data: Partial<CalendarEvent>): Promise<CalendarEvent> {
    const res = await api.put<{ event: CalendarEvent }>(`/calendar/${id}`, data);
    return res.event;
  },

  async deleteEvent(id: string): Promise<void> {
    await api.delete(`/calendar/${id}`);
  }
};
