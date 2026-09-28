import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { milestoneService } from '../../services/milestoneService';
import { Milestone, Project } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import {
  CheckCircle2,
  Clock,
  Send,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface MilestoneTrackerProps {
  project: Project;
  milestones: Milestone[];
  onMilestonesUpdated: () => void;
}

export const MilestoneTracker: React.FC<MilestoneTrackerProps> = ({
  project,
  milestones,
  onMilestonesUpdated
}) => {
  const { user } = useAuth();
  const toast = useToast();

  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Toggle deliverable checklist
  const handleToggleDeliverable = async (milestone: Milestone, deliverableIndex: number) => {
    try {
      const updatedDeliverables = [...milestone.deliverables];
      updatedDeliverables[deliverableIndex].completed = !updatedDeliverables[deliverableIndex].completed;

      await milestoneService.updateMilestone(milestone._id, {
        deliverables: updatedDeliverables
      });

      onMilestonesUpdated();
    } catch (err: any) {
      toast.error(err.message || 'Error updating deliverable');
    }
  };

  const handleOpenSubmit = (m: Milestone) => {
    setSelectedMilestone(m);
    setSubmissionNotes(m.submissionNotes || '');
    setSubmissionUrl(m.submissionUrl || '');
    setIsSubmitModalOpen(true);
  };

  const handleSubmitMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMilestone) return;

    setSubmitting(true);
    try {
      await milestoneService.submitMilestone(
        selectedMilestone._id,
        submissionNotes,
        submissionUrl
      );
      toast.success('Milestone submitted for faculty review!');
      setIsSubmitModalOpen(false);
      onMilestonesUpdated();
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit milestone');
    } finally {
      setSubmitting(false);
    }
  };

  const defaultPhases = [
    { order: 1, title: '01 Research & Proposal', desc: 'Domain analysis, user research, and project charter.' },
    { order: 2, title: '02 UI Design & System Architecture', desc: 'Component tokens, data schemas, and API definitions.' },
    { order: 3, title: '03 Development & Core Sprints', desc: 'Full-stack implementation, model integration, and testing.' },
    { order: 4, title: '04 Testing & Evaluation', desc: 'End-to-end QA, benchmarking, and security audits.' },
    { order: 5, title: '05 Launch & Final Capstone Defense', desc: 'Public deployment, presentation deck, and defense.' }
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto w-full">
      {/* 1. SECTION HEADER */}
      <div className="space-y-1">
        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Project Milestone Timeline
        </h3>
        <p className="text-xs sm:text-sm text-[var(--text-muted)]">
          Follow the five-stage academic roadmap from initial research through final defense.
        </p>
      </div>

      {/* 2. TIMELINE VISUAL (01 Research -> 02 UI Design -> 03 Development -> 04 Testing -> 05 Launch) */}
      <div className="relative pl-8 sm:pl-10 space-y-10 before:absolute before:left-4 before:top-3 before:bottom-3 before:w-[2px] before:bg-white/10">
        {(milestones.length > 0
          ? milestones
          : (defaultPhases.map((p) => ({
              _id: `m_${p.order}`,
              order: p.order,
              title: p.title,
              description: p.desc,
              status: (p.order === 1 ? 'approved' : p.order === 2 ? 'in_progress' : 'pending') as any,
              targetDate: new Date(Date.now() + p.order * 7 * 86400000).toISOString(),
              deliverables: [
                { title: 'Project specification document', completed: p.order === 1 },
                { title: 'Repository & branch configuration', completed: p.order === 1 }
              ],
              projectId: project._id,
              createdAt: new Date().toISOString()
            })) as Milestone[])
        ).map((m, idx) => {
          const isApproved = m.status === 'approved';
          const isSubmitted = m.status === 'submitted';
          const isInProgress = m.status === 'in_progress';

          return (
            <div key={m._id} className="relative space-y-4">
              {/* Timeline Node Bullet */}
              <div
                className={`absolute -left-[37px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-[#080A12] text-xs font-mono font-bold ${
                  isApproved
                    ? 'bg-emerald-500 text-white'
                    : isSubmitted
                    ? 'bg-amber-500 text-white'
                    : isInProgress
                    ? 'bg-indigo-600 text-white animate-pulse'
                    : 'bg-zinc-800 text-zinc-500'
                }`}
              >
                {isApproved ? '✓' : `0${m.order || idx + 1}`}
              </div>

              {/* Milestone Box */}
              <div
                className={`p-6 sm:p-7 rounded-2xl border transition-all space-y-4 ${
                  isApproved
                    ? 'border-emerald-500/25 bg-[#10131F]'
                    : isSubmitted
                    ? 'border-amber-500/25 bg-[#10131F]'
                    : isInProgress
                    ? 'border-indigo-500/35 bg-[#141725]'
                    : 'border-[var(--border-subtle)] bg-[#0B0D16]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-indigo-400 font-bold uppercase">
                        Phase 0{m.order || idx + 1}
                      </span>
                      <span className="text-zinc-600">·</span>
                      <span className="text-xs font-mono text-[var(--text-dim)] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Target: {new Date(m.targetDate).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-white mt-1">{m.title}</h4>
                    <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5 leading-relaxed">
                      {m.description}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="shrink-0 flex items-center gap-2">
                    <span
                      className={`text-xs font-mono font-semibold px-3 py-1 rounded-full uppercase tracking-wider ${
                        isApproved
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : isSubmitted
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : isInProgress
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {m.status.replace('_', ' ')}
                    </span>

                    {m.status !== 'approved' && (
                      <button
                        onClick={() => handleOpenSubmit(m)}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>Submit Work</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Deliverables Checklist */}
                {m.deliverables && m.deliverables.length > 0 && (
                  <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2">
                    <div className="text-xs font-mono text-[var(--text-dim)] uppercase font-semibold">
                      Deliverables Checklist:
                    </div>
                    <div className="space-y-1.5">
                      {m.deliverables.map((del, dIdx) => (
                        <div
                          key={dIdx}
                          onClick={() => handleToggleDeliverable(m, dIdx)}
                          className="flex items-center gap-2.5 text-xs text-[var(--text-main)] cursor-pointer hover:text-white"
                        >
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                              del.completed
                                ? 'bg-indigo-600 border-indigo-500 text-white'
                                : 'border-zinc-700 bg-black/20'
                            }`}
                          >
                            {del.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                          </div>
                          <span className={del.completed ? 'line-through text-zinc-500' : ''}>
                            {del.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Faculty Evaluation Score (if evaluated) */}
                {m.review && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-emerald-400 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Faculty Evaluation Score: {m.review.overallScore} / 10</span>
                      </div>
                      <span className="font-mono text-[10px]">Reviewed by {m.review.faculty?.name}</span>
                    </div>
                    {m.review.feedback && (
                      <p className="text-[var(--text-muted)] italic leading-relaxed">
                        "{m.review.feedback}"
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submission Modal */}
      {selectedMilestone && (
        <Modal
          isOpen={isSubmitModalOpen}
          onClose={() => setIsSubmitModalOpen(false)}
          title={`Submit Deliverable: ${selectedMilestone.title}`}
        >
          <form onSubmit={handleSubmitMilestone} className="space-y-4 pt-2">
            <Input
              label="Repository or Live Demo URL"
              placeholder="https://github.com/..."
              value={submissionUrl}
              onChange={(e) => setSubmissionUrl(e.target.value)}
              required
            />

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-muted)]">Submission Notes</label>
              <textarea
                value={submissionNotes}
                onChange={(e) => setSubmissionNotes(e.target.value)}
                placeholder="Highlight completed sprint tickets, unit test coverage, or architecture decisions..."
                rows={4}
                className="w-full p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] text-xs sm:text-sm text-[var(--text-main)] placeholder:text-[var(--text-dim)] outline-none focus:border-indigo-500/50"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
              <Button type="button" variant="ghost" onClick={() => setIsSubmitModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={submitting}>
                Submit for Evaluation
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
