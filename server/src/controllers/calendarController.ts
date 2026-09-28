import { Response } from 'express';
import { CalendarEvent } from '../models/CalendarEvent.js';
import { Project } from '../models/Project.js';
import { AuthRequest } from '../middleware/auth.js';
import { ApiResponse } from '../utils/apiResponse.js';

export async function getCalendarEvents(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      ApiResponse.error(res, 'Not authenticated', 401);
      return;
    }

    let events = await CalendarEvent.find({ user: req.user._id }).sort({ date: 1 });

    // Seed default upcoming academic checkpoints if user has none
    if (events.length === 0) {
      const defaultEvents = [
        {
          user: req.user._id,
          title: 'Capstone Project Pitch & Scope Sign-off',
          description: 'Formal proposal presentation to faculty committee.',
          date: new Date(2026, 8, 3, 11, 0, 0),
          time: '11:00 AM',
          location: 'Lab 302 / Zoom',
          type: 'faculty',
          completed: true
        },
        {
          user: req.user._id,
          title: 'System Architecture & API Design Review',
          description: 'Review microservice schemas and data persistence rubrics with team.',
          date: new Date(2026, 8, 8, 14, 0, 0),
          time: '2:00 PM',
          location: 'Tech Hall 204',
          type: 'team',
          completed: true
        },
        {
          user: req.user._id,
          title: 'Database Schema & Data Model Workshop',
          description: 'Indexes, relational integrity, and Mongoose connection optimizations.',
          date: new Date(2026, 8, 12, 10, 30, 0),
          time: '10:30 AM',
          location: 'Computer Lab 4B',
          type: 'checkpoint',
          completed: true
        },
        {
          user: req.user._id,
          title: 'Sprint 1 Deliverable: SRS & Wireframes',
          description: 'Submit formal requirement documents and interactive Figma prototypes.',
          date: new Date(2026, 8, 16, 23, 59, 0),
          time: '11:59 PM',
          location: 'Online Portal',
          type: 'deadline',
          completed: true
        },
        {
          user: req.user._id,
          title: 'Guest Lecture: Enterprise AI & Agent Topology',
          description: 'Industry insights on distributed LLM routing and vector embeddings.',
          date: new Date(2026, 8, 19, 16, 0, 0),
          time: '4:00 PM',
          location: 'Auditorium A',
          type: 'faculty',
          completed: false
        },
        {
          user: req.user._id,
          title: 'Mid-Sprint Code Review & PR Triage',
          description: 'Audit TypeScript safety, API controllers, and test coverage.',
          date: new Date(2026, 8, 22, 13, 30, 0),
          time: '1:30 PM',
          location: 'Discord Voice #dev',
          type: 'team',
          completed: false
        },
        {
          user: req.user._id,
          title: 'Sprint 2 Demo: Backend Services & Auth',
          description: 'Live demonstration of JWT authentication, role guards, and endpoints.',
          date: new Date(2026, 8, 25, 10, 0, 0),
          time: '10:00 AM',
          location: 'Conference Room 4B',
          type: 'checkpoint',
          completed: false
        },
        {
          user: req.user._id,
          title: 'Faculty Checkpoint with Dr. Elena',
          description: 'Review capstone progress, faculty rubric evaluation, and demo links.',
          date: new Date(2026, 8, 28, 15, 30, 0),
          time: '3:30 PM',
          location: 'Faculty Lounge 102',
          type: 'faculty',
          completed: false
        },
        {
          user: req.user._id,
          title: 'UI/UX Usability Testing & Feedback Sync',
          description: 'Peer evaluation on responsiveness, design polish, and accessibility.',
          date: new Date(2026, 8, 30, 11, 0, 0),
          time: '11:00 AM',
          location: 'Design Studio 3',
          type: 'team',
          completed: false
        },
        {
          user: req.user._id,
          title: 'Cloud Infrastructure & Docker Deployment',
          description: 'Containerize frontend and backend with multi-stage Docker builds.',
          date: new Date(2026, 9, 4, 14, 0, 0),
          time: '2:00 PM',
          location: 'Lab 402 / Zoom',
          type: 'checkpoint',
          completed: false
        },
        {
          user: req.user._id,
          title: 'Sprint 3 Deliverable: Full-Stack Integration',
          description: 'Integrated platform with persistent MongoDB storage and clean UI.',
          date: new Date(2026, 9, 10, 23, 59, 0),
          time: '11:59 PM',
          location: 'Capstone Portal',
          type: 'deadline',
          completed: false
        },
        {
          user: req.user._id,
          title: 'Final Capstone Defense Rehearsal',
          description: 'Full 20-minute presentation with live platform demonstration.',
          date: new Date(2026, 9, 16, 14, 0, 0),
          time: '2:00 PM',
          location: 'Auditorium 201',
          type: 'defense',
          completed: false
        }
      ];

      events = await CalendarEvent.insertMany(defaultEvents);
    }

    ApiResponse.success(res, { events });
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error fetching calendar events', 500);
  }
}

export async function createCalendarEvent(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      ApiResponse.error(res, 'Not authenticated', 401);
      return;
    }

    const { title, description, date, time, location, type, projectId } = req.body;

    if (!title || !date) {
      ApiResponse.error(res, 'Event title and date are required', 400);
      return;
    }

    const event = new CalendarEvent({
      user: req.user._id,
      title: title.trim(),
      description: description || '',
      date: new Date(date),
      time: time || '10:00 AM',
      location: location || 'Virtual Workspace',
      type: type || 'meeting',
      project: projectId || undefined
    });

    await event.save();

    ApiResponse.created(res, { event }, 'Calendar event created successfully');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error creating calendar event', 500);
  }
}

export async function updateCalendarEvent(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      ApiResponse.error(res, 'Not authenticated', 401);
      return;
    }

    const { id } = req.params;
    const allowed = ['title', 'description', 'date', 'time', 'location', 'type', 'completed'];

    const updates: Record<string, any> = {};
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) {
        if (k === 'date') updates[k] = new Date(req.body[k]);
        else updates[k] = req.body[k];
      }
    });

    const event = await CalendarEvent.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { $set: updates },
      { new: true }
    );

    if (!event) {
      ApiResponse.error(res, 'Event not found or unauthorized', 404);
      return;
    }

    ApiResponse.success(res, { event }, 'Calendar event updated');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error updating calendar event', 500);
  }
}

export async function deleteCalendarEvent(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      ApiResponse.error(res, 'Not authenticated', 401);
      return;
    }

    const { id } = req.params;
    const event = await CalendarEvent.findOneAndDelete({ _id: id, user: req.user._id });

    if (!event) {
      ApiResponse.error(res, 'Event not found or unauthorized', 404);
      return;
    }

    ApiResponse.success(res, { id }, 'Calendar event deleted');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error deleting calendar event', 500);
  }
}
