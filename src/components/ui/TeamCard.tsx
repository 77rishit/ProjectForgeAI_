import React from 'react';
import { Users, FolderGit2, ArrowRight } from 'lucide-react';
import { Avatar } from './Avatar';
import { Button } from './Button';

export interface TeamMember {
  name: string;
  role: string;
  avatar?: string;
  isLead?: boolean;
}

export interface TeamCardProps {
  id: string;
  name: string;
  projectTitle: string;
  members: TeamMember[];
  openRoles?: string[];
  onClick?: () => void;
  onInvite?: () => void;
  className?: string;
}

export const TeamCard: React.FC<TeamCardProps> = ({
  name,
  projectTitle,
  members,
  openRoles = [],
  onClick,
  onInvite,
  className = ''
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] hover:bg-[#141824] hover:border-indigo-500/35 p-6 sm:p-7 transition-all flex flex-col justify-between gap-5 group cursor-pointer ${className}`}
    >
      <div className="space-y-4">
        {/* Team Header & Project Link */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <FolderGit2 className="w-3.5 h-3.5" />
              {projectTitle}
            </span>
            <span className="text-xs font-mono text-[var(--text-dim)]">
              {members.length} members
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
            {name}
          </h3>
        </div>

        {/* Member Avatars & Roles */}
        <div className="space-y-2.5 pt-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-dim)]">
            Core Team
          </div>
          <div className="flex flex-wrap gap-2">
            {members.map((m, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-white/[0.03] border border-white/[0.05]"
              >
                <Avatar name={m.name} src={m.avatar} size="xs" />
                <div className="text-xs">
                  <span className="font-semibold text-white block">{m.name}</span>
                  <span className="text-[10px] text-[var(--text-muted)] block">{m.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Open Roles */}
        {openRoles.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <div className="text-[11px] font-mono text-emerald-400 font-semibold uppercase tracking-wider">
              Looking for:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {openRoles.map((role) => (
                <span
                  key={role}
                  className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-mono"
                >
                  +{role}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
        <span className="text-xs text-[var(--text-muted)] group-hover:text-white flex items-center gap-1">
          <span>View Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>

        {onInvite && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onInvite();
            }}
            variant="secondary"
            size="sm"
          >
            Invite Member
          </Button>
        )}
      </div>
    </div>
  );
};
