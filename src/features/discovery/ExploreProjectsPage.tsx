import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Sparkles, ArrowRight, Clock, Layers, Plus } from 'lucide-react';
import { ideaService } from '../../services/ideaService';
import { ProjectIdea } from '../../types';
import { AIIdeaGeneratorModal } from './AIIdeaGeneratorModal';
import { PageHeader } from '../../components/ui/PageHeader';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';

export const ExploreProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [ideas, setIdeas] = useState<ProjectIdea[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    'All',
    'AI / Education',
    'Web Development',
    'AI / Career',
    'Healthcare & Biotech',
    'Finance & Productivity'
  ];

  const loadIdeas = async () => {
    setLoading(true);
    try {
      const data = await ideaService.getIdeas({
        category: category !== 'All' ? category : undefined,
        search: search.trim() || undefined
      });
      setIdeas(data);
    } catch (err) {
      console.error('Failed to load project ideas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIdeas();
  }, [category]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadIdeas();
  };

  return (
    <div className="space-y-16 w-full">
      {/* 1. LARGE HERO HEADER & SEARCH */}
      <div className="space-y-6">
        <PageHeader
          title="Find something worth building."
          subtitle="Explore project ideas matched to your skills and interests."
          actions={
            <Button
              onClick={() => setIsGeneratorOpen(true)}
              variant="primary"
              size="md"
              icon={<Sparkles className="w-4 h-4" />}
            >
              Generate with AI
            </Button>
          }
        />

        {/* Large Search Bar & Filter Chips */}
        <div className="flex flex-col gap-5 pt-3">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="w-5 h-5 text-zinc-400 absolute left-4 sm:left-5 pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Search concepts by keywords, technologies, problem domain..."
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
                onClick={() => setCategory(cat)}
                className={`shrink-0 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  category === cat
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

      {/* 2. RECOMMENDED FOR YOU (Visually Attractive Cards with Generous Whitespace) */}
      <div className="space-y-6 pt-4">
        <SectionHeader
          title="Recommended for you"
          description={`${ideas.length} curated capstone proposals matched to your tech stack.`}
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 rounded-2xl bg-[#10131F]/50 border border-[var(--border-subtle)] animate-pulse" />
            ))}
          </div>
        ) : ideas.length === 0 ? (
          <EmptyState
            icon={<Layers className="w-6 h-6 text-indigo-400" />}
            title="No matching proposals found"
            description="Try broadening your keywords or generate a custom engineering proposal with AI."
            actionText="Generate with AI"
            onAction={() => setIsGeneratorOpen(true)}
            actionIcon={<Sparkles className="w-4 h-4" />}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {ideas.map((idea) => {
              const match = idea.matchPercentage ?? 92;
              const stack = (idea.technologies || idea.recommendedStack || ['React', 'Node.js', 'AI']).slice(0, 4);
              const difficulty = idea.difficulty || 'Intermediate';
              const duration = idea.estimatedDuration || '6-8 weeks';

              return (
                <div
                  key={idea._id}
                  className="rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] hover:bg-[#141725] hover:border-indigo-500/40 p-7 sm:p-8 flex flex-col justify-between space-y-6 transition-all duration-200 group"
                >
                  <div className="space-y-4">
                    {/* Top: Match Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider">
                        ✦ {idea.domain || idea.category || 'AI Innovation'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold shrink-0">
                        {match}% match
                      </span>
                    </div>

                    {/* Title */}
                    <Link
                      to={`/ideas/${idea._id}`}
                      className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors block line-clamp-1 tracking-tight"
                    >
                      {idea.title}
                    </Link>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed line-clamp-3">
                      {idea.description || idea.problemStatement || 'AI-curated capstone project architecture.'}
                    </p>

                    {/* Tech Stack */}
                    <div className="text-xs font-mono text-[var(--text-dim)] pt-1">
                      {stack.join(' · ')}
                    </div>
                  </div>

                  {/* Bottom: Difficulty, Duration & Explore button */}
                  <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-dim)]">
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">
                        {difficulty}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {duration}
                      </span>
                    </div>

                    <Link
                      to={`/ideas/${idea._id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-sm shadow-indigo-600/20"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* AI Generator Modal */}
      <AIIdeaGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onIdeaCreated={() => {
          setIsGeneratorOpen(false);
          loadIdeas();
        }}
      />
    </div>
  );
};
