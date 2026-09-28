import { Response } from 'express';
import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { Milestone } from '../models/Milestone.js';
import { AuthRequest } from '../middleware/auth.js';

export async function getStudentAnalytics(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const userId = req.user._id;

    const myProjects = await Project.find({
      $or: [{ lead: userId }, { 'members.user': userId }]
    });

    const projectIds = myProjects.map((p) => p._id);

    const tasksAssigned = await Task.find({
      $or: [{ assignee: userId }, { projectId: { $in: projectIds } }]
    });

    const completedTasks = tasksAssigned.filter((t) => t.status === 'done').length;
    const inProgressTasks = tasksAssigned.filter((t) => t.status === 'in_progress').length;
    const todoTasks = tasksAssigned.filter((t) => t.status === 'todo').length;

    const milestones = await Milestone.find({ projectId: { $in: projectIds } });
    const approvedMilestones = milestones.filter((m) => m.status === 'approved').length;

    // Calculate skill radar/breakdown based on user profile and project tags
    const skillCounts: Record<string, number> = {};
    (req.user.skills || []).forEach((s) => {
      skillCounts[s] = (skillCounts[s] || 0) + 3;
    });
    myProjects.forEach((p) => {
      (p.tags || []).forEach((tag) => {
        skillCounts[tag] = (skillCounts[tag] || 0) + 2;
      });
    });

    const topSkills = Object.entries(skillCounts)
      .map(([name, count]) => ({ name, count: Math.min(count * 15, 95) }))
      .slice(0, 6);

    res.json({
      analytics: {
        activeProjectsCount: myProjects.length,
        totalTasks: tasksAssigned.length,
        completedTasks,
        inProgressTasks,
        todoTasks,
        taskCompletionRate: tasksAssigned.length ? Math.round((completedTasks / tasksAssigned.length) * 100) : 0,
        approvedMilestones,
        totalMilestones: milestones.length,
        topSkills,
        healthAverage: myProjects.length
          ? Math.round(myProjects.reduce((acc, p) => acc + (p.healthScore || 80), 0) / myProjects.length)
          : 90
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching student analytics' });
  }
}

export async function getFacultyAnalytics(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const facultyId = req.user._id;
    const supervisedProjects = await Project.find({ facultyMentor: facultyId });
    const projectIds = supervisedProjects.map((p) => p._id);

    const pendingMilestoneReviews = await Milestone.find({
      projectId: { $in: projectIds },
      status: 'submitted'
    }).populate('projectId', 'title category lead');

    const approvedMilestones = await Milestone.find({
      projectId: { $in: projectIds },
      status: 'approved'
    });

    const averageScore = approvedMilestones.length
      ? Math.round(
          approvedMilestones.reduce((acc, m) => acc + (m.review?.overallScore || 85), 0) / approvedMilestones.length
        )
      : 88;

    const atRiskProjects = supervisedProjects.filter((p) => (p.healthScore || 100) < 75);

    res.json({
      analytics: {
        supervisedProjectsCount: supervisedProjects.length,
        pendingReviewsCount: pendingMilestoneReviews.length,
        approvedMilestonesCount: approvedMilestones.length,
        averageRubricScore: averageScore,
        atRiskProjectsCount: atRiskProjects.length,
        pendingMilestones: pendingMilestoneReviews,
        atRiskProjects: atRiskProjects.map((p) => ({
          id: p._id,
          title: p.title,
          healthScore: p.healthScore,
          status: p.healthAssessment?.status || 'at-risk'
        }))
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching faculty analytics' });
  }
}

export async function getAdminAnalytics(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalFaculty = await User.countDocuments({ role: 'faculty' });
    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ status: { $in: ['planning', 'in-progress', 'review'] } });
    const completedProjects = await Project.countDocuments({ status: 'completed' });
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'done' });

    // Aggregate category distribution
    const categoryStats = await Project.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Aggregate tag/tech stack distribution
    const projectsWithTags = await Project.find({}, 'tags');
    const tagFrequencies: Record<string, number> = {};
    projectsWithTags.forEach((p) => {
      (p.tags || []).forEach((tag) => {
        tagFrequencies[tag] = (tagFrequencies[tag] || 0) + 1;
      });
    });

    const topTechStacks = Object.entries(tagFrequencies)
      .map(([tech, count]) => ({ tech, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    res.json({
      analytics: {
        totalStudents,
        totalFaculty,
        totalProjects,
        activeProjects,
        completedProjects,
        totalTasks,
        completedTasks,
        completionRate: totalProjects ? Math.round((completedProjects / totalProjects) * 100) : 0,
        categoryDistribution: categoryStats.map((c) => ({ category: c._id || 'General', count: c.count })),
        topTechStacks
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching admin analytics' });
  }
}
