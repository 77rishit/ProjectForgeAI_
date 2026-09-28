import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'surface' | 'primary';
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  size = 'md',
  variant = 'ghost',
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'w-8 h-8 rounded-lg text-xs',
    md: 'w-10 h-10 rounded-xl text-sm',
    lg: 'w-12 h-12 rounded-xl text-base'
  };

  const variantStyles = {
    ghost: 'text-[var(--text-muted)] hover:text-white hover:bg-white/[0.06]',
    surface: 'bg-[#10131F] text-[var(--text-muted)] hover:text-white hover:bg-[#141725] border border-[var(--border-subtle)]',
    primary: 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm shadow-indigo-600/20'
  };

  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className={`inline-flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none shrink-0 ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
};
