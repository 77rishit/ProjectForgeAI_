import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Sparkles,
  Bell,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  Compass,
  Layers,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Avatar } from '../ui/Avatar';
import { QuickRoleSwitcher } from './QuickRoleSwitcher';
import { RoleBadge } from './RoleBadge';

interface NavbarProps {
  onToggleSidebar?: () => void;
  onOpenNotifications?: () => void;
  unreadNotifications?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  onOpenNotifications,
  unreadNotifications = 0
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [commandOpen, setCommandOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // ⌘K Keyboard Shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setCommandOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    const p = location.pathname;
    if (p.startsWith('/dashboard')) return 'Overview';
    if (p.startsWith('/projects/') && p !== '/projects') return 'Project Workspace';
    if (p.startsWith('/projects')) return 'My Projects';
    if (p.startsWith('/discovery')) return 'Discover Ideas';
    if (p.startsWith('/team-matching')) return 'Find Teammates';
    if (p.startsWith('/recommendations')) return 'AI Recommendations';
    if (p.startsWith('/calendar')) return 'Calendar';
    if (p.startsWith('/messages')) return 'Messages';
    if (p.startsWith('/notifications')) return 'Notifications';
    if (p.startsWith('/settings')) return 'Settings';
    if (p.startsWith('/profile')) return 'Profile';
    if (p.startsWith('/analytics')) return 'Analytics';
    if (p.startsWith('/faculty/reviews')) return 'Milestone Reviews';
    return 'ProjectForge AI';
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-16 sm:h-[68px] w-full border-b border-[var(--border-subtle)] bg-[#080A12]/85 backdrop-blur-md px-4 sm:px-6 md:px-8 flex items-center justify-between transition-colors">
        {/* Left: Mobile Toggle & Page Context */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-xl text-[var(--text-muted)] hover:text-white hover:bg-white/5 cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[var(--text-muted)]">
            <span className="hidden sm:inline text-[var(--text-dim)]">ProjectForge AI</span>
            <span className="hidden sm:inline text-zinc-700">/</span>
            <span className="text-[var(--text-main)] font-semibold">{getPageTitle()}</span>
          </div>
        </div>

        {/* Center: Search Bar Trigger */}
        <div className="flex-1 max-w-md mx-4 hidden sm:block">
          <button
            onClick={() => setCommandOpen(true)}
            className="w-full flex items-center justify-between px-4 py-2 rounded-xl border border-[var(--border-subtle)] bg-[#0B0D16] text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-white/20 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-xs">Search projects, ideas, teammates...</span>
            </div>
            <kbd className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/recommendations"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-sm shadow-indigo-600/25 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Studio</span>
          </Link>

          <QuickRoleSwitcher />

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/5 transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifications > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 absolute top-2 right-2 ring-2 ring-[var(--bg-surface)]" />
              )}
            </button>

            {notificationsOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] p-4 shadow-2xl z-50 text-[var(--text-main)]">
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-dim)]">Notifications</span>
                    <Link
                      to="/notifications"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      View all
                    </Link>
                  </div>
                  <div className="py-4 text-center text-xs text-[var(--text-muted)] space-y-2">
                    <p>No unread alerts.</p>
                    <Link
                      to="/notifications"
                      onClick={() => setNotificationsOpen(false)}
                      className="inline-block text-[11px] text-indigo-400 hover:underline"
                    >
                      Open Notification Center →
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/5 transition-colors cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* User Profile */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1 rounded-full border border-[var(--border-subtle)] hover:border-indigo-500/40 transition-colors cursor-pointer"
              >
                <Avatar name={user.name} size="sm" src={user.profileImage || user.avatar} />
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-3 shadow-2xl z-50 text-[var(--text-main)]">
                    <div className="pb-2.5 border-b border-[var(--border-subtle)]">
                      <div className="font-semibold text-xs text-[var(--text-main)] truncate">{user.name}</div>
                      <div className="text-[11px] text-[var(--text-muted)] truncate">{user.email}</div>
                      <div className="mt-1.5">
                        <RoleBadge role={user.role} size="sm" />
                      </div>
                    </div>

                    <div className="py-1 border-b border-[var(--border-subtle)]">
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--text-main)] hover:bg-white/5 transition-colors"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Profile & Settings</span>
                      </Link>
                    </div>

                    <div className="pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Global ⌘K Command Palette Modal */}
      <AnimatePresence>
        {commandOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCommandOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="relative w-full max-w-xl rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] shadow-2xl overflow-hidden z-10 text-[var(--text-main)]"
            >
              <div className="flex items-center px-4 py-3 border-b border-[var(--border-subtle)]">
                <Search className="w-4 h-4 text-indigo-400 mr-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Type a command or search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-transparent text-sm text-[var(--text-main)] placeholder:text-[var(--text-dim)] outline-none"
                />
                <button
                  onClick={() => setCommandOpen(false)}
                  className="p-1 rounded-lg text-[var(--text-dim)] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-2 max-h-80 overflow-y-auto text-xs space-y-1">
                <div className="px-3 py-1.5 text-[10px] font-semibold text-[var(--text-dim)] uppercase tracking-wider">
                  Quick Navigation
                </div>

                <button
                  onClick={() => {
                    setCommandOpen(false);
                    navigate('/dashboard');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/5 text-left text-[var(--text-main)] cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Compass className="w-4 h-4 text-indigo-400" />
                    <span>Overview Dashboard</span>
                  </div>
                  <span className="text-[10px] text-[var(--text-dim)]">Go</span>
                </button>

                <button
                  onClick={() => {
                    setCommandOpen(false);
                    navigate('/projects');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/5 text-left text-[var(--text-main)] cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span>My Projects</span>
                  </div>
                  <span className="text-[10px] text-[var(--text-dim)]">Go</span>
                </button>

                <button
                  onClick={() => {
                    setCommandOpen(false);
                    navigate('/discovery');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/5 text-left text-[var(--text-main)] cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Discover Ideas</span>
                  </div>
                  <span className="text-[10px] text-[var(--text-dim)]">Go</span>
                </button>

                <button
                  onClick={() => {
                    setCommandOpen(false);
                    navigate('/team-matching');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/5 text-left text-[var(--text-main)] cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span>Find Teammates</span>
                  </div>
                  <span className="text-[10px] text-[var(--text-dim)]">Go</span>
                </button>
              </div>

              <div className="px-4 py-2 border-t border-[var(--border-subtle)] bg-black/20 flex items-center justify-between text-[11px] text-[var(--text-dim)]">
                <span>Navigate with keyboard</span>
                <span>ESC to close</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
