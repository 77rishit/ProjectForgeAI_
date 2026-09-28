import React from 'react';
import { Calendar, CheckCircle2, ChevronRight, User as UserIcon } from 'lucide-react';
import { Avatar } from './Avatar';

export interface TaskCardProps {
  id: string;
  title: string;
  assigneeName?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: string;
  onAdvance?: () => void;
  onClick?: () => void;
  className?: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  title,
  assigneeName,
  dueDate,
  priority,
  onAdvance,
  onClick,
  className = ''
}) => {
  const priorityStyles = {
    low: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20',
    medium: 'text-indigo-300 bg-indigo-500/10 border-indigo-500/20',
    high: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
    urgent: 'text-rose-300 bg-rose-500/10 border-rose-500/20'
  };

  return (
    <div
      onClick={onClick}
      className={`group rounded-xl border border-[var(--border-subtle)] bg-[#10131F] p-4 transition-all hover:border-indigo-500/35 hover:bg-[#141725] cursor-pointer space-y-3 ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium text-[var(--text-main)] group-hover:text-indigo-300 transition-colors leading-snug">
          {title}
        </h4>
        {priority && (
          <span
            className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${priorityStyles[priority]}`}
          >
            {priority}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-[var(--border-subtle)] text-xs text-[var(--text-dim)]">
        <div className="flex items-center gap-2">
          {assigneeName ? (
            <div className="flex items-center gap-1.5">
              <Avatar name={assigneeName} size="xs" />
              <span className="text-[11px] text-[var(--text-muted)] truncate max-w-[100px]">
                {assigneeName}
              </span>
            </div>
          ) : (
            <span className="text-[11px] text-zinc-500 flex items-center gap-1">
              <UserIcon className="w-3 h-3" />
              Unassigned
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {dueDate && (
            <span className="flex items-center gap-1 text-[11px] font-mono text-[var(--text-dim)]">
              <Calendar className="w-3 h-3" />
              {dueDate}
            </span>
          )}
          {onAdvance && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAdvance();
              }}
              title="Advance task state"
              className="p-1 rounded hover:bg-white/10 text-[var(--text-dim)] hover:text-white transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
