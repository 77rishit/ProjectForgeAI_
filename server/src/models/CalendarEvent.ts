import mongoose, { Schema, Document, Types } from 'mongoose';

export type CalendarEventType = 'meeting' | 'deadline' | 'milestone' | 'faculty' | 'team' | 'defense' | 'checkpoint' | 'other';

export interface ICalendarEvent extends Document {
  user: Types.ObjectId;
  title: string;
  description?: string;
  date: Date;
  time?: string;
  location?: string;
  type: CalendarEventType;
  project?: Types.ObjectId;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CalendarEventSchema = new Schema<ICalendarEvent>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    date: { type: Date, required: true, index: true },
    time: { type: String, default: '10:00 AM' },
    location: { type: String, default: 'Virtual Workspace' },
    type: {
      type: String,
      enum: ['meeting', 'deadline', 'milestone', 'faculty', 'team', 'defense', 'checkpoint', 'other'],
      default: 'meeting'
    },
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    completed: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

export const CalendarEvent = mongoose.model<ICalendarEvent>('CalendarEvent', CalendarEventSchema);
