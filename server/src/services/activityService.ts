import { Activity } from '../models/Activity.js';
import mongoose from 'mongoose';

export interface LogActivityParams {
  user: string | mongoose.Types.ObjectId;
  action: string;
  project?: string | mongoose.Types.ObjectId;
  metadata?: Record<string, any>;
}

export async function logActivity(
  userOrObj: string | mongoose.Types.ObjectId | LogActivityParams,
  action?: string,
  project?: string | mongoose.Types.ObjectId,
  metadata: Record<string, any> = {}
): Promise<void> {
  try {
    let u: string | mongoose.Types.ObjectId;
    let act: string;
    let proj: string | mongoose.Types.ObjectId | undefined;
    let meta: Record<string, any> = {};

    if (typeof userOrObj === 'object' && userOrObj !== null && 'action' in userOrObj) {
      const obj = userOrObj as LogActivityParams;
      u = obj.user;
      act = obj.action;
      proj = obj.project;
      meta = obj.metadata || {};
    } else {
      u = userOrObj as string | mongoose.Types.ObjectId;
      act = action || 'GENERAL_ACTION';
      proj = project;
      meta = metadata;
    }

    await Activity.create({
      user: u,
      project: proj || undefined,
      action: act,
      metadata: meta,
      timestamp: new Date()
    });
  } catch (err) {
    console.error('[Activity] Error recording activity:', err);
  }
}

