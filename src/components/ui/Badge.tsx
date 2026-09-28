import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'indigo' | 'cyan' | 'purple' | 'outline';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'default',
  size = 'md',
  ...props
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium rounded-md',
    md: 'text-xs px-2.5 py-0.5 font-medium rounded-full'
  };

  const variantClasses = {
    default: 'bg-zinc-100 dark:bg-zinc-800 text-[var(--text-muted)] border border-[var(--border-subtle)]',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    cyan: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    outline: 'border border-[var(--border-subtle)] text-[var(--text-muted)] bg-transparent'
  };

  return (
    <span
      className={twMerge(clsx('inline-flex items-center gap-1 shrink-0 select-none', sizeClasses[size], variantClasses[variant], className))}
      {...props}
    >
      {children}
    </span>
  );
};
