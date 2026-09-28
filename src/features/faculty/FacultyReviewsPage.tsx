import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { Milestone } from '../../types';
import { RubricEvaluationModal } from './RubricEvaluationModal';
import {
  ClipboardCheck,
  Sparkles,
  ExternalLink,
  Clock,
  CheckCircle2,
  FileCode,
  ShieldCheck
} from 'lucide-react';

export const FacultyReviewsPage: React.FC = () => {
  const [pendingMilestones, setPendingMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const stats = await analyticsService.getFacultyAnalytics();
      setPendingMilestones(stats.pendingMilestones || []);
    } catch (err) {
      console.error('Failed to load faculty reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenReview = (m: Milestone) => {
    setSelectedMilestone(m);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto w-full">
      {/* 1. EDITORIAL HEADER */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-main)] tracking-tight">
          Milestone Reviews
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-muted)] font-normal">
          Review student code submissions, evaluate rubrics with AI assistance, and provide formal feedback.
        </p>
      </div>

      {/* 2. REVIEWS QUEUE */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-[#10131F]/50 border border-[var(--border-subtle)] animate-pulse" />
          ))}
        </div>
      ) : pendingMilestones.length === 0 ? (
        <div className="p-16 text-center rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Review Queue Up to Date</h3>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-md mx-auto">
            There are no pending submissions awaiting evaluation. Student teams will submit milestones as sprints conclude.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--text-dim)] border-b border-[var(--border-subtle)] pb-3">
            <span>{pendingMilestones.length} submission(s) pending evaluation</span>
            <span>Rubric scoring required</span>
          </div>

          <div className="space-y-5">
            {pendingMilestones.map((m) => (
              <div
                key={m._id}
                className="p-7 sm:p-8 rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] hover:bg-[#141725] transition-all space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full uppercase">
                        Awaiting Evaluation
                      </span>
                      <span className="text-xs text-[var(--text-dim)] flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        Submitted: {m.submittedAt ? new Date(m.submittedAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white tracking-tight">{m.title}</h3>
                    <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">{m.description}</p>
                  </div>

                  <button
                    onClick={() => handleOpenReview(m)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-sm shadow-indigo-600/25 transition-all self-start shrink-0 cursor-pointer active:scale-[0.98]"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Grade Rubric</span>
                  </button>
                </div>

                {/* Submission notes and PR link */}
                <div className="p-4 rounded-xl bg-[#0B0D16] border border-[var(--border-subtle)] text-xs space-y-2.5">
                  <div className="font-semibold text-white">Student Submission Notes:</div>
                  <p className="text-[var(--text-muted)] italic leading-relaxed">
                    "{m.submissionNotes || 'No notes attached.'}"
                  </p>

                  {m.submissionUrl && (
                    <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center gap-2">
                      <span className="text-[var(--text-dim)]">Repository / Demo:</span>
                      <a
                        href={m.submissionUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 font-mono flex items-center gap-1"
                      >
                        <span>{m.submissionUrl}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedMilestone && (
        <RubricEvaluationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          milestone={selectedMilestone}
          onReviewed={() => {
            setIsModalOpen(false);
            loadData();
          }}
        />
      )}
    </div>
  );
};
