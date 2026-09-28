import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { Project } from '../../types';
import { Avatar } from '../../components/ui/Avatar';
import { formatDeadline } from '../../utils/formatters';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const progress = Math.min(100, Math.max(0, project.progress ?? 68));
  const deadlineText = formatDeadline(project.updatedAt || project.createdAt);

  const tags = (project.tags && project.tags.length > 0
    ? project.tags
    : ['React', 'Node.js', 'MongoDB', 'AI']
  ).slice(0, 4);

  return (
    <div className="group rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] hover:bg-[#141725] hover:border-indigo-500/40 p-6 sm:p-7 transition-all duration-200 flex flex-col justify-between space-y-6">
      <Link to={`/projects/${project._id}`} className="block space-y-3.5">
        {/* Top: Title & Progress % */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
            {project.title}
          </h3>
          <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full shrink-0">
            {progress}%
          </span>
        </div>

        {/* Short description */}
        <p className="text-xs sm:text-sm text-[var(--text-muted)] line-clamp-2 leading-relaxed">
          {project.description || project.abstract || 'AI-powered project lifecycle platform for students.'}
        </p>

        {/* Tech tags */}
        <div className="text-xs font-mono text-[var(--text-dim)]">
          {tags.join(' · ')}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-zinc-800/80 overflow-hidden">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </Link>

      {/* Bottom: Team avatars + Due date + Continue button */}
      <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)]">
        {/* Team Avatars */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2 overflow-hidden">
            {project.members && project.members.length > 0 ? (
              project.members.slice(0, 4).map((m, idx) => (
                <div key={idx} className="ring-2 ring-[#10131F] rounded-full">
                  <Avatar
                    name={m.user?.name || 'Member'}
                    src={m.user?.profileImage || m.user?.avatar}
                    size="xs"
                  />
                </div>
              ))
            ) : (
              <Avatar name="Team" size="xs" />
            )}
          </div>
          {project.members && project.members.length > 4 && (
            <span className="text-[10px] text-[var(--text-dim)] font-medium">
              +{project.members.length - 4}
            </span>
          )}
        </div>

        {/* Due date & Action */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-[var(--text-dim)]">
            Due {deadlineText}
          </span>

          <Link
            to={`/projects/${project._id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors"
          >
            <span>Open</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
