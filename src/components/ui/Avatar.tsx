import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface AvatarProps {
  name: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  ring?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = 'md',
  className,
  ring = true
}) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  };

  const gradients = [
    'from-indigo-500 to-purple-600',
    'from-cyan-500 to-blue-600',
    'from-emerald-500 to-teal-600',
    'from-rose-500 to-pink-600',
    'from-amber-500 to-orange-600'
  ];

  // Pick deterministic gradient by name hash
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gradient = gradients[hash % gradients.length];

  return (
    <div
      className={twMerge(
        clsx(
          'relative rounded-full flex items-center justify-center font-bold text-white shrink-0 overflow-hidden select-none',
          sizeClasses[size],
          ring && 'ring-2 ring-white/10 shadow-sm',
          src ? 'bg-white/5' : `bg-gradient-to-tr ${gradient}`,
          className
        )
      )}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

export interface AvatarGroupProps {
  users: Array<{ name: string; src?: string }>;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  users,
  max = 4,
  size = 'sm',
  className
}) => {
  const visible = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className={twMerge('flex items-center -space-x-2 overflow-hidden', className)}>
      {visible.map((user, idx) => (
        <Avatar
          key={`${user.name}-${idx}`}
          name={user.name}
          src={user.src}
          size={size}
          ring={true}
          className="hover:scale-110 hover:z-10 transition-transform duration-150 ring-2 ring-[#090b14]"
        />
      ))}
      {remaining > 0 && (
        <div
          className={clsx(
            'relative rounded-full flex items-center justify-center font-bold text-indigo-200 bg-indigo-950/80 border border-indigo-500/30 ring-2 ring-[#090b14] shrink-0 text-xs',
            size === 'xs' && 'w-6 h-6 text-[10px]',
            size === 'sm' && 'w-8 h-8 text-xs',
            size === 'md' && 'w-10 h-10 text-sm',
            size === 'lg' && 'w-12 h-12 text-base'
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};
