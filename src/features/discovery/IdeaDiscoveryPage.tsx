import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ideaService } from '../../services/ideaService';
import { ProjectIdea } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { AIIdeaGeneratorModal } from './AIIdeaGeneratorModal';
import { useToast } from '../../context/ToastContext';
import {
  Compass,
  Sparkles,
  Search,
  Bookmark,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export const IdeaDiscoveryPage: React.FC = () => {
  const [ideas, setIdeas] = useState<ProjectIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [adoptingId, setAdoptingId] = useState<string | null>(null);

  const toast = useToast();
  const navigate = useNavigate();

  const domains = [
    'All',
    'AI / Machine Learning',
    'Healthcare & Biotech',
    'ClimateTech & IoT',
    'Cybersecurity & Cloud',
    'Full-Stack Web3'
  ];

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const loadIdeas = async () => {
    setLoading(true);
    try {
      const data = await ideaService.getIdeas({
        domain: selectedDomain === 'All' ? undefined : selectedDomain,
        difficulty: selectedDifficulty === 'All' ? undefined : selectedDifficulty,
        search: search || undefined
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
  }, [selectedDomain, selectedDifficulty]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadIdeas();
  };

  const handleToggleBookmark = async (id: string) => {
    try {
      const res = await ideaService.toggleBookmark(id);
      toast.info(res.bookmarked ? 'Idea saved to bookmarks' : 'Idea removed from bookmarks');
      setIdeas((prev) =>
        prev.map((idea) => {
          if (idea._id === id) {
            return {
              ...idea,
              bookmarkedBy: res.bookmarked
                ? [...idea.bookmarkedBy, 'me']
                : idea.bookmarkedBy.slice(0, -1)
            };
          }
          return idea;
        })
      );
    } catch (err: any) {
      toast.error(err.message || 'Error updating bookmark');
    }
  };

  const handleAdopt = async (id: string) => {
    setAdoptingId(id);
    try {
      const res = await ideaService.adoptIdea(id);
      toast.success(res.message || 'Project created from idea!');
      navigate(`/projects/${res.project._id}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to adopt project idea');
    } finally {
      setAdoptingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Idea Discovery Bank
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Compass className="w-7 h-7 text-cyan-400" />
            <span>Discover High-Impact Project Ideas</span>
          </h1>
          <p className="text-sm text-white/60 mt-1 max-w-2xl">
            Explore faculty-approved project proposals or synthesize customized technical blueprints with AI.
          </p>
        </div>

        <Button
          onClick={() => setIsGeneratorOpen(true)}
          variant="glow"
          size="md"
          icon={<Sparkles className="w-4 h-4" />}
        >
          Forge with AI
        </Button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col gap-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <Input
            placeholder="Search problems, keywords, tech stacks (e.g. PyTorch, SnarkJS, Smart Grid)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
          <Button type="submit" variant="secondary" size="md">
            Search
          </Button>
        </form>

        {/* Domain chips */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedDomain === dom
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-500'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>

        {/* Difficulty pills */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40 font-medium">Difficulty:</span>
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                selectedDifficulty === diff
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Project Ideas Grid */}
      {loading ? (
        <div className="p-12 text-center text-white/40 font-mono text-xs">Scanning project library...</div>
      ) : ideas.length === 0 ? (
        <Card className="p-12 text-center">
          <h3 className="text-base font-bold text-white mb-2">No matching project ideas found</h3>
          <p className="text-xs text-white/50 max-w-md mx-auto mb-6">
            Try adjusting your search filters or use our AI Generator to synthesize ideas for your preferred tech stack.
          </p>
          <Button onClick={() => setIsGeneratorOpen(true)} variant="glow" size="sm" icon={<Sparkles className="w-4 h-4" />}>
            Generate with AI
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ideas.map((idea) => (
            <Card key={idea._id} hover className="p-6 flex flex-col justify-between gap-5">
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="indigo" size="sm">{idea.domain}</Badge>
                    <Badge
                      variant={
                        idea.difficulty === 'Beginner' ? 'cyan' :
                        idea.difficulty === 'Intermediate' ? 'purple' : 'warning'
                      }
                      size="sm"
                    >
                      {idea.difficulty}
                    </Badge>
                  </div>

                  <button
                    onClick={() => handleToggleBookmark(idea._id)}
                    className="p-1.5 rounded-lg text-white/40 hover:text-amber-400 hover:bg-white/5 transition-colors cursor-pointer"
                    title="Bookmark Idea"
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        idea.bookmarkedBy?.length ? 'fill-amber-400 text-amber-400' : ''
                      }`}
                    />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
                  {idea.title}
                </h3>

                <div className="text-xs text-white/70 space-y-2">
                  <p className="leading-relaxed">
                    <strong className="text-white/90">Challenge:</strong> {idea.problemStatement}
                  </p>
                  <p className="leading-relaxed">
                    <strong className="text-white/90">Solution:</strong> {idea.solutionOverview}
                  </p>
                </div>

                {/* Tech stack tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {idea.recommendedStack?.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-md bg-white/5 text-white/80 font-mono text-[11px] border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom footer: Duration & Adopt Button */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
                <span className="text-white/40 flex items-center gap-1.5 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-white/40" />
                  {idea.estimatedDuration}
                </span>

                <Button
                  onClick={() => handleAdopt(idea._id)}
                  variant="glow"
                  size="sm"
                  loading={adoptingId === idea._id}
                  icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                >
                  Adopt Idea
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* AI Idea Generator Modal */}
      <AIIdeaGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => {
          setIsGeneratorOpen(false);
          loadIdeas();
        }}
      />
    </div>
  );
};
