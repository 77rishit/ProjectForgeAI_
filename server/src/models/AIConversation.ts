import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
}

export interface IAIConversation extends Document {
  user: Types.ObjectId;
  project?: Types.ObjectId;
  messages: IAIMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const AIMessageSchema = new Schema<IAIMessage>({
  role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const AIConversationSchema = new Schema<IAIConversation>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project', index: true },
    messages: [AIMessageSchema]
  },
  { timestamps: true }
);

AIConversationSchema.index({ user: 1, project: 1 });

export const AIConversation = mongoose.model<IAIConversation>('AIConversation', AIConversationSchema);
