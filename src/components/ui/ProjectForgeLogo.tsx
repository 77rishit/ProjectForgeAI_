import React from 'react';

interface ProjectForgeLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  subtitle?: string;
}

export const ProjectForgeLogo: React.FC<ProjectForgeLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  subtitle
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-sm font-bold',
    md: 'text-base font-bold',
    lg: 'text-lg font-bold',
    xl: 'text-xl font-extrabold'
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Unique ProjectForge Icon: Geometric Forge Prism + AI spark node */}
      <div
        className={`${iconSizes[size]} relative rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/35 transition-all duration-200`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4/7 h-4/7 text-white"
        >
          {/* Stylized Forge Flame / Anvil Core */}
          <path
            d="M12 2L14.7 7.5L20.5 8.5L16.2 12.8L17.2 18.5L12 15.8L6.8 18.5L7.8 12.8L3.5 8.5L9.3 7.5L12 2Z"
            fill="currentColor"
            fillOpacity="0.15"
          />
          <path
            d="M5 16L12 4L19 16L12 20L5 16Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 4V20"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="12" cy="11" r="2.2" fill="white" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight min-w-0">
          <div className={`${textSizes[size]} text-[var(--text-main)] tracking-tight flex items-center gap-1.5`}>
            <span>ProjectForge</span>
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
              AI
            </span>
          </div>
          {subtitle && (
            <span className="text-[11px] text-[var(--text-muted)] font-medium -mt-0.5 truncate">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
