import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Sparkles,
  Bell,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Avatar } from '../ui/Avatar';
import { IconButton } from '../ui/IconButton';

export interface TopNavigationProps {
  onToggleSidebar?: () => void;
  onOpenNotifications?: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  onToggleSidebar,
  onOpenNotifications
}) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const getPageTitle = () => {
    const p = location.pathname;
    if (p.startsWith('/dashboard')) return 'Overview';
    if (p.startsWith('/projects/') && p !== '/projects') return 'Project Workspace';
    if (p.startsWith('/projects')) return 'My Projects';
    if (p.startsWith('/discovery')) return 'Discover Ideas';
    if (p.startsWith('/team-matching') || p.startsWith('/teams') || p.startsWith('/teammates')) return 'Find Teammates';
    if (p.startsWith('/recommendations')) return 'AI Recommendations';
    if (p.startsWith('/calendar')) return 'Calendar';
    if (p.startsWith('/messages')) return 'Messages';
    if (p.startsWith('/notifications')) return 'Notifications';
    if (p.startsWith('/settings')) return 'Settings';
    if (p.startsWith('/profile')) return 'Profile';
    if (p.startsWith('/faculty/reviews')) return 'Faculty Reviews';
    if (p.startsWith('/analytics')) return 'Analytics';
    return 'Workspace';
  };

  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b border-[var(--border-subtle)] bg-[#080A12]/85 backdrop-blur-md px-5 sm:px-8 flex items-center justify-between transition-colors">
      {/* Left: Mobile Toggle & Page Context */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-xl text-[var(--text-muted)] hover:text-white hover:bg-white/5 cursor-pointer"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)]">
          <span className="hidden sm:inline text-[var(--text-dim)]">ProjectForge AI</span>
          <span className="hidden sm:inline text-zinc-700">/</span>
          <span className="text-white font-semibold">{getPageTitle()}</span>
        </div>
      </div>

      {/* Right: Search, AI Studio, Notifications, Theme, Avatar */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Quick Search Trigger */}
        <Link
          to="/discovery"
          className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[#10131F] text-xs text-[var(--text-dim)] hover:text-white hover:border-white/20 transition-all"
        >
          <Search className="w-3.5 h-3.5 text-zinc-500" />
          <span>Search projects, ideas, skills...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white/[0.04] text-[10px] font-mono border border-white/5">⌘K</kbd>
        </Link>

        {/* AI Studio Link */}
        <Link
          to="/recommendations"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/25 hover:border-indigo-500/50 text-xs font-semibold text-indigo-300 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>AI Studio</span>
        </Link>

        {/* Notifications */}
        <Link
          to="/notifications"
          className="p-2 rounded-xl text-[var(--text-muted)] hover:text-white hover:bg-white/[0.06] transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500" />
        </Link>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-[var(--text-muted)] hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          title={theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User Profile Avatar */}
        {user && (
          <Link to="/profile" className="flex items-center gap-2 group">
            <Avatar
              name={user.name}
              src={user.profileImage || user.avatar}
              size="sm"
              className="ring-2 ring-transparent group-hover:ring-indigo-500/40 transition-all"
            />
          </Link>
        )}
      </div>
    </header>
  );
};
