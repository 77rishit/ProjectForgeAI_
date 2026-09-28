import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { analyticsService } from '../../services/analyticsService';
import { StudentAnalytics, FacultyAnalytics, AdminAnalytics } from '../../types';
import { ProgressBar } from '../../components/ui/ProgressBar';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Cpu
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role || 'student';

  const [studentStats, setStudentStats] = useState<StudentAnalytics | null>(null);
  const [facultyStats, setFacultyStats] = useState<FacultyAnalytics | null>(null);
  const [adminStats, setAdminStats] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        if (role === 'student') {
          const s = await analyticsService.getStudentAnalytics();
          setStudentStats(s);
        } else if (role === 'faculty') {
          const f = await analyticsService.getFacultyAnalytics();
          setFacultyStats(f);
        } else if (role === 'admin') {
          const a = await analyticsService.getAdminAnalytics();
          setAdminStats(a);
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [role]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-main)] tracking-tight">
          {role === 'faculty'
            ? 'Faculty Cohort Analytics'
            : role === 'admin'
            ? 'Institutional Analytics'
            : 'Performance & Velocity'}
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
          Milestone completion velocity, skill acquisition metrics, and project health indicators.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-[var(--text-dim)] font-mono text-xs">Computing analytical metrics...</div>
      ) : role === 'student' && studentStats ? (
        /* Student Analytics View */
        <div className="space-y-6">
          {/* Top KPI row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 sm:p-6 rounded-2xl border border-[var(--border-subtle)] bg-[#10131F]">
              <span className="text-xs text-[var(--text-dim)] block mb-1">Task Completion</span>
              <span className="text-2xl font-bold text-[var(--text-main)] font-mono">{studentStats.taskCompletionRate}%</span>
              <ProgressBar value={studentStats.taskCompletionRate} className="mt-2" color="indigo" showValue={false} />
            </div>

            <div className="p-5 sm:p-6 rounded-2xl border border-[var(--border-subtle)] bg-[#10131F]">
              <span className="text-xs text-[var(--text-dim)] block mb-1">Tasks Completed</span>
              <span className="text-2xl font-bold text-emerald-400 font-mono">
                {studentStats.completedTasks}/{studentStats.totalTasks}
              </span>
              <span className="text-[11px] text-[var(--text-dim)] mt-1 block">Active Sprint</span>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl border border-[var(--border-subtle)] bg-[#10131F]">
              <span className="text-xs text-[var(--text-dim)] block mb-1">Approved Milestones</span>
              <span className="text-2xl font-bold text-indigo-400 font-mono">
                {studentStats.approvedMilestones}/{studentStats.totalMilestones}
              </span>
              <span className="text-[11px] text-[var(--text-dim)] mt-1 block">Graded & Ready</span>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl border border-[var(--border-subtle)] bg-[#10131F]">
              <span className="text-xs text-[var(--text-dim)] block mb-1">Average Team Health</span>
              <span className="text-2xl font-bold text-emerald-400 font-mono">{studentStats.healthAverage}%</span>
              <span className="text-[11px] text-emerald-400/80 mt-1 block">Healthy</span>
            </div>
          </div>

          {/* Skill Acquisition & Velocity Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="p-6 sm:p-7 rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] space-y-4">
              <h3 className="text-sm font-semibold text-[var(--text-main)] flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <span>Skill Proficiency & Project Application</span>
              </h3>

              <div className="space-y-3 pt-1">
                {studentStats.topSkills?.map((skill) => (
                  <div key={skill.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[var(--text-main)]">{skill.name}</span>
                      <span className="font-mono text-indigo-400 font-semibold">{skill.count}%</span>
                    </div>
                    <ProgressBar value={skill.count} color="indigo" showValue={false} />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 sm:p-7 rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-main)] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Velocity Recommendations</span>
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                  Suggestions from the AI project coach:
                </p>

                <div className="space-y-2.5 text-xs text-[var(--text-main)] mt-3">
                  <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Maintain sprint cadence for Milestone deliverables ahead of faculty submission deadlines.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>Expand automated test coverage to maintain high technical execution scores on rubrics.</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-400">
                Capstone portfolio export will be generated upon final milestone approval.
              </div>
            </div>
          </div>
        </div>
      ) : role === 'faculty' && facultyStats ? (
        /* Faculty Analytics View */
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
              <span className="text-xs text-[var(--text-dim)] block mb-1">Supervised Projects</span>
              <span className="text-2xl font-bold text-[var(--text-main)] font-mono">{facultyStats.supervisedProjectsCount}</span>
            </div>

            <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
              <span className="text-xs text-[var(--text-dim)] block mb-1">Pending Reviews</span>
              <span className="text-2xl font-bold text-amber-400 font-mono">{facultyStats.pendingReviewsCount}</span>
            </div>

            <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
              <span className="text-xs text-[var(--text-dim)] block mb-1">Average Rubric Score</span>
              <span className="text-2xl font-bold text-emerald-400 font-mono">{facultyStats.averageRubricScore}%</span>
            </div>

            <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
              <span className="text-xs text-[var(--text-dim)] block mb-1">Approved Milestones</span>
              <span className="text-2xl font-bold text-indigo-400 font-mono">{facultyStats.approvedMilestonesCount}</span>
            </div>
          </div>
        </div>
      ) : role === 'admin' && adminStats ? (
        /* Admin Analytics View */
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
              <span className="text-xs text-[var(--text-dim)] block mb-1">Total Enrolled</span>
              <span className="text-2xl font-bold text-[var(--text-main)] font-mono">
                {adminStats.totalStudents + adminStats.totalFaculty}
              </span>
              <span className="text-[11px] text-[var(--text-dim)] mt-1 block">
                {adminStats.totalStudents} Students / {adminStats.totalFaculty} Faculty
              </span>
            </div>

            <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
              <span className="text-xs text-[var(--text-dim)] block mb-1">Total Projects</span>
              <span className="text-2xl font-bold text-indigo-400 font-mono">{adminStats.totalProjects}</span>
              <span className="text-[11px] text-[var(--text-dim)] mt-1 block">
                {adminStats.activeProjects} active sprints
              </span>
            </div>

            <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
              <span className="text-xs text-[var(--text-dim)] block mb-1">Project Completion Rate</span>
              <span className="text-2xl font-bold text-emerald-400 font-mono">{adminStats.completionRate}%</span>
              <ProgressBar value={adminStats.completionRate} className="mt-2" color="emerald" showValue={false} />
            </div>

            <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
              <span className="text-xs text-[var(--text-dim)] block mb-1">Tasks Executed</span>
              <span className="text-2xl font-bold text-indigo-400 font-mono">
                {adminStats.completedTasks}/{adminStats.totalTasks}
              </span>
              <span className="text-[11px] text-[var(--text-dim)] mt-1 block font-mono">Verified Deliverables</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
