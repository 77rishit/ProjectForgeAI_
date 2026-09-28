import mongoose, { Schema, Document, Types } from 'mongoose';

export type InvitationStatus = 'pending' | 'accepted' | 'rejected' | 'canceled';

export interface ITeamInvitation extends Document {
  project: Types.ObjectId;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  status: InvitationStatus;
  message?: string;
  compatibilityScore?: number;
  matchHighlights?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TeamInvitationSchema = new Schema<ITeamInvitation>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'canceled'],
      default: 'pending',
      index: true
    },
    message: { type: String, default: '' },
    compatibilityScore: { type: Number, default: 85 },
    matchHighlights: { type: [String], default: [] }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual aliases with populate support for backward compatibility
TeamInvitationSchema.virtual('projectId', {
  ref: 'Project',
  localField: 'project',
  foreignField: '_id',
  justOne: true
});

TeamInvitationSchema.virtual('fromUser', {
  ref: 'User',
  localField: 'sender',
  foreignField: '_id',
  justOne: true
});

TeamInvitationSchema.virtual('toUser', {
  ref: 'User',
  localField: 'receiver',
  foreignField: '_id',
  justOne: true
});

TeamInvitationSchema.virtual('type').get(function () {
  return 'invite';
});

export const TeamInvitation = mongoose.model<ITeamInvitation>('TeamInvitation', TeamInvitationSchema);
