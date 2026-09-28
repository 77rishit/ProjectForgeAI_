import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Settings,
  Clock,
  Trash2,
  Sparkles,
  Layers,
  Users,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ExternalLink,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { projectService } from '../../services/projectService';
import { activityService } from '../../services/activityService';
import { Project, Task, Milestone, ActivityItem } from '../../types';
import { Avatar } from '../../components/ui/Avatar';
import { Tabs } from '../../components/ui/Tabs';
import { KanbanBoard } from './KanbanBoard';
import { MilestoneTracker } from './MilestoneTracker';
import { ProjectAIAssistant } from './ProjectAIAssistant';
import { ProjectBreakdownModal } from './ProjectBreakdownModal';
import { aiService, ProjectHealthAI } from '../../services/aiService';
import { formatDeadline, formatTaskDue, formatRelativeDate } from '../../utils/formatters';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'milestones' | 'assistant' | 'team' | 'activity'>('overview');
  const [loading, setLoading] = useState(true);
  const [isBreakdownModalOpen, setIsBreakdownModalOpen] = useState(false);
  const [auditingHealth, setAuditingHealth] = useState(false);
  const [healthAudit, setHealthAudit] = useState<ProjectHealthAI | null>(null);

  const loadProject = async () => {
    if (!id) return;
    try {
      const [data, acts] = await Promise.all([
        projectService.getProjectById(id),
        activityService.getProjectActivities(id).catch(() => [])
      ]);
      setProject(data.project);
      setTasks(data.tasks || []);
      setMilestones(data.milestones || []);
      setActivities(acts);
    } catch (err: any) {
      toast.error(err.message || 'Error loading project workspace');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  const handleDeleteProject = async () => {
    if (!project) return;
    if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
      try {
        await projectService.deleteProject(project._id);
        toast.info('Project deleted');
        navigate('/projects');
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete project');
      }
    }
  };

  if (loading || !project) {
    return (
      <div className="py-24 text-center text-xs text-zinc-500 font-mono animate-pulse">
        Initializing project workspace canvas...
      </div>
    );
  }

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editStatus, setEditStatus] = useState<string>('in-progress');
  const [editProgress, setEditProgress] = useState<number>(50);
  const [editDeadline, setEditDeadline] = useState('');
  const [editTechs, setEditTechs] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');
  const [editRepo, setEditRepo] = useState('');
  const [editDeploy, setEditDeploy] = useState('');
  const [savingProject, setSavingProject] = useState(false);

  useEffect(() => {
    if (project) {
      setEditTitle(project.title || '');
      setEditDescription(project.description || project.abstract || '');
      setEditCategory(project.category || 'AI / Machine Learning');
      setEditStatus(project.status || 'in-progress');
      setEditProgress(project.progress ?? 50);
      setEditDeadline(
        project.deadline
          ? new Date(project.deadline).toISOString().split('T')[0]
          : ''
      );
      setEditTechs(project.technologies || []);
      setEditRepo(project.repositoryUrl || '');
      setEditDeploy(project.deploymentUrl || '');
    }
  }, [project]);

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    setSavingProject(true);
    try {
      const updated = await projectService.updateProject(project._id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        category: editCategory.trim(),
        status: editStatus as any,
        progress: Number(editProgress),
        deadline: editDeadline ? (editDeadline as any) : undefined,
        technologies: editTechs,
        repositoryUrl: editRepo.trim(),
        deploymentUrl: editDeploy.trim()
      });
      setProject(updated);
      setIsEditModalOpen(false);
      toast.success('Project updated successfully in database!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update project');
    } finally {
      setSavingProject(false);
    }
  };

  const addTech = () => {
    if (techInput.trim() && !editTechs.includes(techInput.trim())) {
      setEditTechs([...editTechs, techInput.trim()]);
      setTechInput('');
    }
  };

  const removeTech = (t: string) => {
    setEditTechs(editTechs.filter((item) => item !== t));
  };

  const progress = Math.min(100, Math.max(0, project.progress ?? 68));
  const deadlineText = formatDeadline(project.updatedAt || project.createdAt);
  const isLead = Boolean(
    user &&
    (
      project.lead?._id === user._id ||
      (project.lead as any) === user._id ||
      project.owner?._id === user._id ||
      (project.owner as any) === user._id ||
      (project.members && project.members.some((m: any) => (m.user?._id || m.user) === user._id))
    )
  );

  const activeTasks = tasks.filter((t) => t.status !== 'done');
  const completedTasks = tasks.filter((t) => t.status === 'done');

  const handleAuditHealth = async () => {
    if (!project) return;
    setAuditingHealth(true);
    try {
      const res = await aiService.assessProjectHealth({
        projectId: project._id,
        project: {
          title: project.title,
          description: project.description,
          progress: project.progress,
          deadline: project.deadline ? String(project.deadline) : undefined,
          status: project.status
        },
        tasks: tasks.map((t) => ({ title: t.title, status: t.status, priority: t.priority, dueDate: t.dueDate })),
        milestones: milestones.map((m) => ({ title: m.title, status: m.status, targetDate: m.targetDate }))
      });
      setHealthAudit(res);
      toast.success(`Project Health evaluated: ${res.status}`);
      loadProject();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'AI unavailable right now. Please try again.';
      toast.error(msg);
    } finally {
      setAuditingHealth(false);
    }
  };

  return (
    <div className="space-y-10 sm:space-y-12 max-w-7xl mx-auto w-full">
      {/* 1. EDITORIAL WORKSPACE HEADER */}
      <div className="space-y-4">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[var(--text-muted)] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-main)] tracking-tight">
              {project.title}
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed font-normal">
              {project.description || project.abstract || 'AI-powered project lifecycle platform.'}
            </p>

            {/* Clean Status Line */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[var(--text-muted)] font-mono">
              <span className="font-bold text-indigo-400">{progress}% complete</span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-400">Due {deadlineText}</span>
              <span className="text-zinc-600">·</span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[11px] font-semibold capitalize">
                {project.status.replace('-', ' ')}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {isLead && (
              <button
                onClick={handleDeleteProject}
                className="p-2.5 rounded-xl text-[var(--text-muted)] hover:text-rose-400 border border-[var(--border-subtle)] hover:bg-rose-500/10 transition-colors cursor-pointer"
                title="Delete Project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setIsBreakdownModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Plan Breakdown</span>
            </button>

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-[var(--border-subtle)] bg-[#10131F] hover:bg-[#141725] text-white transition-colors cursor-pointer shadow-sm"
            >
              <Settings className="w-4 h-4 text-indigo-400" />
              <span>Settings / Edit</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SIMPLE NAVIGATION BAR */}
      <div className="border-b border-[var(--border-subtle)] pb-1">
        <Tabs
          tabs={[
            { id: 'overview', label: 'Overview' },
            { id: 'tasks', label: 'Tasks', count: tasks.length },
            { id: 'milestones', label: 'Milestones', count: milestones.length },
            { id: 'assistant', label: 'AI Copilot' },
            { id: 'team', label: 'Team', count: project.members?.length || 1 },
            { id: 'activity', label: 'Activity' }
          ]}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as any)}
          variant="segmented"
          size="md"
        />
      </div>

      {/* 3. TAB 1: OVERVIEW — SPACIOUS EDITORIAL LAYOUT (LEFT / RIGHT) */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT COLUMN: Project Progress, Current Tasks, Milestones (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Project Progress (Not everything a card: large section with progress bar) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-dim)]">
                  PROJECT PROGRESS
                </span>
                <span className="text-2xl font-bold font-mono text-indigo-400">{progress}%</span>
              </div>

              <div className="w-full h-2.5 rounded-full bg-zinc-800/80 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-1">
                <span>{completedTasks.length} tasks completed</span>
                <span>{activeTasks.length} in sprint queue</span>
              </div>
            </div>

            {/* Current Tasks */}
            <div className="space-y-4 pt-4 border-t border-[var(--border-subtle)]">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-dim)]">
                  CURRENT TASKS
                </div>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  Open Board →
                </button>
              </div>

              <div className="space-y-2.5">
                {activeTasks.length > 0 ? (
                  activeTasks.slice(0, 4).map((task) => (
                    <div
                      key={task._id}
                      className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[#10131F] hover:bg-[#141725] transition-colors flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="text-sm font-semibold text-white truncate">{task.title}</div>
                        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                          <span>{task.assignee?.name || 'Unassigned'}</span>
                          <span className="text-zinc-600">·</span>
                          <span className="text-[11px] font-mono text-indigo-400">Due {formatTaskDue(task.dueDate)}</span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold shrink-0 ${
                          task.priority === 'urgent'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : task.priority === 'high'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center rounded-xl border border-[var(--border-subtle)] bg-[#10131F] text-xs text-[var(--text-muted)]">
                    All current sprint tasks completed.
                  </div>
                )}
              </div>
            </div>

            {/* Milestones Preview */}
            <div className="space-y-4 pt-4 border-t border-[var(--border-subtle)]">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-dim)]">
                  PROJECT MILESTONES
                </div>
                <button
                  onClick={() => setActiveTab('milestones')}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  View Timeline →
                </button>
              </div>

              <div className="space-y-3">
                {milestones.length > 0 ? (
                  milestones.map((m, idx) => (
                    <div
                      key={m._id}
                      className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[#10131F] flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                          0{m.order || idx + 1}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-white">{m.title}</h4>
                          <span className="text-[11px] text-[var(--text-muted)]">
                            Target Date: {new Date(m.targetDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full capitalize font-semibold ${
                          m.status === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : m.status === 'submitted'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {m.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center rounded-xl border border-[var(--border-subtle)] bg-[#10131F] text-xs text-[var(--text-muted)]">
                    No milestones defined yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Team, Deadline, Technologies (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Team Members */}
            <div className="space-y-3.5">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-dim)]">
                COLLABORATIVE TEAM
              </div>

              <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] space-y-3.5">
                {(project.members && project.members.length > 0
                  ? project.members
                  : [{ user: project.lead || { name: 'Lead' }, role: 'Team Lead' }]
                ).map((m: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Avatar name={m.user?.name || 'Member'} size="sm" src={m.user?.profileImage || m.user?.avatar} />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-white truncate">{m.user?.name}</div>
                      <div className="text-[11px] text-[var(--text-muted)] truncate">{m.role || 'Contributor'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Deadline & Advisor */}
            <div className="space-y-3.5">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-dim)]">
                DEADLINE & OVERSIGHT
              </div>

              <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                  <span className="text-[var(--text-muted)]">Final Defense Due:</span>
                  <span className="font-mono font-bold text-white">{deadlineText}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">Faculty Mentor:</span>
                  <span className="font-semibold text-indigo-400">
                    {project.facultyMentor?.name || 'Dr. Elena Vance'}
                  </span>
                </div>
              </div>
            </div>

            {/* Technologies */}
            <div className="space-y-3.5">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-dim)]">
                TECHNOLOGIES
              </div>

              <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] space-y-2">
                <div className="flex flex-wrap gap-2">
                  {(project.tags && project.tags.length > 0
                    ? project.tags
                    : ['React', 'Node.js', 'MongoDB', 'AI Agents', 'Tailwind']
                  ).map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg bg-[#141725] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-muted)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Health & Risk Audit */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-dim)] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>AI HEALTH & RISK AUDIT</span>
                </div>
                <button
                  disabled={auditingHealth}
                  onClick={handleAuditHealth}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 disabled:opacity-50 cursor-pointer flex items-center gap-1"
                >
                  {auditingHealth ? '✦ Auditing...' : 'Run Audit'}
                </button>
              </div>

              <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] space-y-3.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                  <span className="text-[var(--text-muted)]">Project Health:</span>
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded-full uppercase text-[10px] ${
                      (healthAudit?.status || project.healthAssessment?.status) === 'healthy' ||
                      (healthAudit?.status || project.healthAssessment?.status) === 'On Track'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : (healthAudit?.status || project.healthAssessment?.status) === 'at-risk' ||
                          (healthAudit?.status || project.healthAssessment?.status) === 'At Risk'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {healthAudit?.status || project.healthAssessment?.status || 'On Track'}
                  </span>
                </div>

                <p className="text-[var(--text-muted)] leading-relaxed">
                  {healthAudit?.summary || project.healthAssessment?.summary || 'Sprint cadence healthy. Milestones on schedule.'}
                </p>

                {(healthAudit?.risks?.length || 0) > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-[var(--border-subtle)]">
                    <span className="text-[10px] font-mono font-bold uppercase text-amber-400">Identified Risks:</span>
                    <ul className="space-y-1 text-[11px] text-zinc-400 list-disc list-inside">
                      {healthAudit?.risks.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {(healthAudit?.recommendations?.length || 0) > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-[var(--border-subtle)]">
                    <span className="text-[10px] font-mono font-bold uppercase text-indigo-400">Recommendations:</span>
                    <ul className="space-y-1 text-[11px] text-zinc-400 list-disc list-inside">
                      {healthAudit?.recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TASKS KANBAN */}
      {activeTab === 'tasks' && (
        <KanbanBoard
          project={project}
          tasks={tasks}
          milestones={milestones}
          onTasksUpdated={loadProject}
        />
      )}

      {/* TAB 3: MILESTONES TIMELINE */}
      {activeTab === 'milestones' && (
        <div className="space-y-4">
          <div className="flex items-center justify-end">
            <button
              onClick={() => setIsBreakdownModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/30 text-indigo-300 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>✦ AI Milestone Plan Breakdown</span>
            </button>
          </div>
          <MilestoneTracker
            project={project}
            milestones={milestones}
            onMilestonesUpdated={loadProject}
          />
        </div>
      )}

      {/* TAB 4: AI ASSISTANT COPILOT */}
      {activeTab === 'assistant' && (
        <div className="space-y-6">
          <ProjectAIAssistant project={project} tasks={tasks} milestones={milestones} />
        </div>
      )}

      {/* TAB 4: TEAM */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Project Members & Roles</h3>
              <p className="text-xs text-[var(--text-muted)]">Manage student collaborators and permissions.</p>
            </div>
            <Link
              to="/team-matching"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Find More Teammates</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(project.members && project.members.length > 0 ? project.members : [{ user: project.lead, role: 'Lead' }]).map(
              (m: any, idx: number) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={m.user?.name || 'Member'} size="md" src={m.user?.profileImage || m.user?.avatar} />
                    <div>
                      <h4 className="text-base font-bold text-white">{m.user?.name}</h4>
                      <span className="text-xs text-indigo-400 font-medium">{m.role || 'Member'}</span>
                    </div>
                  </div>
                  <div className="text-xs text-[var(--text-muted)] font-mono">
                    Joined: {m.joinedAt ? new Date(m.joinedAt).toLocaleDateString() : 'Active Member'}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* TAB 5: ACTIVITY */}
      {activeTab === 'activity' && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white">Project Activity Audit Stream</h3>
          <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[#10131F]">
            <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
              {activities.length > 0 ? (
                activities.map((a) => (
                  <div key={a._id} className="relative space-y-1 text-xs">
                    <div className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-[#10131F]" />
                    <div className="font-semibold text-white">{a.action}</div>
                    {a.details && <div className="text-[var(--text-muted)]">{a.details}</div>}
                    <div className="text-[10px] font-mono text-zinc-500">{formatRelativeDate(a.timestamp || a.createdAt)}</div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-[var(--text-muted)]">No recent events recorded.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROJECT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div>
                <h3 className="text-lg font-bold text-white">Project Workspace Settings</h3>
                <p className="text-xs text-[var(--text-muted)]">Updates are stored persistently in your MongoDB database.</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-muted)]">Project Title *</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] text-xs sm:text-sm text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-muted)]">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] text-xs sm:text-sm text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-muted)]">Category</label>
                  <input
                    type="text"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    placeholder="AI / Machine Learning"
                    className="w-full h-11 px-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-muted)]">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] text-xs text-white outline-none focus:border-indigo-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-muted)]">Deadline</label>
                  <input
                    type="date"
                    value={editDeadline}
                    onChange={(e) => setEditDeadline(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Progress Slider */}
              <div className="space-y-2 p-4 rounded-xl border border-[var(--border-subtle)] bg-[#0B0D16]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Project Progress</span>
                  <span className="font-mono font-bold text-indigo-400">{editProgress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editProgress}
                  onChange={(e) => setEditProgress(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              {/* Technologies Tag Editor */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[var(--text-muted)]">Technologies & Stack</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editTechs.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 text-xs border border-indigo-500/20"
                    >
                      {t}
                      <button type="button" onClick={() => removeTech(t)} className="hover:text-white cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTech();
                      }
                    }}
                    placeholder="Add technology (e.g. Next.js, PyTorch) and press Enter"
                    className="flex-1 h-9 px-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-input)] text-xs text-white outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={addTech}
                    className="px-3.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white font-medium cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-muted)]">Repository URL</label>
                  <input
                    type="text"
                    value={editRepo}
                    onChange={(e) => setEditRepo(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full h-11 px-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-muted)]">Deployment / Live Demo URL</label>
                  <input
                    type="text"
                    value={editDeploy}
                    onChange={(e) => setEditDeploy(e.target.value)}
                    placeholder="https://my-app.vercel.app"
                    className="w-full h-11 px-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[var(--text-muted)] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProject}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/25 cursor-pointer disabled:opacity-50"
                >
                  {savingProject ? 'Saving...' : 'Save Changes to Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI PROJECT PLAN BREAKDOWN MODAL */}
      <ProjectBreakdownModal
        isOpen={isBreakdownModalOpen}
        onClose={() => setIsBreakdownModalOpen(false)}
        project={project}
        onPlanSaved={loadProject}
      />
    </div>
  );
};
