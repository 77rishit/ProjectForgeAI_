import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ideaService } from '../../services/ideaService';
import { ProjectIdea, ProjectIdeaMatchData } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { Skeleton } from '../../components/ui/Skeleton';
import {
  ArrowLeft,
  Bookmark,
  Sparkles,
  CheckCircle2,
  Clock,
  Code2,
  Wrench,
  Users,
  Compass,
  Layers,
  GraduationCap,
  Calendar,
  ExternalLink,
  Target,
  ShieldCheck,
  Check,
  Zap,
  TrendingUp,
  BrainCircuit,
  Building2,
  FolderGit2
} from 'lucide-react';
import { motion } from 'framer-motion';

export const ProjectIdeaDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [idea, setIdea] = useState<ProjectIdea | null>(null);
  const [matchData, setMatchData] = useState<ProjectIdeaMatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adopting, setAdopting] = useState(false);

  useEffect(() => {
    if (id) {
      loadIdeaDetails(id);
    }
  }, [id]);

  const loadIdeaDetails = async (ideaId: string) => {
    setLoading(true);
    try {
      const res = await ideaService.getIdeaById(ideaId);
      setIdea(res.idea);
      if (res.matchData) {
        setMatchData(res.matchData);
      }
    } catch (err: any) {
      console.error('Failed to load idea details:', err);
      toast.error(err.message || 'Error loading project idea details');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = async () => {
    if (!idea) return;
    setSaving(true);
    try {
      const res = await ideaService.toggleBookmark(idea._id);
      const isNowBookmarked = res.bookmarked;
      setIdea((prev) =>
        prev
          ? {
              ...prev,
              isBookmarked: isNowBookmarked,
              bookmarkedBy: isNowBookmarked
                ? [...prev.bookmarkedBy, user?._id || 'me']
                : prev.bookmarkedBy.filter((bId) => bId !== user?._id)
            }
          : null
      );
      toast.info(isNowBookmarked ? 'Idea saved to bookmarks' : 'Idea removed from bookmarks');
    } catch (err: any) {
      toast.error(err.message || 'Error updating bookmark');
    } finally {
      setSaving(false);
    }
  };

  const handleAdoptIdea = async () => {
    if (!idea) return;
    setAdopting(true);
    try {
      const res = await ideaService.adoptIdea(idea._id);
      toast.success(res.message || 'Project initialized from this idea!');
      navigate(`/projects/${res.project._id}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to adopt project idea');
    } finally {
      setAdopting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 max-w-5xl mx-auto py-4">
        <Skeleton height="36px" width="180px" />
        <Skeleton height="140px" width="100%" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton height="260px" width="100%" />
            <Skeleton height="220px" width="100%" />
          </div>
          <div>
            <Skeleton height="320px" width="100%" />
          </div>
        </div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Project Idea Not Found</h2>
        <p className="text-sm text-[var(--text-muted)]">
          The requested idea may have been archived or removed from the catalog.
        </p>
        <Button onClick={() => navigate('/discovery')} variant="secondary" icon={<ArrowLeft className="w-4 h-4" />}>
          Back to Explore
        </Button>
      </div>
    );
  }

  const category = idea.category || idea.domain || 'Engineering';
  const technologies = idea.technologies || idea.recommendedStack || [];
  const requiredSkills = idea.requiredSkills || idea.rolesNeeded || [];
  const matchPct = matchData?.matchPercentage ?? idea.matchPercentage ?? 75;
  const matchReasons = matchData?.matchReasons ?? idea.matchReasons ?? [];
  const isSaved = idea.isBookmarked || (idea.bookmarkedBy && idea.bookmarkedBy.length > 0);

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-16">
      {/* Back button & Breadcrumb navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/discovery')}
          className="flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Explore Projects</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Bookmark Button */}
          <Button
            onClick={handleToggleSave}
            variant={isSaved ? 'secondary' : 'ghost'}
            size="sm"
            loading={saving}
            icon={<Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />}
          >
            {isSaved ? 'Saved in Bookmarks' : 'Save to Bookmarks'}
          </Button>

          {/* Adopt Idea CTA */}
          <Button
            onClick={handleAdoptIdea}
            variant="glow"
            size="sm"
            loading={adopting}
            icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          >
            Adopt into Project
          </Button>
        </div>
      </div>

      {/* Hero Header Card */}
      <Card className="p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-secondary)] to-indigo-950/20 border-indigo-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="indigo" size="md">{category}</Badge>
            <Badge
              variant={
                idea.difficulty === 'Beginner' ? 'cyan' :
                idea.difficulty === 'Intermediate' ? 'purple' : 'warning'
              }
              size="md"
            >
              {idea.difficulty}
            </Badge>
            {idea.department && (
              <span className="text-xs text-[var(--text-dim)] font-medium px-2.5 py-1 rounded-md bg-white/5 border border-white/10 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>{idea.department}</span>
              </span>
            )}
            <span className="text-xs text-[var(--text-dim)] font-medium px-2.5 py-1 rounded-md bg-white/5 border border-white/10 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{idea.estimatedDuration || '1 Semester (12-16 weeks)'}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
            {idea.title}
          </h1>

          <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed max-w-4xl">
            {idea.description || idea.problemStatement}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-[var(--text-dim)] border-t border-[var(--border-subtle)]">
            {idea.suggestedBy && (
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                <span>Supervised & Endorsed by <strong>{idea.suggestedBy.name}</strong></span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[var(--text-dim)]" />
              <span>Catalog Entry: {new Date(idea.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
            </div>
            {idea.facultyApproved && (
              <span className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                Faculty Approved Capstone
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* SECTION: WHY THIS PROJECT MATCHES YOU (AI Analysis) */}
      <Card className="p-6 sm:p-8 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-cyan-950/20 border-indigo-500/30 shadow-xl shadow-indigo-950/30 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-500/20 pb-5">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-1">
                <BrainCircuit className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>AI Persona Matching Engine</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Why this project matches you
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
                Synthesized based on your profile skills, academic interests, department curriculum, semester level, and project track record.
              </p>
            </div>

            {/* Match Percentage Display */}
            <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md px-5 py-3 rounded-2xl border border-indigo-500/30 shrink-0">
              <ProgressRing
                progress={matchPct}
                size={68}
                strokeWidth={7}
                variant={matchPct >= 80 ? 'emerald' : matchPct >= 65 ? 'brand' : 'amber'}
              />
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white tracking-tight">{matchPct}%</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                  {matchPct >= 80 ? 'Exceptional Fit' : matchPct >= 65 ? 'Strong Match' : 'Potential Fit'}
                </span>
                <span className="text-[10px] text-[var(--text-dim)]">Personalized score</span>
              </div>
            </div>
          </div>

          {/* Student Persona Dimensions Analyzed */}
          {user && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-black/20 border border-white/5 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-dim)]">Student</span>
                <p className="font-semibold text-white truncate">{user.name}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-dim)]">Department</span>
                <p className="font-semibold text-white truncate">{user.department || 'Computer Science'}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-dim)]">Semester</span>
                <p className="font-semibold text-white truncate">{user.semester || 'Semester 6'}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-dim)]">Active Skills</span>
                <p className="font-semibold text-white truncate">{user.skills?.length || 5} registered</p>
              </div>
            </div>
          )}

          {/* List of Explanations */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Alignment Insights</span>
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {matchReasons.map((reason, index) => {
                // Determine icon and color based on keyword
                const isSkill = reason.toLowerCase().includes('skill');
                const isInterest = reason.toLowerCase().includes('interest');
                const isSemester = reason.toLowerCase().includes('semester');
                const isDept = reason.toLowerCase().includes('department');
                const isPrevious = reason.toLowerCase().includes('previous') || reason.toLowerCase().includes('portfolio');

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                    className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 flex items-start gap-3"
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${
                      isSkill ? 'bg-cyan-500/20 text-cyan-300' :
                      isInterest ? 'bg-indigo-500/20 text-indigo-300' :
                      isSemester ? 'bg-emerald-500/20 text-emerald-300' :
                      isDept ? 'bg-purple-500/20 text-purple-300' :
                      'bg-amber-500/20 text-amber-300'
                    }`}>
                      {isSkill ? <Code2 className="w-4 h-4" /> :
                       isInterest ? <Zap className="w-4 h-4" /> :
                       isSemester ? <GraduationCap className="w-4 h-4" /> :
                       isDept ? <Building2 className="w-4 h-4" /> :
                       <FolderGit2 className="w-4 h-4" />}
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-white tracking-tight">
                        {reason}
                      </span>
                      <span className="text-[11px] text-[var(--text-muted)] leading-snug">
                        {isSkill && 'Directly utilizes your verified codebase toolchain competencies.'}
                        {isInterest && 'Taps directly into your specified engineering curiosity areas.'}
                        {isSemester && 'Calibrated for junior-to-senior semester project rigors.'}
                        {isDept && 'Meets undergraduate departmental capstone specifications.'}
                        {isPrevious && 'Enables natural continuation and scaling of past deliverables.'}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Main Two-Column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Problem & Solution & Roadmap */}
        <div className="lg:col-span-2 space-y-6">
          {/* Problem Statement */}
          <Card className="p-6 flex flex-col gap-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-rose-400" />
              <span>Problem Statement & Academic Challenge</span>
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              {idea.problemStatement || idea.description}
            </p>
          </Card>

          {/* Solution Overview */}
          <Card className="p-6 flex flex-col gap-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Solution Architecture & Engineering Strategy</span>
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              {idea.solutionOverview || idea.description}
            </p>
            <div className="mt-2 p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-[var(--text-dim)] flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                This architecture emphasizes modular microservices, clean separation of concerns, test coverage benchmarks, and a working deployment demonstration for final evaluation.
              </span>
            </div>
          </Card>

          {/* Suggested 4-Phase Roadmap */}
          <Card className="p-6 flex flex-col gap-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Suggested Milestone Execution Plan</span>
            </h3>

            <div className="space-y-3">
              {[
                {
                  phase: 'Phase 1: Architecture & Requirements Spec',
                  weeks: 'Weeks 1 - 3',
                  description: 'Define ERDs, API interfaces, user stories, and mentor approval checkpoint.'
                },
                {
                  phase: 'Phase 2: Core Engine & Alpha Prototype',
                  weeks: 'Weeks 4 - 8',
                  description: 'Implement foundational models, database schemas, and primary backend controllers.'
                },
                {
                  phase: 'Phase 3: Integration, Frontend UI & Stress Testing',
                  weeks: 'Weeks 9 - 13',
                  description: 'Connect responsive client interfaces, state management, and continuous integration pipeline.'
                },
                {
                  phase: 'Phase 4: Evaluation, Documentation & Final Defense',
                  weeks: 'Weeks 14 - 16',
                  description: 'Compile capstone technical thesis, rubric benchmarks, live demo recording, and faculty review.'
                }
              ].map((step, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center text-xs font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <strong className="text-white">{step.phase}</strong>
                      <span className="text-[10px] font-mono text-[var(--text-dim)] bg-white/5 px-2 py-0.5 rounded">
                        {step.weeks}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Technologies, Roles, Teammates */}
        <div className="space-y-6">
          {/* Action Card */}
          <Card className="p-6 flex flex-col gap-4 bg-gradient-to-b from-indigo-950/20 to-[var(--bg-card)] border-indigo-500/20">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Project Actions
            </h3>

            <Button
              onClick={handleAdoptIdea}
              variant="glow"
              size="lg"
              loading={adopting}
              icon={<CheckCircle2 className="w-5 h-5" />}
              className="w-full justify-center text-sm font-bold"
            >
              Adopt into New Project
            </Button>

            <Button
              onClick={() => navigate(`/team-matching?domain=${encodeURIComponent(category)}`)}
              variant="secondary"
              size="md"
              icon={<Users className="w-4 h-4" />}
              className="w-full justify-center"
            >
              Find Matching Teammates
            </Button>

            <Button
              onClick={handleToggleSave}
              variant="ghost"
              size="md"
              loading={saving}
              icon={<Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />}
              className="w-full justify-center text-xs"
            >
              {isSaved ? 'Remove from Bookmarks' : 'Save to Bookmarks'}
            </Button>
          </Card>

          {/* Technologies Stack */}
          <Card className="p-6 flex flex-col gap-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span>Recommended Stack</span>
            </h3>
            <p className="text-[11px] text-[var(--text-dim)]">
              Primary frameworks, toolchains, and protocols for this implementation.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-main)] font-mono text-xs font-semibold border border-[var(--border-subtle)]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </Card>

          {/* Required Skills & Roles */}
          <Card className="p-6 flex flex-col gap-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-cyan-400" />
              <span>Required Roles & Skills</span>
            </h3>
            <p className="text-[11px] text-[var(--text-dim)]">
              Core competencies needed across the project squad.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              {requiredSkills.map((role) => (
                <div
                  key={role}
                  className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200 font-medium flex items-center gap-2"
                >
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{role}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Tags */}
          {idea.tags && idea.tags.length > 0 && (
            <Card className="p-6 flex flex-col gap-2.5">
              <h3 className="text-xs font-bold text-[var(--text-dim)] uppercase tracking-wider">
                Topic Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {idea.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-white/5 text-[var(--text-muted)] text-[11px] border border-white/10"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
