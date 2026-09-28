import { Notification } from '../models/Notification.js';
import mongoose from 'mongoose';

export interface CreateNotificationParams {
  user: string | mongoose.Types.ObjectId;
  type?: string;
  title: string;
  message: string;
  relatedProject?: string | mongoose.Types.ObjectId;
}

export async function createNotification(
  userOrObj: string | mongoose.Types.ObjectId | CreateNotificationParams,
  type?: string,
  title?: string,
  message?: string,
  relatedProject?: string | mongoose.Types.ObjectId
): Promise<void> {
  try {
    let u: string | mongoose.Types.ObjectId;
    let t: string = 'system';
    let tit: string = '';
    let msg: string = '';
    let proj: string | mongoose.Types.ObjectId | undefined;

    if (typeof userOrObj === 'object' && userOrObj !== null && 'message' in userOrObj) {
      const obj = userOrObj as CreateNotificationParams;
      u = obj.user;
      t = obj.type || 'system';
      tit = obj.title;
      msg = obj.message;
      proj = obj.relatedProject;
    } else {
      u = userOrObj as string | mongoose.Types.ObjectId;
      t = type || 'system';
      tit = title || '';
      msg = message || '';
      proj = relatedProject;
    }

    await Notification.create({
      user: u,
      type: t,
      title: tit,
      message: msg,
      read: false,
      relatedProject: proj || undefined
    });
  } catch (err) {
    console.error('[Notification] Error creating notification:', err);
  }
}

