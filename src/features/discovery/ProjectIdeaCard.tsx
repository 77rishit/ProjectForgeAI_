import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { ProjectIdea } from '../../types';

export interface ProjectIdeaCardProps {
  idea: ProjectIdea;
  onToggleSave?: (id: string) => Promise<void>;
  onAdopt?: (id: string) => Promise<void>;
  isAdopting?: boolean;
}

export const ProjectIdeaCard: React.FC<ProjectIdeaCardProps> = ({ idea }) => {
  const navigate = useNavigate();

  const matchPct = idea.matchPercentage ?? 92;
  const technologies = (idea.technologies || idea.recommendedStack || ['React', 'Node.js', 'AI']).slice(0, 3);
  const description = idea.description || idea.problemStatement || idea.solutionOverview || 'AI-curated project idea.';
  const duration = idea.estimatedDuration || '6-8 weeks';
  const difficulty = idea.difficulty || 'Intermediate';

  const handleExplore = () => {
    navigate(`/ideas/${idea._id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      onClick={handleExplore}
      className="group relative rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 sm:p-6 transition-all duration-200 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5 flex flex-col justify-between cursor-pointer"
    >
      <div className="space-y-3">
        {/* Top: Title & AI Match % */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-[var(--text-main)] group-hover:text-indigo-400 transition-colors line-clamp-1">
            {idea.title}
          </h3>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full shrink-0">
            {matchPct}% match
          </span>
        </div>

        {/* Simple description */}
        <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Technologies: React · Node.js · AI */}
        <div className="text-[11px] text-[var(--text-dim)] font-medium">
          {technologies.join(' · ')}
        </div>
      </div>

      {/* Bottom: Difficulty · Duration & [Explore] */}
      <div className="mt-5 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
        <span className="text-[var(--text-dim)] text-[11px]">
          {difficulty} · {duration}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleExplore();
          }}
          className="inline-flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors group/btn cursor-pointer"
        >
          <span>Explore</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};
