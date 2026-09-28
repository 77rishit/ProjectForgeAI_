import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  Sparkles,
  Users,
  Settings,
  Bell,
  Calendar,
  MessageSquare,
  ClipboardCheck,
  ShieldCheck,
  BarChart3,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';
import { ProjectForgeLogo } from '../ui/ProjectForgeLogo';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpenNotifications?: () => void;
  unreadNotifications?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = false,
  onClose,
  unreadNotifications = 0
}) => {
  const { user } = useAuth();
  const role = user?.role || 'student';

  const studentOverview = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/projects', label: 'My Projects', icon: FolderGit2 },
    { to: '/discovery', label: 'Discover Ideas', icon: Sparkles },
    { to: '/team-matching', label: 'Find Teammates', icon: Users }
  ];

  const facultyOverview = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/projects', label: 'Supervised Projects', icon: FolderGit2 },
    { to: '/faculty/reviews', label: 'Milestone Reviews', icon: ClipboardCheck },
    { to: '/team-matching', label: 'Student Directory', icon: Users },
    { to: '/analytics', label: 'Cohort Analytics', icon: BarChart3 }
  ];

  const adminOverview = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/projects', label: 'All Projects', icon: FolderGit2 },
    { to: '/team-matching', label: 'User Directory', icon: ShieldCheck },
    { to: '/analytics', label: 'Platform Analytics', icon: BarChart3 }
  ];

  const overviewLinks =
    role === 'faculty' ? facultyOverview : role === 'admin' ? adminOverview : studentOverview;

  const workspaceLinks = [
    { to: '/messages', label: 'Messages', icon: MessageSquare },
    { to: '/calendar', label: 'Calendar', icon: Calendar },
    { to: '/notifications', label: 'Notifications', icon: Bell, badge: unreadNotifications }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-[260px] shrink-0 border-r border-[var(--border-subtle)] bg-[#0B0D16] flex flex-col justify-between p-4 transition-transform duration-200 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col gap-6">
          {/* Top Logo & Unique ProjectForge Icon */}
          <div className="flex items-center justify-between px-2 pt-1.5 pb-2">
            <Link to="/dashboard" onClick={onClose} className="group block">
              <ProjectForgeLogo size="md" subtitle="Project Lifecycle" />
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Sections */}
          <div className="flex flex-col gap-6">
            {/* Primary Section */}
            <div className="space-y-1">
              <div className="px-3.5 text-xs font-bold uppercase tracking-wider text-[var(--text-dim)] mb-2.5">
                {role === 'faculty' ? 'FACULTY PORTAL' : role === 'admin' ? 'ADMINISTRATION' : 'OVERVIEW'}
              </div>

              {overviewLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-base font-medium transition-all ${
                        isActive
                          ? 'bg-indigo-500/15 text-indigo-300 font-semibold border-l-2 border-indigo-500 pl-3'
                          : 'text-[var(--text-muted)] hover:text-white hover:bg-white/[0.04]'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5 shrink-0 text-[var(--text-dim)] group-hover:text-indigo-400" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>

            {/* Separator & Workspace Section */}
            <div className="space-y-1 pt-4 border-t border-[var(--border-subtle)]">
              <div className="px-3.5 text-xs font-bold uppercase tracking-wider text-[var(--text-dim)] mb-2.5">
                WORKSPACE
              </div>

              {workspaceLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-base font-medium transition-all ${
                        isActive
                          ? 'bg-indigo-500/15 text-indigo-300 font-semibold border-l-2 border-indigo-500 pl-3'
                          : 'text-[var(--text-muted)] hover:text-white hover:bg-white/[0.04]'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3.5">
                      <Icon className="w-5 h-5 shrink-0 text-[var(--text-dim)]" />
                      <span>{item.label}</span>
                    </div>
                    {typeof item.badge === 'number' && item.badge > 0 && (
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 ring-2 ring-[#0B0D16]" />
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section: Settings & Profile */}
        <div className="space-y-2.5 pt-3 border-t border-[var(--border-subtle)]">
          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-base font-medium transition-all ${
                isActive
                  ? 'bg-indigo-500/15 text-indigo-300 font-semibold border-l-2 border-indigo-500 pl-3'
                  : 'text-[var(--text-muted)] hover:text-white hover:bg-white/[0.04]'
              }`
            }
          >
            <Settings className="w-5 h-5 shrink-0 text-[var(--text-dim)]" />
            <span>Settings</span>
          </NavLink>

          {user && (
            <Link
              to="/profile"
              onClick={onClose}
              className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[#10131F] hover:border-indigo-500/30 transition-all flex items-center gap-3 group"
            >
              <Avatar name={user.name} src={user.profileImage || user.avatar} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-semibold text-[var(--text-main)] group-hover:text-indigo-300 transition-colors truncate">
                  {user.name}
                </div>
                <div className="text-xs text-[var(--text-muted)] truncate">
                  {user.department || (role === 'student' ? 'Computer Science' : 'Faculty')}
                </div>
              </div>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
};
