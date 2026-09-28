import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive' | 'bordered' | 'subtle' | 'glass' | 'gradient';
  hover?: boolean;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  hover = false,
  glow = false,
  ...props
}) => {
  const variantStyles = {
    default: 'border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]',
    interactive:
      'border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:border-indigo-500/35 hover:bg-[var(--bg-surface-card)] cursor-pointer transition-colors duration-200',
    bordered: 'border-[var(--border-subtle)] bg-transparent',
    subtle: 'border-transparent bg-white/[0.02]',
    glass: 'border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]/80 backdrop-blur-md',
    gradient: 'border-indigo-500/20 bg-gradient-to-br from-indigo-950/20 via-[var(--bg-surface-elevated)] to-purple-950/10'
  };

  return (
    <div
      className={twMerge(
        clsx(
          'relative rounded-2xl border text-[var(--text-main)] transition-all duration-200 p-6 sm:p-7 md:p-8',
          variantStyles[variant],
          hover && 'hover:border-indigo-500/35 hover:bg-[var(--bg-surface-card)] cursor-pointer',
          glow && 'border-indigo-500/30 shadow-sm shadow-indigo-500/10',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`flex flex-col space-y-1.5 pb-5 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className = '', ...props }) => (
  <h3 className={`text-lg sm:text-xl font-bold text-[var(--text-main)] tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ children, className = '', ...props }) => (
  <p className={`text-sm text-[var(--text-muted)] leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`pt-0 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`flex items-center pt-5 border-t border-[var(--border-subtle)] ${className}`} {...props}>
    {children}
  </div>
);
