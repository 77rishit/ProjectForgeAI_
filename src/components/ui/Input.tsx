import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-[var(--text-muted)] tracking-wide">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 text-[var(--text-dim)] pointer-events-none flex items-center justify-center">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={twMerge(
              clsx(
                'w-full h-11 sm:h-12 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] px-4 text-sm text-[var(--text-main)] placeholder:text-[var(--text-dim)] transition-all duration-150 outline-none',
                'focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/15 focus:bg-[var(--bg-surface-elevated)]',
                icon && 'pl-11',
                error && 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/15',
                className
              )
            )}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-rose-400 font-medium">{error}</span>}
        {helperText && !error && <span className="text-xs text-[var(--text-dim)]">{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
