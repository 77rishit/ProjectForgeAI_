import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { projectService } from '../../services/projectService';
import { ideaService } from '../../services/ideaService';
import { taskService } from '../../services/taskService';
import { Project, ProjectIdea, Task } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Button } from '../../components/ui/Button';
import { ProgressIndicator } from '../../components/ui/ProgressIndicator';
import { ProjectPreview } from '../../components/ui/ProjectPreview';
import { ProjectCard } from '../../components/ui/ProjectCard';
import { AIRecommendation } from '../../components/ui/AIRecommendation';
import { Timeline, TimelineItem } from '../../components/ui/Timeline';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [recommendations, setRecommendations] = useState<ProjectIdea[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [myProjects, ideas, myTasks] = await Promise.all([
          projectService.getMyProjects().catch(() => []),
          ideaService.getRecommendedIdeas().catch(() => []),
          taskService.getMyTasks().catch(() => [])
        ]);
        setProjects(myProjects);
        setRecommendations(ideas);
        setTasks(myTasks);
      } catch (err) {
        console.error('Failed to load dashboard workspace data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const firstName = user?.name ? user.name.split(' ')[0] : 'Rishit';
  const activeCount = projects.length;
  const tasksDueCount = tasks.filter((t) => t.status !== 'done').length;
  const avgProgress =
    projects.length > 0
      ? Math.round(projects.reduce((acc, p) => acc + (p.progress ?? 50), 0) / projects.length)
      : 0;

  // Fallback demo projects ONLY if the user has 0 projects in the database
  const defaultGallery = [
    {
      _id: 'p_event_hub',
      title: 'Campus Event Hub',
      description: 'Centralized university activity discovery platform with automated calendar syncing and RSVP ticketing.',
      progress: 45,
      category: 'Full-Stack Web',
      tags: ['Next.js', 'PostgreSQL', 'Tailwind'],
      members: [{ user: { name: 'Rishit' } }, { user: { name: 'Aman' } }],
      updatedAt: 'Oct 12'
    },
    {
      _id: 'p_resume_builder',
      title: 'AI Resume Builder',
      description: 'Generative AI career tool tailored for university students with ATS keyword optimization and PDF generation.',
      progress: 80,
      category: 'AI / Career',
      tags: ['React', 'Python', 'FastAPI', 'LLMs'],
      members: [{ user: { name: 'Rishit' } }, { user: { name: 'Priya' } }, { user: { name: 'Dev' } }],
      updatedAt: 'Oct 04'
    },
    {
      _id: 'p_campus_assistant',
      title: 'Smart Campus Assistant',
      description: 'Intelligent campus agent capable of resolving course queries, lecture timetable routing, and lab schedules.',
      progress: 60,
      category: 'AI / Multi-Agent',
      tags: ['LangChain', 'TypeScript', 'VectorDB'],
      members: [{ user: { name: 'Rishit' } }, { user: { name: 'Elena' } }],
      updatedAt: 'Oct 20'
    }
  ];

  // ALWAYS display the user's real database projects!
  const galleryList = projects.length > 0 ? projects : defaultGallery;

  // Primary featured project from database
  const featured = projects.length > 0 ? projects[0] : null;

  // Dynamically generate timeline from user's real tasks
  const dynamicTimeline: TimelineItem[] = tasks.length > 0
    ? tasks.slice(0, 4).map((t, idx) => {
        let label = 'UPCOMING';
        if (t.dueDate) {
          const due = new Date(t.dueDate);
          const today = new Date();
          if (due.toDateString() === today.toDateString()) label = 'TODAY';
          else {
            const tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);
            if (due.toDateString() === tomorrow.toDateString()) label = 'TOMORROW';
            else label = due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
          }
        }
        return {
          id: t._id,
          label,
          title: t.title,
          description: t.description || `Status: ${t.status.toUpperCase()} · Priority: ${t.priority || 'Medium'}`,
          status: t.status === 'done' ? 'completed' : (idx === 0 ? 'current' : 'upcoming')
        };
      })
    : [
        {
          id: 't1',
          label: 'TODAY',
          title: 'Welcome to ProjectForge AI',
          description: 'Create your first capstone project or add tasks in your workspace.',
          status: 'current'
        }
      ];

  return (
    <div className="space-y-16 w-full">
      {/* 1. WELCOME & STATUS (Typography-first, not four cards!) */}
      <div className="space-y-4">
        <PageHeader
          title={`Good morning, ${firstName}.`}
          subtitle="Build something worth shipping. Your projects, ideas and team — all in one place."
          actions={
            <div className="flex items-center gap-3 shrink-0">
              <Link to="/projects?new=true" className="shrink-0">
                <Button variant="primary" size="md" icon={<Plus className="w-4 h-4" />} className="whitespace-nowrap">
                  New Project
                </Button>
              </Link>
              <Link to="/discovery" className="shrink-0">
                <Button variant="secondary" size="md" icon={<Sparkles className="w-4 h-4 text-indigo-400" />} className="whitespace-nowrap">
                  Explore Ideas
                </Button>
              </Link>
            </div>
          }
        />

        {/* Project Status typography */}
        <ProgressIndicator
          activeProjects={activeCount}
          tasksDue={tasksDueCount}
          overallProgress={avgProgress}
        />
      </div>

      {/* 2. CONTINUE BUILDING: ONE LARGE FEATURED PROJECT */}
      <div className="space-y-4">
        <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-dim)]">
          CONTINUE BUILDING
        </div>

        {featured ? (
          <ProjectPreview
            id={featured._id}
            title={featured.title}
            description={featured.description || 'AI-powered project workspace.'}
            progress={featured.progress ?? 50}
            tags={featured.technologies?.length ? featured.technologies : ['Full-Stack']}
            members={(featured.members || []).map((m: any) => ({ name: m.user?.name || 'Member' }))}
            deadline={featured.deadline ? new Date(featured.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Sep 30'}
            actionText="Open Workspace"
          />
        ) : (
          <ProjectPreview
            id="projectforge_core"
            title="ProjectForge AI"
            description="AI-powered project lifecycle platform for students. Click New Project above to get started."
            progress={68}
            tags={['React', 'Node.js', 'MongoDB', 'AI']}
            members={[
              { name: 'Rishit' },
              { name: 'Priya' },
              { name: 'Rohan' },
              { name: 'Kavya' }
            ]}
            deadline="Sep 30"
            actionText="Continue building"
          />
        )}
      </div>

      {/* 3. MY PROJECTS: 3 CLEAN PROJECT CARDS */}
      <div className="space-y-6">
        <SectionHeader
          title="My Projects"
          description="Active initiatives and software engineering repositories."
          action={
            <Link
              to="/projects"
              className="text-xs sm:text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View all projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {galleryList.map((p: any) => (
            <ProjectCard
              key={p._id}
              id={p._id}
              title={p.title}
              description={p.description}
              category={p.category}
              progress={p.progress}
              tags={p.tags}
              deadline={p.updatedAt}
              members={(p.members || []).map((m: any) => ({ name: m.user?.name || 'Member' }))}
              onClick={() => {
                window.location.href = `/projects/${p._id}`;
              }}
            />
          ))}
        </div>
      </div>

      {/* 4. TWO-COLUMN SPLIT: AI FOR YOU + NEXT UP (No cards everywhere, open editorial flow) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-start pt-4 border-t border-[var(--border-subtle)]">
        {/* LEFT: AI FOR YOU */}
        <div className="lg:col-span-6 space-y-4">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-dim)] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI FOR YOU</span>
          </div>

          <AIRecommendation
            title="Smart Campus Assistant"
            matchScore={94}
            explanation="Matches your interests in AI and web development."
            skills={['React', 'Node.js', 'AI']}
            actionText="Explore idea"
            onAction={() => {
              window.location.href = '/discovery';
            }}
          />
        </div>

        {/* RIGHT: NEXT UP (Clean timeline) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-dim)]">
            NEXT UP
          </div>

          <div className="pt-2">
            <Timeline items={dynamicTimeline} />
          </div>
        </div>
      </div>
    </div>
  );
};
