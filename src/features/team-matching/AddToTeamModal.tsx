import React, { useState } from 'react';
import { User, Project, TeammateMatch } from '../../types';
import { matchingService } from '../../services/matchingService';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { UserPlus, CheckCircle2, ShieldCheck, FolderGit2 } from 'lucide-react';

interface AddToTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: User | null;
  match?: TeammateMatch | null;
  projects: Project[];
  onSuccess?: () => void;
}

export const AddToTeamModal: React.FC<AddToTeamModalProps> = ({
  isOpen,
  onClose,
  candidate,
  match,
  projects,
  onSuccess
}) => {
  const toast = useToast();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?._id || '');
  const [role, setRole] = useState(match?.recommendedRole || candidate?.preferredRole || 'Teammate');
  const [adding, setAdding] = useState(false);

  if (!candidate) return null;

  const projectOptions = projects.map((p) => ({
    value: p._id,
    label: `${p.title} (${p.category}) - ${p.members.length}/${p.maxMembers || 5} members`
  }));

  const handleAdd = async () => {
    if (!selectedProjectId) {
      toast.error('Please select a project to add this teammate to.');
      return;
    }

    setAdding(true);
    try {
      const res = await matchingService.addToTeam({
        userId: candidate._id,
        projectId: selectedProjectId,
        role: role.trim() || 'Teammate'
      });

      toast.success(res.message || `${candidate.name} added to the team!`);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to add teammate to project');
    } finally {
      setAdding(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title={
        <div className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-cyan-400" />
          <span>Add Teammate to Project Squad</span>
        </div>
      }
      description="Directly assign a qualified candidate to your active project team."
    >
      <div className="flex flex-col gap-5">
        {/* Candidate Summary */}
        <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/5 border border-white/10">
          <Avatar name={candidate.name} size="md" src={candidate.profileImage || candidate.avatar} />
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm text-white truncate">{candidate.name}</h4>
            <p className="text-xs text-[var(--text-muted)] truncate">
              {candidate.department} • {candidate.semester || 'Semester 6'}
            </p>
          </div>
          {match?.compatibilityScore && (
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-bold font-mono">
              {match.compatibilityScore}% Match
            </span>
          )}
        </div>

        {/* Project Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
            <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Select Target Project</span>
          </label>
          {projects.length === 0 ? (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
              You must be the owner of at least one project to directly add teammates.
            </div>
          ) : (
            <Select
              options={projectOptions}
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
            />
          )}
        </div>

        {/* Role in Project */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
            Assigned Project Role
          </label>
          <Input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Backend Lead, ML Engineer, UI/UX Designer"
          />
        </div>

        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-[var(--text-dim)] flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            The student will be instantly added to the project roster and notified via in-app alerts.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-subtle)]">
          <Button onClick={onClose} variant="ghost" size="sm">
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            variant="glow"
            size="sm"
            loading={adding}
            disabled={projects.length === 0}
            icon={<CheckCircle2 className="w-3.5 h-3.5" />}
          >
            Confirm Add to Team
          </Button>
        </div>
      </div>
    </Modal>
  );
};
