import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { projectService } from '../../services/projectService';
import { analyticsService } from '../../services/analyticsService';
import { Project, FacultyAnalytics, Milestone } from '../../types';
import { Avatar } from '../../components/ui/Avatar';
import { RubricEvaluationModal } from '../faculty/RubricEvaluationModal';
import {
  ClipboardCheck,
  AlertTriangle,
  Award,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Users,
  FolderGit2,
  TrendingUp
} from 'lucide-react';
import { formatDeadline } from '../../utils/formatters';

export const FacultyDashboard: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [analytics, setAnalytics] = useState<FacultyAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  // Review modal state
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [supervised, facultyStats] = await Promise.all([
          projectService.getFacultySupervised(),
          analyticsService.getFacultyAnalytics()
        ]);
        setProjects(supervised);
        setAnalytics(facultyStats);
      } catch (err) {
        console.error('Failed to load faculty dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleOpenReview = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setIsReviewModalOpen(true);
  };

  const handleReviewCompleted = () => {
    setIsReviewModalOpen(false);
    analyticsService.getFacultyAnalytics().then(setAnalytics);
    projectService.getFacultySupervised().then(setProjects);
  };

  const pendingMilestones = analytics?.pendingMilestones || [];
  const atRiskList = analytics?.atRiskProjects || [];

  return (
    <div className="space-y-12 sm:space-y-16 max-w-7xl mx-auto w-full">
      {/* 1. TOP HEADER & METRIC SUMMARY */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-main)] tracking-tight">
              Faculty Mentorship Portal
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-muted)] font-normal">
              Supervise capstone projects, grade milestone submissions, and guide student teams.
            </p>
          </div>

          <Link
            to="/faculty/reviews"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-indigo-600/25 active:scale-[0.98] transition-all self-start sm:self-auto"
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Review Queue ({analytics?.pendingReviewsCount || 0})</span>
          </Link>
        </div>

        {/* Status Line (No giant ERP stat cards!) */}
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[var(--text-muted)] pt-3 border-t border-[var(--border-subtle)]">
          <span className="font-semibold text-white font-mono">{projects.length}</span>
          <span>mentored projects</span>
          <span className="text-zinc-600">·</span>
          <span className="font-semibold text-amber-400 font-mono">{analytics?.pendingReviewsCount || 0}</span>
          <span>pending reviews</span>
          <span className="text-zinc-600">·</span>
          <span className="font-semibold text-indigo-400 font-mono">{analytics?.averageRubricScore || 88}%</span>
          <span>average rubric score</span>
          <span className="text-zinc-600">·</span>
          <span className="font-semibold text-rose-400 font-mono">{atRiskList.length}</span>
          <span>at-risk</span>
        </div>
      </div>

      {/* 2. AT-RISK PROJECTS ALERT SECTION (IF ANY) */}
      {atRiskList.length > 0 && (
        <div className="space-y-4">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>AT-RISK PROJECT ALERTS ({atRiskList.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {atRiskList.map((item) => (
              <div
                key={item.id}
                className="p-6 sm:p-7 rounded-2xl border border-rose-500/30 bg-[#160E18] space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-base font-bold text-white">{item.title}</h4>
                  <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2.5 py-0.5 rounded-full shrink-0">
                    Health: {item.healthScore}%
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Project milestone deadlines overdue or inactive sprint commits detected in repository.
                </p>
                <div className="pt-2 flex justify-end">
                  <Link
                    to={`/projects/${item.id}`}
                    className="text-xs font-semibold text-rose-300 hover:text-white flex items-center gap-1"
                  >
                    <span>Inspect workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. TWO COLUMN: SUBMISSIONS QUEUE + SUPERVISED PROJECTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* LEFT COLUMN: Submissions Awaiting Evaluation (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-dim)]">
              PENDING SUBMISSIONS ({pendingMilestones.length})
            </div>
            <Link to="/faculty/reviews" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
              View queue →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 rounded-2xl bg-[#10131F]/50 border border-[var(--border-subtle)] animate-pulse" />
              ))}
            </div>
          ) : pendingMilestones.length === 0 ? (
            <div className="p-10 text-center rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] space-y-2">
              <ClipboardCheck className="w-8 h-8 text-emerald-400 mx-auto" />
              <h3 className="text-sm font-bold text-white">Grading Queue Clear</h3>
              <p className="text-xs text-[var(--text-muted)]">All submitted student deliverables have been reviewed.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingMilestones.map((m) => (
                <div
                  key={m._id}
                  className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] hover:bg-[#141725] transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase">
                        Needs Rubric Review
                      </span>
                      <h4 className="text-base font-bold text-white pt-1">{m.title}</h4>
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed">{m.description}</p>
                    </div>

                    <button
                      onClick={() => handleOpenReview(m)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 self-start shrink-0 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Grade Rubric</span>
                    </button>
                  </div>

                  {m.submissionNotes && (
                    <div className="p-3 rounded-xl bg-[#0B0D16] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)] italic">
                      "{m.submissionNotes}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Supervised Projects (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-dim)]">
            SUPERVISED PROJECTS ({projects.length})
          </div>

          <div className="space-y-4">
            {projects.slice(0, 4).map((p) => {
              const progress = p.progress ?? 68;
              return (
                <div
                  key={p._id}
                  className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] hover:bg-[#141725] transition-all space-y-3.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      to={`/projects/${p._id}`}
                      className="text-base font-bold text-white hover:text-indigo-300 transition-colors line-clamp-1"
                    >
                      {p.title}
                    </Link>
                    <span className="text-xs font-mono font-bold text-indigo-400">
                      {progress}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-[var(--text-dim)] pt-1">
                    <span>{p.members?.length || 1} team members</span>
                    <Link
                      to={`/projects/${p._id}`}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                      Inspect →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Rubric Evaluation Modal */}
      {selectedMilestone && (
        <RubricEvaluationModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          milestone={selectedMilestone}
          onReviewed={handleReviewCompleted}
        />
      )}
    </div>
  );
};
