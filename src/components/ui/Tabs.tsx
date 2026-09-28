import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'pill' | 'underline' | 'segmented';
  size?: 'sm' | 'md';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'segmented',
  size = 'md',
  className
}) => {
  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-xs sm:text-sm px-3.5 py-1.5 gap-2'
  };

  if (variant === 'underline') {
    return (
      <div
        className={twMerge(
          'flex items-center gap-4 sm:gap-6 border-b border-[var(--border-subtle)] overflow-x-auto scrollbar-none',
          className
        )}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={clsx(
                'relative flex items-center py-2.5 font-medium transition-colors duration-150 shrink-0 cursor-pointer',
                size === 'sm' ? 'text-xs gap-1.5' : 'text-xs sm:text-sm gap-2',
                isActive ? 'text-[var(--text-main)] font-semibold' : 'text-[var(--text-dim)] hover:text-[var(--text-muted)]'
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={clsx(
                    'px-1.5 py-0.2 rounded-full text-[10px] font-mono',
                    isActive ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/25' : 'bg-zinc-100 dark:bg-zinc-800 text-[var(--text-dim)]'
                  )}
                >
                  {tab.count}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 inset-x-0 h-0.5 bg-indigo-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={twMerge(
        'inline-flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] overflow-x-auto scrollbar-none',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'relative flex items-center rounded-lg font-medium transition-colors duration-150 shrink-0 cursor-pointer select-none',
              sizeClasses[size],
              isActive ? 'text-[var(--text-main)] font-semibold' : 'text-[var(--text-dim)] hover:text-[var(--text-muted)]'
            )}
          >
            {isActive && (
              <motion.div
                layoutId={`activeTabIndicator-${variant}`}
                className={clsx(
                  'absolute inset-0 rounded-lg shadow-sm',
                  variant === 'segmented'
                    ? 'bg-[var(--bg-card)] border border-[var(--border-subtle)]'
                    : 'bg-indigo-600 text-white'
                )}
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={clsx(
                    'px-1.5 py-0.2 rounded-full text-[10px] font-mono',
                    isActive ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-100 dark:bg-zinc-800 text-[var(--text-dim)]'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};
