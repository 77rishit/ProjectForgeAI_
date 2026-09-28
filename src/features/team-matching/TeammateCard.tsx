import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send, User as UserIcon } from 'lucide-react';
import { TeammateMatch, User } from '../../types';
import { Avatar } from '../../components/ui/Avatar';

export interface TeammateCardProps {
  match: TeammateMatch;
  onViewProfile: (user: User, score?: number) => void;
  onSendInvite: (match: TeammateMatch) => void;
}

export const TeammateCard: React.FC<TeammateCardProps> = ({
  match,
  onViewProfile,
  onSendInvite
}) => {
  const { user } = match;
  const compatibility = match.compatibilityScore || match.matchPercentage || 94;
  const skills = (match.complementarySkills && match.complementarySkills.length > 0
    ? [...match.complementarySkills, ...(user.skills || [])]
    : user.skills || ['Node.js', 'PostgreSQL', 'Express']
  ).slice(0, 4);

  // Short match explanation snippet
  const matchReason =
    match.whyMatches && match.whyMatches.length > 0
      ? match.whyMatches[0]
      : 'Complements your frontend skills.';

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] hover:bg-[#141725] hover:border-indigo-500/40 p-7 sm:p-8 flex flex-col justify-between space-y-6 transition-all duration-200"
    >
      <div className="space-y-4">
        {/* Top: Large Avatar, Name, Role, Compatibility Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <Avatar
              name={user.name}
              src={user.profileImage || user.avatar}
              size="lg"
            />
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1 tracking-tight">
                {user.name}
              </h3>
              <p className="text-xs text-indigo-400 font-medium line-clamp-1">
                {match.recommendedRole || user.preferredRole || user.department || 'Full Stack Engineer'}
              </p>
            </div>
          </div>

          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold shrink-0">
            {compatibility}%
          </span>
        </div>

        {/* Short AI explanation */}
        <div className="p-3 rounded-xl bg-[#0B0D16] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)] italic leading-relaxed">
          "{matchReason}"
        </div>

        {/* Skills pill tags */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-mono text-[var(--text-dim)] uppercase font-semibold">Skills:</div>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span
                key={s}
                className="px-2.5 py-0.5 rounded-md bg-[#141725] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-muted)]"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Actions: View Profile & Invite */}
      <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between gap-3">
        <button
          onClick={() => onViewProfile(user, compatibility)}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:text-white hover:bg-white/5 border border-[var(--border-subtle)] transition-colors cursor-pointer"
        >
          View Profile
        </button>

        <button
          onClick={() => onSendInvite(match)}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Invite</span>
        </button>
      </div>
    </motion.div>
  );
};
