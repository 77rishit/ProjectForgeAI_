import { Response } from 'express';
import { Task } from '../models/Task.js';
import { Project } from '../models/Project.js';
import { AuthRequest } from '../middleware/auth.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { logActivity } from '../services/activityService.js';
import { createNotification } from '../services/notificationService.js';

export async function getTasksByProject(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { projectId } = req.params;
    const tasks = await Task.find({ project: projectId })
      .populate('assignedTo', 'name email profileImage department')
      .populate('createdBy', 'name')
      .populate('milestoneId', 'title order')
      .sort({ createdAt: -1 });

    ApiResponse.success(res, { tasks });
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error fetching tasks', 500);
  }
}

export async function getMyTasks(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      ApiResponse.error(res, 'Not authenticated', 401);
      return;
    }

    const myProjects = await Project.find({
      $or: [{ owner: req.user._id }, { 'members.user': req.user._id }]
    }).select('_id');
    const projectIds = myProjects.map((p) => p._id);

    const tasks = await Task.find({
      $or: [
        { assignedTo: req.user._id },
        { project: { $in: projectIds } }
      ]
    })
      .populate('project', 'title category')
      .populate('assignedTo', 'name email profileImage')
      .sort({ dueDate: 1, createdAt: -1 })
      .limit(10);

    ApiResponse.success(res, { tasks });
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error fetching student tasks', 500);
  }
}

export async function createTask(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      ApiResponse.error(res, 'Not authenticated', 401);
      return;
    }

    const {
      project: projectParam,
      projectId,
      title,
      description,
      status,
      priority,
      assignedTo,
      assignee,
      milestoneId,
      dueDate,
      estimatedHours,
      tags
    } = req.body;

    const targetProject = projectParam || projectId;
    const assignedUser = assignedTo || assignee;

    if (!targetProject || !title) {
      ApiResponse.error(res, 'Project ID and task title are required.', 400);
      return;
    }

    const project = await Project.findById(targetProject);
    if (!project) {
      ApiResponse.error(res, 'Project not found', 404);
      return;
    }

    const task = new Task({
      project: targetProject,
      title,
      description: description || '',
      status: status || 'todo',
      priority: priority || 'medium',
      assignedTo: assignedUser || undefined,
      milestoneId: milestoneId || undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      estimatedHours: estimatedHours !== undefined ? Number(estimatedHours) : 4,
      tags: Array.isArray(tags) ? tags : [],
      createdBy: req.user._id
    });

    await task.save();

    await logActivity(req.user._id, 'TASK_CREATED', project._id, {
      taskTitle: task.title,
      priority: task.priority
    });

    if (assignedUser && assignedUser.toString() !== req.user._id.toString()) {
      await createNotification(
        assignedUser,
        'task_assigned',
        'New Task Assigned',
        `${req.user.name} assigned you the task: "${task.title}".`,
        project._id
      );
    }

    const populated = await Task.findById(task._id)
      .populate('assignedTo', 'name email profileImage department')
      .populate('createdBy', 'name')
      .populate('milestoneId', 'title order');

    ApiResponse.created(res, { task: populated }, 'Task created successfully');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error creating task', 500);
  }
}

export async function updateTask(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      ApiResponse.error(res, 'Task not found', 404);
      return;
    }

    const previousStatus = task.status;
    const allowed = [
      'title',
      'description',
      'status',
      'priority',
      'assignedTo',
      'assignee',
      'milestoneId',
      'dueDate',
      'estimatedHours',
      'tags'
    ];

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'assignee') task.assignedTo = req.body[field];
        else (task as any)[field] = req.body[field];
      }
    });

    await task.save();

    if (task.status !== previousStatus) {
      await logActivity(req.user!._id, 'TASK_STATUS_CHANGED', task.project, {
        taskTitle: task.title,
        oldStatus: previousStatus,
        newStatus: task.status
      });

      if (task.status === 'done') {
        await logActivity(req.user!._id, 'TASK_COMPLETED', task.project, {
          taskTitle: task.title
        });
      }
    }

    const populated = await Task.findById(task._id)
      .populate('assignedTo', 'name email profileImage department')
      .populate('createdBy', 'name')
      .populate('milestoneId', 'title order');

    ApiResponse.success(res, { task: populated }, 'Task updated successfully');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error updating task', 500);
  }
}

export async function deleteTask(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      ApiResponse.error(res, 'Task not found', 404);
      return;
    }

    await logActivity(req.user!._id, 'TASK_DELETED', task.project, {
      taskTitle: task.title
    });

    ApiResponse.success(res, null, 'Task deleted successfully');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error deleting task', 500);
  }
}
