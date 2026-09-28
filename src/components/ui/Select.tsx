import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-xs font-semibold text-[var(--text-muted)]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            className={twMerge(
              clsx(
                'w-full h-10 sm:h-11 appearance-none rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3.5 pr-10 text-xs sm:text-sm text-[var(--text-main)] transition-all duration-150 outline-none cursor-pointer',
                'focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/15 focus:bg-[var(--bg-card)]',
                error && 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/15',
                className
              )
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[var(--bg-secondary)] text-[var(--text-main)]">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 w-4 h-4 text-[var(--text-dim)] pointer-events-none" />
        </div>
        {error && <span className="text-xs text-rose-400 font-medium">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
