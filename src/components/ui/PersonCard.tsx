import React from 'react';
import { Sparkles, Send, UserCheck, GraduationCap, Building2 } from 'lucide-react';
import { Avatar } from './Avatar';
import { Button } from './Button';

export interface PersonCardProps {
  id: string;
  name: string;
  avatarUrl?: string;
  role?: string;
  department?: string;
  semester?: string | number;
  skills?: string[];
  compatibilityScore?: number;
  aiExplanation?: string;
  isAvailable?: boolean;
  onViewProfile?: () => void;
  onInvite?: () => void;
  className?: string;
}

export const PersonCard: React.FC<PersonCardProps> = ({
  name,
  avatarUrl,
  role = 'Technical Collaborator',
  department,
  semester,
  skills = [],
  compatibilityScore,
  aiExplanation,
  isAvailable = true,
  onViewProfile,
  onInvite,
  className = ''
}) => {
  return (
    <div
      className={`rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] p-6 sm:p-7 transition-all hover:border-indigo-500/35 hover:bg-[#141824] flex flex-col justify-between gap-5 group ${className}`}
    >
      <div className="space-y-4">
        {/* Top Header: Avatar & Synergy Score */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <Avatar name={name} src={avatarUrl} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {name}
                </h3>
                {isAvailable && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400" title="Open to Teams" />
                )}
              </div>
              <p className="text-xs text-indigo-300 font-medium mt-0.5">
                {role}
              </p>
              {(department || semester) && (
                <p className="text-[11px] text-[var(--text-dim)] mt-0.5">
                  {department} {semester ? `· ${semester}` : ''}
                </p>
              )}
            </div>
          </div>

          {compatibilityScore !== undefined && (
            <div className="text-right shrink-0">
              <span className="inline-block px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-bold font-mono">
                {compatibilityScore}% match
              </span>
            </div>
          )}
        </div>

        {/* AI Synergy Rationale */}
        {aiExplanation && (
          <div className="p-3 rounded-xl bg-indigo-500/8 border border-indigo-500/15 flex items-start gap-2 text-xs text-indigo-200/90 leading-relaxed">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <span>{aiExplanation}</span>
          </div>
        )}

        {/* Skills Tags */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {skills.slice(0, 4).map((s) => (
              <span
                key={s}
                className="px-2.5 py-1 rounded-lg bg-white/[0.04] text-[var(--text-dim)] text-xs font-mono"
              >
                {s}
              </span>
            ))}
            {skills.length > 4 && (
              <span className="px-2 py-1 rounded-lg bg-white/[0.02] text-[var(--text-dim)] text-[11px]">
                +{skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 pt-3 border-t border-[var(--border-subtle)]">
        {onViewProfile && (
          <Button onClick={onViewProfile} variant="secondary" size="sm" className="flex-1">
            View Profile
          </Button>
        )}
        {onInvite && (
          <Button
            onClick={onInvite}
            variant="primary"
            size="sm"
            className="flex-1"
            icon={<Send className="w-3.5 h-3.5" />}
          >
            Invite
          </Button>
        )}
      </div>
    </div>
  );
};
