import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Layers,
  Sparkles,
  Users,
  Settings,
  Bell,
  Zap,
  ClipboardCheck,
  ShieldCheck,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';

interface FloatingNavProps {
  onOpenNotifications?: () => void;
  unreadCount?: number;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({ onOpenNotifications, unreadCount = 0 }) => {
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const role = user?.role || 'student';

  const studentNav = [
    { to: '/dashboard', label: 'Home', icon: Compass },
    { to: '/projects', label: 'Projects', icon: Layers },
    { to: '/discovery', label: 'Discover', icon: Sparkles },
    { to: '/team-matching', label: 'People', icon: Users }
  ];

  const facultyNav = [
    { to: '/dashboard', label: 'Home', icon: Compass },
    { to: '/projects', label: 'Supervised', icon: Layers },
    { to: '/faculty/reviews', label: 'Reviews', icon: ClipboardCheck },
    { to: '/team-matching', label: 'Directory', icon: Users },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const adminNav = [
    { to: '/dashboard', label: 'Home', icon: Compass },
    { to: '/projects', label: 'Projects', icon: Layers },
    { to: '/team-matching', label: 'Directory', icon: ShieldCheck },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const navItems = role === 'faculty' ? facultyNav : role === 'admin' ? adminNav : studentNav;

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col justify-between py-4 px-2 rounded-2xl bg-[#111116]/85 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-300 ease-out select-none"
      style={{
        width: isHovered ? '200px' : '56px',
        maxHeight: 'calc(100vh - 48px)'
      }}
    >
      {/* Top Brand Logo */}
      <div className="flex flex-col items-start gap-5">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 px-2 py-1.5 w-full rounded-xl hover:bg-white/5 transition-colors group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[1px] shadow-sm shadow-indigo-500/25 shrink-0 flex items-center justify-center">
            <div className="w-full h-full rounded-[11px] bg-[#0c0c10] flex items-center justify-center">
              <Zap className="w-4 h-4 text-cyan-300 fill-cyan-300" />
            </div>
          </div>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <div className="font-bold text-xs text-white tracking-tight leading-none">
                  ProjectForge
                </div>
                <div className="text-[10px] text-indigo-400 font-mono mt-0.5">
                  AI STUDIO
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>

        {/* Primary Navigation Icons */}
        <nav className="flex flex-col gap-1 w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                    isActive
                      ? 'bg-indigo-500/15 text-indigo-300 font-semibold shadow-inner'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="w-6 flex items-center justify-center shrink-0">
                      <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-indigo-400' : 'text-zinc-400 group-hover:text-zinc-200'}`} />
                    </div>

                    <AnimatePresence>
                      {isHovered && (
                        <motion.span
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -6 }}
                          transition={{ duration: 0.15 }}
                          className="whitespace-nowrap overflow-hidden text-xs"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {isActive && (
                      <motion.div
                        layoutId="activeRailIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-r-full bg-indigo-500 shadow-sm shadow-indigo-500"
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area: Separator, Notifications, Settings, Profile */}
      <div className="flex flex-col gap-1 pt-3 border-t border-white/10 w-full">
        {/* Notifications button */}
        <button
          onClick={onOpenNotifications}
          className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors relative group cursor-pointer w-full text-left"
          title="Notifications"
        >
          <div className="w-6 flex items-center justify-center shrink-0 relative">
            <Bell className="w-4 h-4 text-zinc-400 group-hover:text-white transition-transform group-hover:scale-110" />
            {unreadCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-indigo-500 absolute -top-0.5 -right-0.5 ring-2 ring-[#111116]" />
            )}
          </div>
          <AnimatePresence>
            {isHovered && (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.15 }}
                className="whitespace-nowrap overflow-hidden text-xs"
              >
                Notifications
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Settings */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
              isActive
                ? 'bg-indigo-500/15 text-indigo-300 font-semibold'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
            }`
          }
          title="Profile & Settings"
        >
          <div className="w-6 flex items-center justify-center shrink-0">
            <Settings className="w-4 h-4 text-zinc-400 group-hover:text-white transition-transform group-hover:scale-110" />
          </div>
          <AnimatePresence>
            {isHovered && (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.15 }}
                className="whitespace-nowrap overflow-hidden text-xs"
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>

        {/* User Avatar at bottom */}
        {user && (
          <Link
            to="/profile"
            className="flex items-center gap-3 px-1.5 py-1.5 mt-2 rounded-xl hover:bg-white/5 transition-colors group"
          >
            <div className="w-7 h-7 shrink-0 ring-1 ring-white/10 rounded-full overflow-hidden">
              <Avatar
                name={user.name}
                src={user.profileImage || user.avatar}
                size="xs"
              />
            </div>

            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden whitespace-nowrap min-w-0"
                >
                  <div className="text-xs font-semibold text-white truncate">
                    {user.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-zinc-400 truncate">
                    {user.department?.split(' ')[0] || 'Student'}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        )}
      </div>
    </aside>
  );
};
