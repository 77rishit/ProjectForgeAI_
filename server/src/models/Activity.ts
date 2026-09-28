import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IActivity extends Document {
  user: Types.ObjectId;
  project?: Types.ObjectId;
  action: string;
  metadata: Record<string, any>;
  timestamp: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project', index: true },
    action: {
      type: String,
      required: true,
      index: true
    },
    metadata: { type: Schema.Types.Mixed, default: {} },
    timestamp: { type: Date, default: Date.now, index: true }
  },
  { timestamps: false }
);

export const Activity = mongoose.model<IActivity>('Activity', ActivitySchema);
