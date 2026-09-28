import { Router } from 'express';
import authRoutes from '../authRoutes.js';
import userRoutes from '../userRoutes.js';
import projectRoutes from '../projectRoutes.js';
import taskRoutes from '../taskRoutes.js';
import milestoneRoutes from '../milestoneRoutes.js';
import ideaRoutes from '../ideaRoutes.js';
import invitationRoutes from '../invitationRoutes.js';
import notificationRoutes from '../notificationRoutes.js';
import activityRoutes from '../activityRoutes.js';
import matchRoutes from '../matchRoutes.js';
import aiRoutes from '../aiRoutes.js';
import analyticsRoutes from '../analyticsRoutes.js';
import messageRoutes from '../messageRoutes.js';
import calendarRoutes from '../calendarRoutes.js';

const v1Router = Router();

v1Router.use('/auth', authRoutes);
v1Router.use('/users', userRoutes);
v1Router.use('/projects', projectRoutes);
v1Router.use('/tasks', taskRoutes);
v1Router.use('/milestones', milestoneRoutes);
v1Router.use('/ideas', ideaRoutes);
v1Router.use('/invitations', invitationRoutes);
v1Router.use('/notifications', notificationRoutes);
v1Router.use('/activities', activityRoutes);
v1Router.use('/team-matches', matchRoutes);
v1Router.use('/matches', matchRoutes);
v1Router.use('/ai', aiRoutes);
v1Router.use('/analytics', analyticsRoutes);
v1Router.use('/messages', messageRoutes);
v1Router.use('/calendar', calendarRoutes);

v1Router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    version: 'v1',
    service: 'ProjectForge AI Core REST API',
    timestamp: new Date().toISOString()
  });
});

export default v1Router;
