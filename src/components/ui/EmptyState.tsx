import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  actionIcon
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center max-w-md mx-auto">
      {icon && (
        <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[var(--text-muted)] mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-[var(--text-main)] tracking-tight mb-1.5">{title}</h3>
      <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6 max-w-sm">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} variant="secondary" size="md" icon={actionIcon}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
