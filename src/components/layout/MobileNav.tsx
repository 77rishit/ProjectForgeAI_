import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderGit2, Sparkles, Users, User } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const navItems = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/projects', label: 'Projects', icon: FolderGit2 },
    { to: '/discovery', label: 'Ideas', icon: Sparkles },
    { to: '/team-matching', label: 'Teammates', icon: Users },
    { to: '/profile', label: 'Profile', icon: User }
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[var(--bg-surface)]/95 backdrop-blur-md border-t border-[var(--border-subtle)] px-2 py-1 pb-safe transition-colors duration-200"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-colors ${
                  isActive ? 'text-indigo-400 font-medium' : 'text-[var(--text-dim)] hover:text-[var(--text-main)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 mb-1 ${isActive ? 'text-indigo-400' : 'text-[var(--text-dim)]'}`} />
                  <span className="text-[10px] tracking-tight">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
