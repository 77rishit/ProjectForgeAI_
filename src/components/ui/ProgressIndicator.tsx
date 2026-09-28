import React from 'react';

export interface ProgressIndicatorProps {
  activeProjects: number;
  tasksDue: number;
  overallProgress: number;
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  activeProjects,
  tasksDue,
  overallProgress,
  className = ''
}) => {
  return (
    <div
      className={`flex flex-wrap items-center gap-3 text-sm sm:text-base text-[var(--text-muted)] pt-3 pb-2 border-t border-[var(--border-subtle)] ${className}`}
    >
      <div className="flex items-center gap-1.5">
        <span className="font-bold text-white font-mono">{activeProjects}</span>
        <span>active projects</span>
      </div>

      <span className="text-zinc-600 font-bold">·</span>

      <div className="flex items-center gap-1.5">
        <span className="font-bold text-white font-mono">{tasksDue}</span>
        <span>tasks due</span>
      </div>

      <span className="text-zinc-600 font-bold">·</span>

      <div className="flex items-center gap-1.5">
        <span className="font-bold text-indigo-400 font-mono">{overallProgress}%</span>
        <span>overall progress</span>
      </div>
    </div>
  );
};
