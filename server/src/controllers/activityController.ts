import { Response } from 'express';
import { Activity } from '../models/Activity.js';
import { AuthRequest } from '../middleware/auth.js';
import { ApiResponse } from '../utils/apiResponse.js';

export async function getProjectActivities(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { projectId } = req.params;
    const activities = await Activity.find({ project: projectId })
      .populate('user', 'name email profileImage department')
      .sort({ timestamp: -1 })
      .limit(50);

    ApiResponse.success(res, { activities });
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error fetching project activities', 500);
  }
}

export async function getUserActivities(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      ApiResponse.error(res, 'Not authenticated', 401);
      return;
    }

    const activities = await Activity.find({ user: req.user._id })
      .populate('project', 'title category status')
      .sort({ timestamp: -1 })
      .limit(30);

    ApiResponse.success(res, { activities });
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error fetching user activities', 500);
  }
}
