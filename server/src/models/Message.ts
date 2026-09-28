import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMessage extends Document {
  channelId: string;
  sender: Types.ObjectId;
  senderName: string;
  senderRole?: string;
  avatar?: string;
  content: string;
  time?: string;
  read: boolean;
  isMe?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    channelId: { type: String, required: true, index: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    senderName: { type: String, required: true },
    senderRole: { type: String, default: 'Member' },
    avatar: { type: String, default: '' },
    content: { type: String, required: true, trim: true },
    time: { type: String, default: '' },
    read: { type: Boolean, default: false },
    isMe: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

export const Message = mongoose.model<IMessage>('Message', MessageSchema);
