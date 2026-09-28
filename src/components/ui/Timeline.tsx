import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

export interface TimelineItem {
  id: string | number;
  label: string; // e.g. "TODAY", "TOMORROW", "SEP 28", or "01 Research"
  title: string;
  description?: string;
  status?: 'completed' | 'current' | 'upcoming';
  time?: string;
  badge?: React.ReactNode;
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
  onItemClick?: (item: TimelineItem) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  items,
  className = '',
  onItemClick
}) => {
  return (
    <div className={`relative pl-7 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10 ${className}`}>
      {items.map((item, idx) => {
        const isCompleted = item.status === 'completed';
        const isCurrent = item.status === 'current';

        return (
          <div
            key={item.id || idx}
            onClick={() => onItemClick?.(item)}
            className={`relative group ${onItemClick ? 'cursor-pointer' : ''}`}
          >
            {/* Timeline Node Bullet */}
            <div
              className={`absolute -left-[35px] top-1 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-[#080A12] text-[10px] transition-colors ${
                isCompleted
                  ? 'bg-emerald-500 text-white'
                  : isCurrent
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/50'
                  : 'bg-white/10 text-white/50 group-hover:bg-white/20'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : isCurrent ? (
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              ) : (
                <Circle className="w-2.5 h-2.5 opacity-60" />
              )}
            </div>

            {/* Content */}
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo-400">
                  {item.label}
                </span>
                {item.time && (
                  <span className="text-[11px] font-mono text-[var(--text-dim)]">
                    {item.time}
                  </span>
                )}
                {item.badge}
              </div>

              <h4 className="text-sm sm:text-base font-medium text-[var(--text-main)] group-hover:text-indigo-300 transition-colors">
                {item.title}
              </h4>

              {item.description && (
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
