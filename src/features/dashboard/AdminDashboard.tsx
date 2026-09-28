import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../../services/analyticsService';
import { AdminAnalytics } from '../../types';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import {
  ShieldCheck,
  Users,
  FolderGit2,
  CheckCircle2,
  Cpu,
  Layers
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const stats = await analyticsService.getAdminAnalytics();
        setAnalytics(stats);
      } catch (err) {
        console.error('Failed to load admin analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-main)] tracking-tight">
            Academic Administration
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            System-wide platform health, user directories, and project lifecycle metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/team-matching">
            <Button variant="secondary" size="sm" icon={<Users className="w-3.5 h-3.5" />}>
              Manage Users
            </Button>
          </Link>
          <Link to="/projects">
            <Button variant="primary" size="sm" icon={<FolderGit2 className="w-3.5 h-3.5" />}>
              All Projects
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
          <div className="text-xs text-[var(--text-dim)] font-medium">Enrolled Students</div>
          <div className="text-2xl font-bold text-[var(--text-main)] mt-1">{analytics?.totalStudents || 0}</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1">Active learners</div>
        </div>

        <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
          <div className="text-xs text-[var(--text-dim)] font-medium">Faculty Mentors</div>
          <div className="text-2xl font-bold text-indigo-400 mt-1">{analytics?.totalFaculty || 0}</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1">Supervisors</div>
        </div>

        <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
          <div className="text-xs text-[var(--text-dim)] font-medium">Total Projects</div>
          <div className="text-2xl font-bold text-[var(--text-main)] mt-1">{analytics?.totalProjects || 0}</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1">All cohorts</div>
        </div>

        <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
          <div className="text-xs text-[var(--text-dim)] font-medium">Completed Tasks</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{analytics?.completedTasks || 0}</div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1">Milestones resolved</div>
        </div>
      </div>

      {/* Grid: Category distribution & AI Provider Config */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Category breakdown */}
        <div className="p-5 sm:p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[var(--text-main)] flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Project Category Distribution</span>
            </h2>
            <span className="text-[11px] text-[var(--text-dim)] font-mono">By Domain</span>
          </div>

          <div className="space-y-3.5 pt-1">
            {loading ? (
              <div className="p-6 text-center text-[var(--text-dim)] text-xs">Loading analytics...</div>
            ) : analytics?.categoryDistribution?.map((cat) => (
              <div key={cat.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[var(--text-main)]">{cat.category}</span>
                  <span className="font-mono text-indigo-400 font-semibold">{cat.count} project(s)</span>
                </div>
                <ProgressBar
                  value={cat.count}
                  max={Math.max(...(analytics.categoryDistribution.map((c) => c.count) || [1]))}
                  color="indigo"
                  showValue={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* AI & Infrastructure Settings */}
        <div className="p-5 sm:p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[var(--text-main)] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>AI Engine & Infrastructure</span>
            </h2>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.2 rounded-full">
              Operational
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-between">
              <div>
                <div className="font-medium text-[var(--text-main)]">Active AI Engine</div>
                <div className="text-[var(--text-dim)] text-[11px]">Pluggable service with local fallback</div>
              </div>
              <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20">
                Local Engine
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-between">
              <div>
                <div className="font-medium text-[var(--text-main)]">Pluggable Provider Support</div>
                <div className="text-[var(--text-dim)] text-[11px]">Google Gemini / OpenAI via environment variables</div>
              </div>
              <span className="text-emerald-400 font-mono text-[11px] font-semibold">Enabled</span>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-between">
              <div>
                <div className="font-medium text-[var(--text-main)]">Database Connection</div>
                <div className="text-[var(--text-dim)] text-[11px]">MongoDB ProjectForge Database</div>
              </div>
              <span className="text-emerald-400 font-mono text-[11px] font-semibold">Connected</span>
            </div>

            {/* Top Tech Stacks */}
            <div className="pt-2 border-t border-[var(--border-subtle)]">
              <div className="font-medium text-[var(--text-main)] mb-2">Most Adopted Technologies</div>
              <div className="flex flex-wrap gap-1.5">
                {analytics?.topTechStacks?.map((stack) => (
                  <span
                    key={stack.tech}
                    className="px-2.5 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[var(--text-muted)] text-[11px]"
                  >
                    {stack.tech} ({stack.count})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
