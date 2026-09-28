import mongoose, { Schema, Document, Types } from 'mongoose';

export type MilestoneStatus = 'pending' | 'in_progress' | 'submitted' | 'approved' | 'revision_requested';

export interface IDeliverable {
  title: string;
  completed: boolean;
}

export interface IRubricScores {
  innovation: number;
  technicalExecution: number;
  documentation: number;
  teamwork: number;
  presentation: number;
}

export interface IMilestoneReview {
  faculty: Types.ObjectId;
  reviewedAt: Date;
  feedback: string;
  rubricScores: IRubricScores;
  overallScore: number;
  approved: boolean;
}

export interface IMilestone extends Document {
  project: Types.ObjectId;
  projectId?: Types.ObjectId; // alias
  title: string;
  description: string;
  dueDate: Date;
  targetDate?: Date; // alias
  status: MilestoneStatus;
  progress: number;
  order: number;
  deliverables: IDeliverable[];
  submissionNotes?: string;
  submissionUrl?: string;
  submittedAt?: Date;
  review?: IMilestoneReview;
  createdAt: Date;
  updatedAt: Date;
}

const MilestoneSchema = new Schema<IMilestone>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'submitted', 'approved', 'revision_requested'],
      default: 'pending',
      index: true
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    order: { type: Number, default: 1 },
    deliverables: [
      {
        title: { type: String, required: true },
        completed: { type: Boolean, default: false }
      }
    ],
    submissionNotes: { type: String, default: '' },
    submissionUrl: { type: String, default: '' },
    submittedAt: { type: Date },
    review: {
      faculty: { type: Schema.Types.ObjectId, ref: 'User' },
      reviewedAt: { type: Date },
      feedback: { type: String, default: '' },
      rubricScores: {
        innovation: { type: Number, min: 1, max: 5, default: 3 },
        technicalExecution: { type: Number, min: 1, max: 5, default: 3 },
        documentation: { type: Number, min: 1, max: 5, default: 3 },
        teamwork: { type: Number, min: 1, max: 5, default: 3 },
        presentation: { type: Number, min: 1, max: 5, default: 3 }
      },
      overallScore: { type: Number, min: 0, max: 100 },
      approved: { type: Boolean, default: false }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual aliases
MilestoneSchema.virtual('projectId').get(function () {
  return this.project;
}).set(function (val: Types.ObjectId) {
  this.project = val;
});

MilestoneSchema.virtual('targetDate').get(function () {
  return this.dueDate;
}).set(function (val: Date) {
  this.dueDate = val;
});

export const Milestone = mongoose.model<IMilestone>('Milestone', MilestoneSchema);
