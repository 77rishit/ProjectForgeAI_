import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: 'indigo' | 'emerald' | 'cyan' | 'amber' | 'gradient';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showValue = true,
  color = 'indigo',
  size = 'md',
  className
}) => {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  const colorStyles = {
    indigo: 'bg-indigo-500 shadow-indigo-500/50',
    emerald: 'bg-emerald-500 shadow-emerald-500/50',
    cyan: 'bg-cyan-500 shadow-cyan-500/50',
    amber: 'bg-amber-500 shadow-amber-500/50',
    gradient: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 shadow-indigo-500/40'
  };

  const sizeStyles = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className={twMerge('w-full flex flex-col gap-1.5', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="font-medium text-white/70">{label}</span>}
          {showValue && <span className="font-semibold text-white/90 font-mono">{percentage}%</span>}
        </div>
      )}
      <div className={twMerge('w-full rounded-full bg-white/10 overflow-hidden relative', sizeStyles[size])}>
        <div
          className={twMerge(clsx('h-full rounded-full transition-all duration-500 shadow-sm', colorStyles[color]))}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
