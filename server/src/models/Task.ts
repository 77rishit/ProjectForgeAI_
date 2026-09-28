import mongoose, { Schema, Document, Types } from 'mongoose';

export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ITask extends Document {
  project: Types.ObjectId;
  projectId?: Types.ObjectId; // alias
  title: string;
  description: string;
  assignedTo?: Types.ObjectId;
  assignee?: Types.ObjectId; // alias
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: Date;
  estimatedHours?: number;
  completedAt?: Date;
  milestoneId?: Types.ObjectId;
  tags: string[];
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
      index: true
    },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'in_review', 'done'],
      default: 'todo',
      index: true
    },
    dueDate: { type: Date },
    estimatedHours: { type: Number, default: 4 },
    completedAt: { type: Date },
    milestoneId: { type: Schema.Types.ObjectId, ref: 'Milestone' },
    tags: { type: [String], default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual aliases
TaskSchema.virtual('projectId').get(function () {
  return this.project;
}).set(function (val: Types.ObjectId) {
  this.project = val;
});

TaskSchema.virtual('assignee').get(function () {
  return this.assignedTo;
}).set(function (val: Types.ObjectId) {
  this.assignedTo = val;
});

// Auto-set completedAt when status changes to 'done'
TaskSchema.pre('save', function () {
  if (this.isModified('status')) {
    if (this.status === 'done' && !this.completedAt) {
      this.completedAt = new Date();
    } else if (this.status !== 'done') {
      this.completedAt = undefined;
    }
  }
});

export const Task = mongoose.model<ITask>('Task', TaskSchema);
