import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from './Button';

export interface AIRecommendationProps {
  title: string;
  matchScore: number;
  explanation: string;
  skills?: string[];
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const AIRecommendation: React.FC<AIRecommendationProps> = ({
  title,
  matchScore,
  explanation,
  skills = ['React', 'Node.js', 'AI'],
  actionText = 'Explore idea',
  onAction,
  className = ''
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-950/20 via-[#10131F] to-violet-950/20 p-7 sm:p-8 md:p-9 transition-all hover:border-indigo-500/40 space-y-5 ${className}`}
    >
      {/* Header: Tag + Synergy Badge */}
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-indigo-400">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>AI RECOMMENDATION</span>
        </span>
        <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-mono font-bold">
          {matchScore}% match
        </span>
      </div>

      {/* Title */}
      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
        {title}
      </h3>

      {/* Explanation */}
      <p className="text-sm text-[var(--text-muted)] leading-relaxed">
        "{explanation}"
      </p>

      {/* Stack Rationale */}
      {skills.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="text-xs text-[var(--text-dim)] font-mono">Because you know:</div>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span
                key={s}
                className="px-2.5 py-1 rounded-lg bg-[#141824] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-muted)]"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* CTA Button */}
      {onAction && (
        <div className="pt-3 border-t border-[var(--border-subtle)] flex justify-end">
          <Button
            onClick={onAction}
            variant="primary"
            size="md"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};
