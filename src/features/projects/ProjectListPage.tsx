import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  FolderGit2,
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { projectService } from '../../services/projectService';
import { Project } from '../../types';
import { ProjectCard } from './ProjectCard';
import { CreateProjectModal } from './CreateProjectModal';
import { Avatar } from '../../components/ui/Avatar';
import { PageHeader } from '../../components/ui/PageHeader';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { formatDeadline } from '../../utils/formatters';

export const ProjectListPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState<'my' | 'all'>('my');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCreateOpen, setIsCreateOpen] = useState(searchParams.get('new') === 'true');

  const categories = [
    'All',
    'AI / Machine Learning',
    'Healthcare & Biotech',
    'ClimateTech & IoT',
    'Cybersecurity & Cloud',
    'Full-Stack Web3'
  ];

  const loadProjects = async () => {
    setLoading(true);
    try {
      if (activeTab === 'my') {
        const myData = await projectService.getMyProjects();
        setProjects(myData);
      } else {
        const allData = await projectService.getProjects({
          category: selectedCategory === 'All' ? undefined : selectedCategory,
          search: search.trim() || undefined
        });
        setProjects(allData);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [activeTab, selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadProjects();
  };

  const featured = projects[0] || null;
  const galleryProjects = projects.length > 1 ? projects.slice(1) : projects;

  return (
    <div className="space-y-16 w-full">
      {/* 1. HEADER & CONTROLS */}
      <div className="space-y-6">
        <PageHeader
          title="Your Projects"
          subtitle="Everything you're building, in one place."
          actions={
            <div className="flex items-center gap-3 shrink-0">
              {/* Segmented view switcher */}
              <div className="inline-flex items-center p-1 rounded-xl bg-[#10131F] border border-[var(--border-subtle)] text-xs font-semibold shrink-0">
                <button
                  onClick={() => setActiveTab('my')}
                  className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                    activeTab === 'my'
                      ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                      : 'text-[var(--text-muted)] hover:text-white'
                  }`}
                >
                  My Projects
                </button>
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                    activeTab === 'all'
                      ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                      : 'text-[var(--text-muted)] hover:text-white'
                  }`}
                >
                  All Projects
                </button>
              </div>

              <div className="shrink-0">
                <Button
                  onClick={() => setIsCreateOpen(true)}
                  variant="primary"
                  size="md"
                  icon={<Plus className="w-4 h-4" />}
                  className="whitespace-nowrap shrink-0"
                >
                  New Project
                </Button>
              </div>
            </div>
          }
        />

        {/* Search & Category Filter Chips */}
        <div className="flex flex-col gap-5 pt-3">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="w-5 h-5 text-zinc-400 absolute left-4 sm:left-5 pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Search projects by title, technologies, or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '56px', paddingRight: '128px' }}
              className="w-full h-14 sm:h-16 rounded-2xl border border-[var(--border-subtle)] bg-[#0D101C] text-sm sm:text-base text-[var(--text-main)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-indigo-500/50 shadow-inner transition-all"
            />
            <button
              type="submit"
              className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 cursor-pointer transition-all active:scale-[0.98]"
            >
              Search
            </button>
          </form>

          {/* Filter Chips - Clean Spacing & Non-Shrinking */}
          <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto scrollbar-none py-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 border border-indigo-500 font-semibold'
                    : 'bg-[#10131F] text-[var(--text-muted)] hover:text-white border border-[var(--border-subtle)] hover:bg-[#141824]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. FEATURED PROJECT (Showcase hero) */}
      {featured && (
        <div className="space-y-4">
          <SectionHeader title="Featured Project" />

          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] p-7 sm:p-9 space-y-6 hover:border-indigo-500/35 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <Link
                  to={`/projects/${featured._id}`}
                  className="text-2xl sm:text-3xl font-bold text-white hover:text-indigo-300 transition-colors block tracking-tight"
                >
                  {featured.title}
                </Link>
                <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                  {featured.description || featured.abstract || 'AI-powered project lifecycle platform.'}
                </p>
              </div>

              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-indigo-400 shrink-0">
                {featured.progress ?? 68}%
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-zinc-800/80 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                style={{ width: `${featured.progress ?? 68}%` }}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-[var(--border-subtle)] gap-4 text-xs text-[var(--text-muted)]">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2 overflow-hidden">
                    {(featured.members || []).slice(0, 4).map((m, idx) => (
                      <div key={idx} className="ring-2 ring-[#10131F] rounded-full">
                        <Avatar name={m.user?.name || 'Member'} size="sm" src={m.user?.profileImage || m.user?.avatar} />
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-white font-medium">{featured.members?.length || 1} members</span>
                </div>

                <span className="text-zinc-600">·</span>

                <span className="font-mono text-[var(--text-dim)]">
                  Due {formatDeadline(featured.updatedAt || featured.createdAt)}
                </span>
              </div>

              <Link
                to={`/projects/${featured._id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-sm shadow-indigo-600/25 active:scale-[0.98] transition-all self-start sm:self-auto"
              >
                <span>Continue building</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 3. PROJECT GALLERY */}
      <div className="space-y-6">
        <SectionHeader title="Project Gallery" description="Explore active capstone repositories and peer initiatives." />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-[#10131F]/50 border border-[var(--border-subtle)] animate-pulse" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            icon={<FolderGit2 className="w-6 h-6 text-indigo-400" />}
            title="No projects found"
            description="Be the first to publish a project idea or initialize your capstone workspace."
            actionText="Create Project"
            onAction={() => setIsCreateOpen(true)}
            actionIcon={<Plus className="w-4 h-4" />}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryProjects.map((p) => (
              <ProjectCard key={p._id} project={p} />
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {isCreateOpen && (
        <CreateProjectModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onProjectCreated={() => {
            setIsCreateOpen(false);
            loadProjects();
          }}
        />
      )}
    </div>
  );
};
