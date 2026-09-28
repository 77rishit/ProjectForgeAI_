import React from 'react';
import { User } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import {
  GraduationCap,
  Clock,
  Sparkles,
  ExternalLink,
  Globe,
  Award,
  BookOpen,
  Code2,
  Calendar,
  CheckCircle2,
  Send,
  Building2
} from 'lucide-react';

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onInvite?: (user: User) => void;
  matchScore?: number;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onInvite,
  matchScore
}) => {
  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-indigo-400" />
          <span>Student Candidate Profile</span>
        </div>
      }
      description="Verified academic profile, skill competencies, and portfolio track record."
    >
      <div className="flex flex-col gap-6 max-h-[75vh] overflow-y-auto pr-1">
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-indigo-950/30 to-purple-950/20 border border-indigo-500/20">
          <div className="flex items-center gap-4">
            <Avatar name={user.name} size="xl" src={user.profileImage || user.avatar} />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white">{user.name}</h3>
                {user.lookingForTeam && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Open to Teams
                  </span>
                )}
              </div>
              <p className="text-xs text-indigo-300 font-semibold mt-0.5">
                {user.preferredRole || 'Technical Collaborator'}
              </p>
              <div className="flex items-center gap-3 text-xs text-[var(--text-dim)] mt-1.5">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                  {user.department}
                </span>
                <span>•</span>
                <span>{user.semester || 'Semester 6'}</span>
              </div>
            </div>
          </div>

          {matchScore !== undefined && (
            <div className="flex flex-col items-end shrink-0 bg-black/40 px-4 py-2.5 rounded-xl border border-indigo-500/30">
              <span className="text-2xl font-black text-cyan-400">{matchScore}%</span>
              <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider">AI Compatibility</span>
            </div>
          )}
        </div>

        {/* Bio */}
        {user.bio && (
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-[var(--text-dim)] uppercase tracking-wider">About</span>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed p-3.5 rounded-xl bg-white/5 border border-white/10">
              {user.bio}
            </p>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1">
            <span className="text-[11px] text-[var(--text-dim)] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Availability</span>
            </span>
            <span className="text-sm font-bold text-white">
              {user.availabilityHours || user.availability || 15} hrs / week
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1">
            <span className="text-[11px] text-[var(--text-dim)] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Experience</span>
            </span>
            <span className="text-sm font-bold text-white">
              {user.experience || 'Intermediate'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-[var(--text-dim)] flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Total Skills</span>
            </span>
            <span className="text-sm font-bold text-white">
              {user.skills?.length || 0} registered
            </span>
          </div>
        </div>

        {/* Verified Skills */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-[var(--text-dim)] uppercase tracking-wider flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Technical Skills & Proficiencies</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {(user.skills || []).map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-main)] font-mono text-xs font-semibold border border-[var(--border-subtle)]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Interests */}
        {user.interests && user.interests.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-[var(--text-dim)] uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Academic & Research Interests</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-300 text-xs font-medium border border-cyan-500/20"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {user.achievements && user.achievements.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-[var(--text-dim)] uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Honors & Hackathon Awards</span>
            </span>
            <div className="space-y-2">
              {user.achievements.map((ach: any, idx: number) => (
                <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                  <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs">
                    <strong className="text-white block">{ach.title}</strong>
                    {ach.description && <p className="text-[var(--text-muted)] mt-0.5">{ach.description}</p>}
                    <span className="text-[10px] text-[var(--text-dim)] mt-1 block">
                      {ach.issuer} {ach.date ? `• ${ach.date}` : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Social / External Links */}
        <div className="flex items-center gap-3 pt-2 border-t border-[var(--border-subtle)]">
          {user.github && (
            <a
              href={user.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-white px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 transition-colors"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          )}
          {user.linkedin && (
            <a
              href={user.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-cyan-400 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 transition-colors"
            >
              <LinkedinIcon className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>
          )}
          {user.portfolio && (
            <a
              href={user.portfolio}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-indigo-400 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Portfolio</span>
            </a>
          )}
        </div>
      </div>

      {/* Footer Modal Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-subtle)] mt-2">
        <Button onClick={onClose} variant="ghost" size="sm">
          Close
        </Button>
        {onInvite && (
          <Button
            onClick={() => {
              onClose();
              onInvite(user);
            }}
            variant="glow"
            size="sm"
            icon={<Send className="w-3.5 h-3.5" />}
          >
            Send Team Invitation
          </Button>
        )}
      </div>
    </Modal>
  );
};
