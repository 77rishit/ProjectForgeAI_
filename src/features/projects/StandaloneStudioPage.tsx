import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../../services/projectService';
import { aiService, ProjectIdeaAI, TeamMatchAI, ProjectBreakdownMilestone, ProjectHealthAI } from '../../services/aiService';
import { Project, Task, Milestone } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Tabs } from '../../components/ui/Tabs';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { ProjectAIAssistant } from './ProjectAIAssistant';
import { ArchitectureStudio } from './ArchitectureStudio';
import {
  Sparkles,
  Bot,
  Lightbulb,
  Kanban,
  UserCheck,
  Activity,
  FolderGit2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Send,
  Layers
} from 'lucide-react';

export const StandaloneStudioPage: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  const [projectMilestones, setProjectMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<
    'ideas' | 'breakdown' | 'matching' | 'health' | 'assistant' | 'architecture'
  >('ideas');

  // --- Tool 1: Project Ideas State ---
  const [ideaDomain, setIdeaDomain] = useState('AI / Machine Learning');
  const [ideaDifficulty, setIdeaDifficulty] = useState('Intermediate');
  const [ideaSkills, setIdeaSkills] = useState(user?.skills?.join(', ') || 'React, TypeScript, Node.js, Python');
  const [generatingIdeas, setGeneratingIdeas] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<ProjectIdeaAI[]>([]);
  const [adoptingIdeaId, setAdoptingIdeaId] = useState<number | null>(null);

  // --- Tool 2: Project Breakdown State ---
  const [planDuration, setPlanDuration] = useState('8-10 weeks');
  const [breakingDown, setBreakingDown] = useState(false);
  const [generatedMilestones, setGeneratedMilestones] = useState<
    (ProjectBreakdownMilestone & { selected: boolean })[]
  >([]);
  const [savingPlan, setSavingPlan] = useState(false);

  // --- Tool 3: Team Matching State ---
  const [candSkills, setCandSkills] = useState('React, Tailwind CSS, UI/UX Design');
  const [candInterests, setCandInterests] = useState('Frontend Architecture, Design Systems');
  const [analyzingMatch, setAnalyzingMatch] = useState(false);
  const [matchResult, setMatchResult] = useState<TeamMatchAI | null>(null);

  // --- Tool 4: Project Health State ---
  const [auditingHealth, setAuditingHealth] = useState(false);
  const [healthResult, setHealthResult] = useState<ProjectHealthAI | null>(null);

  // Load user's projects
  useEffect(() => {
    async function load() {
      try {
        const myProjects = await projectService.getMyProjects();
        setProjects(myProjects);
        if (myProjects.length > 0) {
          const first = myProjects[0];
          setSelectedProject(first);
          loadProjectDetails(first._id);
        }
      } catch (err) {
        console.error('Failed to load projects for studio:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const loadProjectDetails = async (projectId: string) => {
    try {
      const data = await projectService.getProjectById(projectId);
      setProjectTasks(data.tasks || []);
      setProjectMilestones(data.milestones || []);
    } catch (err) {
      console.warn('Failed to load project tasks/milestones:', err);
    }
  };

  // 1. Generate Ideas Handler
  const handleGenerateIdeas = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratingIdeas(true);
    try {
      const skills = ideaSkills.split(',').map((s) => s.trim()).filter(Boolean);
      const ideas = await aiService.generateProjectIdeas({
        preferredDomain: ideaDomain,
        experienceLevel: ideaDifficulty,
        skills,
        interests: user?.interests || [],
        department: user?.department || 'Computer Science & Engineering',
        semester: user?.semester ? String(user.semester) : 'Semester 6'
      });
      setGeneratedIdeas(ideas);
      toast.success(`Generated ${ideas.length} custom capstone concepts!`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'AI unavailable right now. Please try again.');
    } finally {
      setGeneratingIdeas(false);
    }
  };

  const handleAdoptIdea = async (idea: ProjectIdeaAI, idx: number) => {
    setAdoptingIdeaId(idx);
    try {
      const created = await projectService.createProject({
        title: idea.title,
        description: idea.description,
        abstract: idea.reason,
        category: ideaDomain,
        technologies: idea.technologies || [],
        status: 'planning',
        progress: 0
      });
      toast.success('Project idea saved to database!');
      navigate(`/projects/${created._id}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save project');
    } finally {
      setAdoptingIdeaId(null);
    }
  };

  // 2. Generate Breakdown Handler
  const handleGenerateBreakdown = async () => {
    if (!selectedProject) {
      toast.error('Select an active project first.');
      return;
    }
    setBreakingDown(true);
    try {
      const res = await aiService.breakDownProject({
        title: selectedProject.title,
        description: selectedProject.description || 'Capstone project',
        technologies: selectedProject.technologies || [],
        duration: planDuration
      });
      setGeneratedMilestones((res.milestones || []).map((m) => ({ ...m, selected: true })));
      toast.success(`Generated ${res.milestones.length} milestones!`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'AI unavailable right now. Please try again.');
    } finally {
      setBreakingDown(false);
    }
  };

  // 3. Team Match Handler
  const handleAnalyzeMatch = async () => {
    if (!selectedProject) {
      toast.error('Select an active project first.');
      return;
    }
    setAnalyzingMatch(true);
    try {
      const res = await aiService.matchTeam(
        {
          title: selectedProject.title,
          description: selectedProject.description,
          requiredSkills: selectedProject.technologies || []
        },
        {
          skills: candSkills.split(',').map((s) => s.trim()).filter(Boolean),
          interests: candInterests.split(',').map((s) => s.trim()).filter(Boolean),
          experience: 'Undergraduate student'
        }
      );
      setMatchResult(res);
      toast.success(`Analyzed synergy: ${res.compatibility}%`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'AI unavailable right now. Please try again.');
    } finally {
      setAnalyzingMatch(false);
    }
  };

  // 4. Project Health Handler
  const handleAuditHealth = async () => {
    if (!selectedProject) {
      toast.error('Select an active project first.');
      return;
    }
    setAuditingHealth(true);
    try {
      const res = await aiService.assessProjectHealth({
        projectId: selectedProject._id,
        project: {
          title: selectedProject.title,
          description: selectedProject.description,
          progress: selectedProject.progress,
          deadline: selectedProject.deadline ? String(selectedProject.deadline) : undefined,
          status: selectedProject.status
        },
        tasks: projectTasks.map((t) => ({ title: t.title, status: t.status, priority: t.priority })),
        milestones: projectMilestones.map((m) => ({ title: m.title, status: m.status }))
      });
      setHealthResult(res);
      toast.success(`Project Health evaluated: ${res.status}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'AI unavailable right now. Please try again.');
    } finally {
      setAuditingHealth(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto w-full">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-mono font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>PROJECTFORGE AI STUDIO</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Integrated AI Engineering Studio
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Real OpenAI-powered tools for idea ideation, sprint planning, team synergy, health audits, and project copilot.
          </p>
        </div>

        {/* Project Context Selector */}
        {projects.length > 0 && (
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#10131F] border border-[var(--border-subtle)] shrink-0">
            <FolderGit2 className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-xs text-[var(--text-muted)] font-mono">Context:</span>
            <select
              value={selectedProject?._id || ''}
              onChange={(e) => {
                const found = projects.find((p) => p._id === e.target.value);
                if (found) {
                  setSelectedProject(found);
                  loadProjectDetails(found._id);
                }
              }}
              className="bg-transparent text-xs font-semibold text-white outline-none cursor-pointer"
            >
              {projects.map((p) => (
                <option key={p._id} value={p._id} className="bg-[#10131F] text-white">
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Studio Navigation Tabs */}
      <div className="border-b border-[var(--border-subtle)] pb-1">
        <Tabs
          tabs={[
            { id: 'ideas', label: '1. Project Ideas' },
            { id: 'breakdown', label: '2. Project Plan Breakdown' },
            { id: 'matching', label: '3. Team Synergy Matcher' },
            { id: 'health', label: '4. Project Health Audit' },
            { id: 'assistant', label: '5. Project AI Copilot' },
            { id: 'architecture', label: '6. Architecture Synthesizer' }
          ]}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as any)}
          variant="segmented"
          size="md"
        />
      </div>

      {/* TOOL 1: GENERATE PROJECT IDEAS */}
      {activeTab === 'ideas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 p-6 rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] space-y-5">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Lightbulb className="w-4 h-4 text-indigo-400" />
              <span>Generate Project Ideas</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              OpenAI synthesizes 3-5 high-impact capstone proposals aligned with your stack and department syllabus.
            </p>

            <form onSubmit={handleGenerateIdeas} className="space-y-4 text-xs">
              <Select
                label="Domain"
                options={[
                  { value: 'AI / Machine Learning', label: 'AI / Machine Learning' },
                  { value: 'Healthcare & Biotech', label: 'Healthcare & Biotech' },
                  { value: 'ClimateTech & IoT', label: 'ClimateTech & IoT' },
                  { value: 'Cybersecurity & Cloud', label: 'Cybersecurity & Cloud' },
                  { value: 'Full-Stack Web3', label: 'Full-Stack Web3' }
                ]}
                value={ideaDomain}
                onChange={(e) => setIdeaDomain(e.target.value)}
              />

              <Select
                label="Difficulty"
                options={[
                  { value: 'Beginner', label: 'Beginner' },
                  { value: 'Intermediate', label: 'Intermediate' },
                  { value: 'Advanced', label: 'Advanced' }
                ]}
                value={ideaDifficulty}
                onChange={(e) => setIdeaDifficulty(e.target.value)}
              />

              <Input
                label="Skills"
                value={ideaSkills}
                onChange={(e) => setIdeaSkills(e.target.value)}
                placeholder="e.g. React, Node.js, PyTorch"
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full justify-center"
                loading={generatingIdeas}
                disabled={generatingIdeas}
                icon={<Sparkles className="w-3.5 h-3.5" />}
              >
                {generatingIdeas ? '✦ Thinking...' : 'Generate 3-5 Ideas'}
              </Button>
            </form>
          </div>

          <div className="lg:col-span-7 space-y-4">
            {generatingIdeas ? (
              <div className="p-12 text-center rounded-2xl border border-indigo-500/20 bg-indigo-500/5 space-y-3 animate-pulse">
                <Sparkles className="w-6 h-6 animate-spin text-indigo-400 mx-auto" />
                <div className="text-sm font-semibold text-white">✦ Thinking... Calling OpenAI Service</div>
                <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
                  Deconstructing real-world software architecture opportunities...
                </p>
              </div>
            ) : generatedIdeas.length > 0 ? (
              generatedIdeas.map((idea, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {idea.difficulty} • {idea.estimatedDuration}
                      </span>
                      <h3 className="text-base font-bold text-white mt-1.5">{idea.title}</h3>
                    </div>
                    <Button
                      onClick={() => handleAdoptIdea(idea, idx)}
                      variant="primary"
                      size="sm"
                      loading={adoptingIdeaId === idx}
                      icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                    >
                      Save to DB
                    </Button>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{idea.description}</p>
                  {idea.reason && (
                    <div className="text-[11px] text-indigo-300 bg-indigo-500/5 p-2 rounded-lg border border-indigo-500/10">
                      <span className="font-semibold">Match Rationale: </span>{idea.reason}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {idea.technologies?.map((tech) => (
                      <span key={tech} className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-16 text-center rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] text-xs text-[var(--text-muted)]">
                Fill the criteria on the left and click "Generate 3-5 Ideas" to query the AI model.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOOL 2: PROJECT BREAKDOWN */}
      {activeTab === 'breakdown' && (
        <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Kanban className="w-4 h-4 text-indigo-400" />
                <span>AI Project Plan Breakdown</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Deconstructs selected project "{selectedProject?.title}" into sequential milestone stages and sprint tasks.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={planDuration}
                onChange={(e) => setPlanDuration(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[#0B0D16] text-xs text-white"
              >
                <option value="6-8 weeks">6-8 weeks (Fast-track)</option>
                <option value="8-10 weeks">8-10 weeks (Semester)</option>
                <option value="12-16 weeks">12-16 weeks (Academic Year)</option>
              </select>

              <Button
                onClick={handleGenerateBreakdown}
                variant="primary"
                size="md"
                loading={breakingDown}
                disabled={breakingDown || !selectedProject}
                icon={<Sparkles className="w-3.5 h-3.5" />}
              >
                {breakingDown ? '✦ Thinking...' : 'Generate Plan'}
              </Button>
            </div>
          </div>

          {breakingDown ? (
            <div className="p-12 text-center rounded-xl border border-indigo-500/20 bg-indigo-500/5 space-y-2 animate-pulse">
              <Sparkles className="w-5 h-5 animate-spin text-indigo-400 mx-auto" />
              <div className="text-xs font-semibold text-white">✦ Thinking... Calling OpenAI Breakdown Engine</div>
            </div>
          ) : generatedMilestones.length > 0 ? (
            <div className="space-y-4">
              {generatedMilestones.map((m, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[#121626] space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">
                      Phase 0{idx + 1}: {m.title}
                    </h4>
                    <span className="text-[10px] font-mono text-indigo-400">{m.tasks?.length || 0} tasks</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">{m.description}</p>
                  <div className="space-y-1.5 pl-4 border-l border-white/10">
                    {m.tasks?.map((t, tIdx) => (
                      <div key={tIdx} className="flex items-center justify-between text-xs text-slate-300">
                        <span>• {t.title}</span>
                        <span className="text-[10px] font-mono text-zinc-500">{t.estimatedDays}d</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-[var(--text-muted)]">
              Click "Generate Plan" to break down "{selectedProject?.title}" into phases.
            </div>
          )}
        </div>
      )}

      {/* TOOL 3: TEAM SYNERGY MATCHER */}
      {activeTab === 'matching' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 p-6 rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <UserCheck className="w-4 h-4 text-indigo-400" />
              <span>Evaluate Candidate Fit</span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Evaluates technical compatibility between "{selectedProject?.title}" and candidate profile.
            </p>

            <Input
              label="Candidate Skills"
              value={candSkills}
              onChange={(e) => setCandSkills(e.target.value)}
              placeholder="e.g. React, Tailwind, Figma"
            />

            <Input
              label="Candidate Interests"
              value={candInterests}
              onChange={(e) => setCandInterests(e.target.value)}
              placeholder="e.g. UI Engineering, Interaction Design"
            />

            <Button
              onClick={handleAnalyzeMatch}
              variant="primary"
              size="md"
              className="w-full justify-center"
              loading={analyzingMatch}
              disabled={analyzingMatch || !selectedProject}
              icon={<Sparkles className="w-3.5 h-3.5" />}
            >
              {analyzingMatch ? '✦ Thinking...' : 'Analyze Synergy'}
            </Button>
          </div>

          <div className="lg:col-span-7">
            {analyzingMatch ? (
              <div className="p-12 text-center rounded-2xl border border-indigo-500/20 bg-indigo-500/5 space-y-2 animate-pulse">
                <Sparkles className="w-5 h-5 animate-spin text-indigo-400 mx-auto" />
                <div className="text-xs font-semibold text-white">✦ Thinking... Evaluating objective synergy</div>
              </div>
            ) : matchResult ? (
              <div className="p-6 rounded-2xl border border-indigo-500/30 bg-[#10131F] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-indigo-400">Match Report</span>
                  <span className="text-base font-bold font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {matchResult.compatibility}% Synergy
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                  {matchResult.reason}
                </p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1">
                    <span className="font-semibold text-emerald-400 text-[11px] uppercase">Strengths</span>
                    <div className="flex flex-wrap gap-1">
                      {matchResult.strengths?.map((s, i) => (
                        <span key={i} className="text-[10px] text-emerald-300">✓ {s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1">
                    <span className="font-semibold text-amber-400 text-[11px] uppercase">Skills Gaps</span>
                    <div className="flex flex-wrap gap-1">
                      {matchResult.missingSkills?.map((gap, i) => (
                        <span key={i} className="text-[10px] text-amber-300">! {gap}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-16 text-center rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] text-xs text-[var(--text-muted)]">
                Input candidate profile on left and click "Analyze Synergy".
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOOL 4: PROJECT HEALTH AUDIT */}
      {activeTab === 'health' && (
        <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Activity className="w-4 h-4 text-indigo-400" />
                <span>AI Project Health & Risk Diagnostics</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Audits progress velocity, milestone completion, and overdue bottlenecks for "{selectedProject?.title}".
              </p>
            </div>

            <Button
              onClick={handleAuditHealth}
              variant="primary"
              size="md"
              loading={auditingHealth}
              disabled={auditingHealth || !selectedProject}
              icon={<Sparkles className="w-3.5 h-3.5" />}
            >
              {auditingHealth ? '✦ Auditing...' : 'Run Health Audit'}
            </Button>
          </div>

          {auditingHealth ? (
            <div className="p-12 text-center rounded-xl border border-indigo-500/20 bg-indigo-500/5 space-y-2 animate-pulse">
              <Sparkles className="w-5 h-5 animate-spin text-indigo-400 mx-auto" />
              <div className="text-xs font-semibold text-white">✦ Thinking... Running diagnostic audit</div>
            </div>
          ) : healthResult ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <span className="text-xs font-semibold text-white">Health Status:</span>
                <span
                  className={`px-3 py-1 rounded-full font-mono font-bold text-xs uppercase ${
                    healthResult.status === 'On Track'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : healthResult.status === 'At Risk'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {healthResult.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 bg-white/5 p-4 rounded-xl leading-relaxed">
                {healthResult.summary}
              </p>
              {healthResult.risks?.length > 0 && (
                <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2 text-xs">
                  <span className="font-semibold text-amber-400 uppercase text-[11px]">Identified Risks</span>
                  <ul className="list-disc list-inside space-y-1 text-zinc-400">
                    {healthResult.risks.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
              {healthResult.recommendations?.length > 0 && (
                <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 space-y-2 text-xs">
                  <span className="font-semibold text-indigo-400 uppercase text-[11px]">Recommended Mitigations</span>
                  <ul className="list-disc list-inside space-y-1 text-zinc-400">
                    {healthResult.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-[var(--text-muted)]">
              Click "Run Health Audit" to analyze current sprint bottlenecks and velocity.
            </div>
          )}
        </div>
      )}

      {/* TOOL 5: PROJECT AI COPILOT */}
      {activeTab === 'assistant' && selectedProject && (
        <ProjectAIAssistant
          project={selectedProject}
          tasks={projectTasks}
          milestones={projectMilestones}
        />
      )}

      {/* TOOL 6: ARCHITECTURE SYNTHESIZER */}
      {activeTab === 'architecture' && selectedProject && (
        <ArchitectureStudio project={selectedProject} onProjectUpdated={() => {}} />
      )}
    </div>
  );
};
