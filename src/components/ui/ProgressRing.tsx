import React from 'react';
import { motion } from 'framer-motion';

export interface ProgressRingProps {
  progress: number; // 0 to 100
  size?: number; // width and height in px
  strokeWidth?: number;
  variant?: 'brand' | 'cyan' | 'emerald' | 'amber' | 'rose';
  showValue?: boolean;
  label?: string;
  children?: React.ReactNode;
  className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 10,
  variant = 'brand',
  showValue = true,
  label,
  children,
  className = ''
}) => {
  const clamped = Math.min(100, Math.max(0, progress));
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  const gradientId = `ring-grad-${variant}-${size}`;

  const variantGradients = {
    brand: { start: '#6366f1', stop: '#06b6d4' },
    cyan: { start: '#06b6d4', stop: '#38bdf8' },
    emerald: { start: '#10b981', stop: '#34d399' },
    amber: { start: '#f59e0b', stop: '#fbbf24' },
    rose: { start: '#f43f5e', stop: '#fb7185' }
  };

  const grad = variantGradients[variant];

  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={grad.start} />
            <stop offset="100%" stopColor={grad.stop} />
          </linearGradient>
        </defs>

        {/* Background track circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Animated Progress circle */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeLinecap="round"
          fill="transparent"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>

      {/* Central Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
        {children ? (
          children
        ) : showValue ? (
          <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {Math.round(clamped)}%
          </span>
        ) : null}
      </div>

      {label && <span className="text-[11px] font-semibold text-white/60 mt-1.5">{label}</span>}
    </div>
  );
};
