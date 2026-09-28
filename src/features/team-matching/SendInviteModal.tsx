import React, { useState } from 'react';
import { User, Project, TeammateMatch } from '../../types';
import { matchingService } from '../../services/matchingService';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Avatar } from '../../components/ui/Avatar';
import { Sparkles, Send, CheckCircle2, Clock, FolderGit2 } from 'lucide-react';

interface SendInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate?: User | null;
  match?: TeammateMatch | null;
  projects: Project[];
  onSuccess?: () => void;
  onInviteSent?: () => void;
}

export const SendInviteModal: React.FC<SendInviteModalProps> = ({
  isOpen,
  onClose,
  candidate,
  match,
  projects,
  onSuccess,
  onInviteSent
}) => {
  const toast = useToast();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?._id || '');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const effectiveCandidate = candidate || match?.user || null;

  if (!effectiveCandidate) return null;

  const projectOptions = projects.map((p) => ({
    value: p._id,
    label: `${p.title} (${p.category})`
  }));

  const handleSend = async () => {
    if (!selectedProjectId) {
      toast.error('Please select a project to invite this teammate to.');
      return;
    }

    setSending(true);
    try {
      await matchingService.sendRequest({
        toUserId: effectiveCandidate._id,
        projectId: selectedProjectId,
        type: 'invite',
        message:
          message ||
          `Hi ${effectiveCandidate.name.split(' ')[0]}, I reviewed your profile and believe your complementary skills would be a great fit for our team!`,
        compatibilityScore: match?.compatibilityScore || 85,
        matchHighlights: match?.whyMatches || match?.matchHighlights || []
      });

      toast.success(`Team invitation dispatched to ${effectiveCandidate.name}!`);
      onSuccess?.();
      onInviteSent?.();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Error sending invitation');
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title={
        <div className="flex items-center gap-2">
          <Send className="w-5 h-5 text-indigo-400" />
          <span>Invite Teammate to Project</span>
        </div>
      }
      description="Send a project invitation with personalized compatibility highlights."
    >
      <div className="flex flex-col gap-5">
        {/* Candidate Mini Card */}
        <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/5 border border-white/10">
          <Avatar name={effectiveCandidate.name} size="md" src={effectiveCandidate.profileImage || effectiveCandidate.avatar} />
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm text-white truncate">{effectiveCandidate.name}</h4>
            <p className="text-xs text-[var(--text-muted)] truncate">
              {effectiveCandidate.preferredRole || 'Technical Collaborator'} • {effectiveCandidate.department}
            </p>
          </div>
          {match?.compatibilityScore && (
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-bold font-mono">
              {match.compatibilityScore}% Match
            </span>
          )}
        </div>

        {/* Project Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
            <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Target Project Team</span>
          </label>
          {projects.length === 0 ? (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
              You do not currently lead any active projects. Create a project first to invite teammates.
            </div>
          ) : (
            <Select
              options={projectOptions}
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
            />
          )}
        </div>

        {/* Message Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
            Personal Note (Optional)
          </label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Hi ${effectiveCandidate.name.split(' ')[0]}, our project needs strong ${match?.complementarySkills?.[0] || 'engineering'} capabilities...`}
            className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] p-3 text-xs sm:text-sm text-[var(--text-main)] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none"
          />
        </div>

        {/* Match Highlights Preview */}
        {match?.whyMatches && match.whyMatches.length > 0 && (
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col gap-1 text-[11px] text-indigo-200">
            <span className="font-bold text-indigo-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Attached Synergy Rationale</span>
            </span>
            <p className="line-clamp-2">{match.whyMatches[0]}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-subtle)]">
          <Button onClick={onClose} variant="ghost" size="sm">
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            variant="glow"
            size="sm"
            loading={sending}
            disabled={projects.length === 0}
            icon={<Send className="w-3.5 h-3.5" />}
          >
            Send Invitation
          </Button>
        </div>
      </div>
    </Modal>
  );
};
