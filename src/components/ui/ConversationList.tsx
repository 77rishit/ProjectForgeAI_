import React from 'react';
import { Search } from 'lucide-react';
import { Avatar } from './Avatar';

export interface ConversationItem {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  avatar?: string;
  isOnline?: boolean;
}

export interface ConversationListProps {
  conversations: ConversationItem[];
  activeId: string;
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  className?: string;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeId,
  onSelect,
  searchQuery,
  onSearchChange,
  className = ''
}) => {
  return (
    <div className={`w-full flex flex-col h-full bg-[#0B0D16] ${className}`}>
      {/* Search Bar */}
      <div className="p-3.5 sm:p-4 border-b border-[var(--border-subtle)]">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none z-10" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search conversations..."
            style={{ paddingLeft: '40px', paddingRight: '14px' }}
            className="w-full h-10 rounded-xl border border-[var(--border-subtle)] bg-[#10131F] text-xs sm:text-sm text-[var(--text-main)] placeholder:text-[var(--text-dim)] outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Conversation Items */}
      <div className="flex-1 overflow-y-auto divide-y divide-[var(--border-subtle)]">
        {conversations.map((c) => {
          const isActive = c.id === activeId;
          return (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={`w-full p-3.5 sm:p-4 text-left transition-colors flex items-start gap-3.5 cursor-pointer ${
                isActive
                  ? 'bg-[#141725] border-l-2 border-indigo-500 pl-3 sm:pl-3.5'
                  : 'hover:bg-[#10131F]'
              }`}
            >
              <div className="relative shrink-0">
                <Avatar name={c.name} src={c.avatar} size="md" />
                {c.isOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0B0D16]" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs sm:text-sm font-semibold text-white truncate">
                    {c.name}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--text-dim)] shrink-0">
                    {c.time}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] truncate mt-1 leading-normal">
                  {c.lastMessage}
                </p>
              </div>

              {Boolean(c.unreadCount && c.unreadCount > 0) && (
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  {c.unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
