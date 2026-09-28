import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'circular' | 'rounded';
  width?: string | number;
  height?: string | number;
  shimmer?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rounded',
  width,
  height,
  shimmer = true,
  className = '',
  style,
  ...props
}) => {
  const variantClasses = {
    rectangular: 'rounded-none',
    circular: 'rounded-full shrink-0',
    rounded: 'rounded-xl'
  };

  return (
    <div
      className={`relative overflow-hidden bg-white/[0.06] light:bg-slate-200/80 ${variantClasses[variant]} ${
        shimmer ? 'animate-pulse' : ''
      } ${className}`}
      style={{
        width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : undefined,
        height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : undefined,
        ...style
      }}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.05] light:via-white/[0.25] to-transparent animate-[shimmer_2s_infinite]" />
    </div>
  );
};

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, idx) => (
      <Skeleton
        key={idx}
        height={14}
        width={idx === lines - 1 ? '60%' : idx % 2 === 0 ? '100%' : '85%'}
      />
    ))}
  </div>
);

export const SkeletonAvatar: React.FC<{ size?: number; className?: string }> = ({ size = 40, className = '' }) => (
  <Skeleton variant="circular" width={size} height={size} className={className} />
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-4 ${className}`}>
    <div className="flex items-center gap-3">
      <SkeletonAvatar size={44} />
      <div className="space-y-1.5 flex-1">
        <Skeleton height={16} width="40%" />
        <Skeleton height={12} width="25%" />
      </div>
    </div>
    <SkeletonText lines={2} />
    <div className="pt-2 flex gap-2">
      <Skeleton height={32} width={90} />
      <Skeleton height={32} width={70} />
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; columns?: number; className?: string }> = ({
  rows = 4,
  columns = 4,
  className = ''
}) => (
  <div className={`w-full rounded-2xl border border-[var(--border-subtle)] overflow-hidden bg-[var(--bg-card)] p-4 space-y-3 ${className}`}>
    <div className="flex gap-4 pb-2 border-b border-[var(--border-subtle)]">
      {Array.from({ length: columns }).map((_, idx) => (
        <Skeleton key={idx} height={18} className="flex-1" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, rIdx) => (
      <div key={rIdx} className="flex gap-4 py-2 border-b border-[var(--border-subtle)] last:border-0">
        {Array.from({ length: columns }).map((_, cIdx) => (
          <Skeleton key={cIdx} height={14} className="flex-1" />
        ))}
      </div>
    ))}
  </div>
);
