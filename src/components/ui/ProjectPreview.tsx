import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Users, Sparkles } from 'lucide-react';
import { Avatar } from './Avatar';
import { formatDeadline } from '../../utils/formatters';

export interface ProjectPreviewProps {
  id: string;
  title: string;
  description: string;
  progress?: number;
  tags?: string[];
  members?: { name: string; avatar?: string }[];
  deadline?: string;
  actionText?: string;
  className?: string;
}

export const ProjectPreview: React.FC<ProjectPreviewProps> = ({
  id,
  title,
  description,
  progress = 68,
  tags = ['React', 'Node.js', 'MongoDB', 'AI'],
  members = [{ name: 'Rishit' }, { name: 'Priya' }, { name: 'Rohan' }, { name: 'Kavya' }],
  deadline = 'Sep 30',
  actionText = 'Continue building',
  className = ''
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] hover:border-indigo-500/35 p-7 sm:p-9 md:p-10 transition-all duration-200 space-y-6 ${className}`}
    >
      {/* Top: Title, Description & Progress */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        <div className="space-y-2.5 max-w-2xl">
          <Link
            to={`/projects/${id}`}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white hover:text-indigo-300 transition-colors block tracking-tight"
          >
            {title}
          </Link>
          <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed font-normal">
            {description}
          </p>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <span className="text-3xl sm:text-4xl font-extrabold font-mono text-indigo-400">
            {progress}%
          </span>
          <div className="text-[11px] font-mono text-[var(--text-dim)] uppercase tracking-wider mt-0.5">
            complete
          </div>
        </div>
      </div>

      {/* Tech Stack Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-lg bg-[#141824] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-muted)]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Bottom: Team, Deadline, Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-5 border-t border-[var(--border-subtle)] gap-4 text-xs text-[var(--text-muted)]">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Members */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2 overflow-hidden">
              {members.slice(0, 4).map((m, idx) => (
                <div key={idx} className="ring-2 ring-[#10131F] rounded-full">
                  <Avatar name={m.name} src={m.avatar} size="xs" />
                </div>
              ))}
            </div>
            <span className="text-xs font-medium text-white">
              {members.length} members
            </span>
          </div>

          <span className="text-zinc-600">·</span>

          {/* Deadline */}
          <div className="flex items-center gap-1.5 font-mono text-[var(--text-dim)]">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Due {deadline}</span>
          </div>
        </div>

        <Link
          to={`/projects/${id}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-sm shadow-indigo-600/25 active:scale-[0.98] transition-all self-start sm:self-auto"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
