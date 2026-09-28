import React from 'react';
import { Calendar, Users, ArrowUpRight, FolderGit2 } from 'lucide-react';
import { Avatar } from './Avatar';
import { ProgressBar } from './ProgressBar';

export interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  category?: string;
  progress?: number;
  deadline?: string;
  members?: { name: string; avatar?: string }[];
  tags?: string[];
  onClick?: () => void;
  className?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  category,
  progress = 0,
  deadline,
  members = [],
  tags = [],
  onClick,
  className = ''
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] p-6 sm:p-7 md:p-8 transition-all hover:border-indigo-500/35 hover:bg-[#141824] cursor-pointer flex flex-col justify-between gap-6 group ${className}`}
    >
      <div className="space-y-3.5">
        {/* Category & Status */}
        <div className="flex items-center justify-between gap-2">
          {category ? (
            <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
              {category}
            </span>
          ) : (
            <span className="text-xs font-semibold text-[var(--text-dim)] flex items-center gap-1.5">
              <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
              Active Project
            </span>
          )}
          <ArrowUpRight className="w-4 h-4 text-[var(--text-dim)] group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-indigo-300 transition-colors tracking-tight">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] line-clamp-2 mt-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-md bg-white/[0.04] text-[var(--text-dim)] text-[11px] font-mono"
              >
                {t}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-2 py-0.5 rounded-md bg-white/[0.02] text-[var(--text-dim)] text-[11px]">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Progress & Team Footer */}
      <div className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[var(--text-dim)] font-medium">Progress</span>
          <span className="font-mono font-bold text-indigo-400">{progress}%</span>
        </div>
        <ProgressBar value={progress} color="indigo" size="sm" />

        <div className="flex items-center justify-between pt-1 text-xs text-[var(--text-dim)]">
          {/* Team Avatars */}
          <div className="flex items-center -space-x-2">
            {members.slice(0, 4).map((m, i) => (
              <div key={i} className="ring-2 ring-[#10131F] rounded-full">
                <Avatar name={m.name} src={m.avatar} size="xs" />
              </div>
            ))}
            {members.length > 4 && (
              <div className="w-6 h-6 rounded-full bg-white/10 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[#10131F]">
                +{members.length - 4}
              </div>
            )}
            {members.length === 0 && (
              <span className="text-[11px] text-[var(--text-dim)] flex items-center gap-1">
                <Users className="w-3 h-3" /> 1 Member
              </span>
            )}
          </div>

          {/* Deadline */}
          {deadline && (
            <span className="flex items-center gap-1 text-[11px] font-mono text-[var(--text-dim)]">
              <Calendar className="w-3 h-3 text-[var(--text-dim)]" />
              {deadline}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
