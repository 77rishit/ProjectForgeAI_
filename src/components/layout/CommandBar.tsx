import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Sparkles,
  Bell,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  Zap,
  Layers,
  Users,
  Compass,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Avatar } from '../ui/Avatar';
import { QuickRoleSwitcher } from './QuickRoleSwitcher';
import { RoleBadge } from './RoleBadge';

interface CommandBarProps {
  onOpenAIGenerator?: () => void;
}

export const CommandBar: React.FC<CommandBarProps> = ({ onOpenAIGenerator }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

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

  const handleCommandSelect = (path: string) => {
    setCommandOpen(false);
    navigate(path);
  };

  return (
    <>
      <header className="sticky top-4 z-30 w-full max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-12 sm:h-13 px-3.5 sm:px-4 rounded-2xl bg-[#111116]/85 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-200">
          {/* Left: Brand Identity / Small Context */}
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/90 flex items-center justify-center text-white shadow-sm shadow-indigo-600/30 group-hover:bg-indigo-500 transition-colors">
              <Zap className="w-3.5 h-3.5 fill-white" />
            </div>
            <span className="font-bold text-xs tracking-tight text-white hidden sm:inline group-hover:text-indigo-300 transition-colors">
              ProjectForge
            </span>
          </Link>

          {/* Center: Command Palette Trigger */}
          <button
            onClick={() => setCommandOpen(true)}
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/15 text-xs text-zinc-400 hover:text-white transition-all cursor-pointer w-48 sm:w-80 justify-between group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-zinc-400 group-hover:text-indigo-400 transition-colors" />
              <span className="truncate text-[11px] sm:text-xs">Search projects, ideas, peers...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono rounded bg-white/5 border border-white/10 text-zinc-400">
              ⌘K
            </kbd>
          </button>

          {/* Right: AI Button, Notifications, Theme, User Avatar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* AI Shortcut Button */}
            <button
              onClick={() => {
                if (onOpenAIGenerator) onOpenAIGenerator();
                else navigate('/discovery');
              }}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-cyan-500/15 border border-indigo-500/30 hover:border-indigo-500/50 text-indigo-300 hover:text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
              title="AI Project Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">AI Studio</span>
            </button>

            {/* Quick Role Switcher */}
            <QuickRoleSwitcher />

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-1.5 sm:p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 absolute top-2 right-2 ring-2 ring-[#111116]" />
              </button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-white/10 bg-[#121218] p-3 shadow-2xl z-50 text-white backdrop-blur-xl">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10 px-1">
                      <span className="text-xs font-semibold">Notifications</span>
                      <span className="text-[10px] text-indigo-400 font-medium">All caught up</span>
                    </div>
                    <div className="py-4 text-center text-xs text-zinc-400">
                      No new notifications right now.
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            {/* User Profile */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-1.5 p-0.5 rounded-full ring-1 ring-white/10 hover:ring-indigo-500/50 transition-all cursor-pointer"
                >
                  <Avatar name={user.name} size="sm" src={user.profileImage || user.avatar} />
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-white/10 bg-[#121218] p-3 shadow-2xl z-50 text-white backdrop-blur-xl">
                      <div className="pb-2.5 border-b border-white/10">
                        <div className="font-semibold text-xs text-white truncate">{user.name}</div>
                        <div className="text-[11px] text-zinc-400 truncate">{user.email}</div>
                        <div className="mt-1.5">
                          <RoleBadge role={user.role} size="sm" />
                        </div>
                      </div>

                      <div className="py-1 border-b border-white/10">
                        <Link
                          to="/profile"
                          onClick={() => setProfileOpen(false)}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-200 hover:bg-white/5 transition-colors"
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
              className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-[#121218] shadow-2xl overflow-hidden z-10 text-white"
            >
              <div className="flex items-center px-4 py-3 border-b border-white/10">
                <Search className="w-4 h-4 text-indigo-400 mr-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Type a command or search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none"
                />
                <button
                  onClick={() => setCommandOpen(false)}
                  className="p-1 rounded-lg text-zinc-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-2 max-h-80 overflow-y-auto text-xs space-y-1">
                <div className="px-3 py-1.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                  Quick Navigation
                </div>

                <button
                  onClick={() => handleCommandSelect('/dashboard')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/5 text-left text-zinc-200 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Compass className="w-4 h-4 text-indigo-400" />
                    <span>Home Command Center</span>
                  </div>
                  <span className="text-[10px] text-zinc-500">Go</span>
                </button>

                <button
                  onClick={() => handleCommandSelect('/projects')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/5 text-left text-zinc-200 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span>My Capstone Projects</span>
                  </div>
                  <span className="text-[10px] text-zinc-500">Go</span>
                </button>

                <button
                  onClick={() => handleCommandSelect('/discovery')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/5 text-left text-zinc-200 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Discover AI Project Ideas</span>
                  </div>
                  <span className="text-[10px] text-zinc-500">Go</span>
                </button>

                <button
                  onClick={() => handleCommandSelect('/team-matching')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/5 text-left text-zinc-200 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span>Find Teammates & Peers</span>
                  </div>
                  <span className="text-[10px] text-zinc-500">Go</span>
                </button>

                <button
                  onClick={() => handleCommandSelect('/profile')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/5 text-left text-zinc-200 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <UserIcon className="w-4 h-4 text-zinc-400" />
                    <span>Student Profile & Skills</span>
                  </div>
                  <span className="text-[10px] text-zinc-500">Go</span>
                </button>
              </div>

              <div className="px-4 py-2 border-t border-white/10 bg-black/30 flex items-center justify-between text-[11px] text-zinc-500">
                <span>Navigate with keys</span>
                <span>ESC to close</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
