import { Response } from 'express';
import { Notification } from '../models/Notification.js';
import { AuthRequest } from '../middleware/auth.js';
import { ApiResponse } from '../utils/apiResponse.js';

export async function getMyNotifications(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      ApiResponse.error(res, 'Not authenticated', 401);
      return;
    }

    const notifications = await Notification.find({ user: req.user._id })
      .populate('relatedProject', 'title category status')
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({ user: req.user._id, read: false });

    ApiResponse.success(res, { notifications, unreadCount });
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error fetching notifications', 500);
  }
}

export async function markNotificationRead(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: req.user?._id },
      { $set: { read: true } },
      { new: true }
    );

    if (!notification) {
      ApiResponse.error(res, 'Notification not found', 404);
      return;
    }

    ApiResponse.success(res, { notification }, 'Notification marked as read');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error updating notification', 500);
  }
}

export async function markAllNotificationsRead(req: AuthRequest, res: Response): Promise<void> {
  try {
    await Notification.updateMany({ user: req.user?._id, read: false }, { $set: { read: true } });
    ApiResponse.success(res, null, 'All notifications marked as read');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error updating notifications', 500);
  }
}

export async function deleteNotification(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const notification = await Notification.findOneAndDelete({ _id: id, user: req.user?._id });

    if (!notification) {
      ApiResponse.error(res, 'Notification not found', 404);
      return;
    }

    ApiResponse.success(res, null, 'Notification deleted successfully');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Error deleting notification', 500);
  }
}

