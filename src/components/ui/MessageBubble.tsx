import React from 'react';
import { Avatar } from './Avatar';

export interface MessageBubbleProps {
  id: string;
  sender: string;
  senderRole?: string;
  avatar?: string;
  content: string;
  time: string;
  isMe?: boolean;
  className?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  sender,
  senderRole,
  avatar,
  content,
  time,
  isMe = false,
  className = ''
}) => {
  return (
    <div
      className={`flex items-start gap-3.5 max-w-2xl ${
        isMe ? 'ml-auto flex-row-reverse text-right' : 'mr-auto text-left'
      } ${className}`}
    >
      <Avatar name={sender} src={avatar} size="sm" />

      <div className="space-y-1.5 min-w-0">
        <div className={`flex items-center gap-2 text-xs ${isMe ? 'justify-end' : 'justify-start'}`}>
          <span className="font-semibold text-white">{sender}</span>
          {senderRole && (
            <span className="text-[10px] font-mono text-[var(--text-dim)]">· {senderRole}</span>
          )}
          <span className="text-[10px] font-mono text-zinc-500">{time}</span>
        </div>

        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
            isMe
              ? 'bg-indigo-600 text-white rounded-tr-sm shadow-sm shadow-indigo-600/20'
              : 'bg-[#141824] border border-[var(--border-subtle)] text-[var(--text-main)] rounded-tl-sm'
          }`}
        >
          {content}
        </div>
      </div>
    </div>
  );
};
