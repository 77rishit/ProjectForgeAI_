import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from './Button';

export interface AIInsightProps {
  tag?: string;
  matchScore?: number;
  title: string;
  description: string;
  rationale?: string;
  tags?: string[];
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const AIInsight: React.FC<AIInsightProps> = ({
  tag = 'AI RECOMMENDATION',
  matchScore,
  title,
  description,
  rationale,
  tags = [],
  actionText = 'Explore idea',
  onAction,
  className = ''
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/20 via-[#10131F] to-violet-950/20 p-6 sm:p-7 md:p-8 transition-all hover:border-indigo-500/35 ${className}`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-400">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              {tag}
            </span>
            {matchScore !== undefined && (
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-bold font-mono">
                {matchScore}% match
              </span>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {title}
          </h3>

          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            {description}
          </p>

          {rationale && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[var(--text-dim)]">
              <span className="text-[var(--text-muted)] font-medium">Because you know:</span>
              <span className="text-indigo-300 font-medium">{rationale}</span>
            </div>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.04] text-[var(--text-dim)] text-xs font-mono"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {actionText && onAction && (
          <div className="shrink-0 self-start md:self-center">
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
    </div>
  );
};
