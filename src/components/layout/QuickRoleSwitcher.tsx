import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { UserRole } from '../../types';
import { Sparkles, ChevronDown, Check, GraduationCap, BookOpen, ShieldCheck } from 'lucide-react';

export const QuickRoleSwitcher: React.FC = () => {
  const { user, demoLogin, loading } = useAuth();
  const toast = useToast();
  const [open, setOpen] = useState(false);

  const roles: { role: UserRole; name: string; title: string; icon: React.ReactNode }[] = [
    {
      role: 'student',
      name: 'Aarav Sharma',
      title: 'Student (Team Lead)',
      icon: <GraduationCap className="w-4 h-4 text-indigo-400" />
    },
    {
      role: 'faculty',
      name: 'Dr. Elena Vance',
      title: 'Faculty (Capstone Mentor)',
      icon: <BookOpen className="w-4 h-4 text-purple-400" />
    },
    {
      role: 'admin',
      name: 'Prof. Marcus Reed',
      title: 'Admin (Dean of Computing)',
      icon: <ShieldCheck className="w-4 h-4 text-rose-400" />
    }
  ];

  const handleSwitch = async (role: UserRole) => {
    try {
      setOpen(false);
      await demoLogin(role);
      toast.success(`Switched role to ${role.toUpperCase()}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to switch demo role');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-xs font-semibold text-indigo-300 transition-all duration-200 cursor-pointer shadow-sm"
        title="Quick Role Demo Switcher"
      >
        <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
        <span className="hidden sm:inline">Demo Switcher:</span>
        <span className="capitalize text-white font-bold">{user?.role || 'Guest'}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-white/50 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/15 bg-[#0e1224] p-2 shadow-2xl z-50 backdrop-blur-xl">
            <div className="px-2.5 py-1.5 border-b border-white/10 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">Switch Persona (Demo)</span>
            </div>
            {roles.map((item) => {
              const isCurrent = user?.role === item.role;
              return (
                <button
                  key={item.role}
                  onClick={() => handleSwitch(item.role)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                    isCurrent ? 'bg-indigo-600/20 border border-indigo-500/40 text-white' : 'hover:bg-white/5 text-white/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-white/5">{item.icon}</div>
                    <div>
                      <div className="text-xs font-bold leading-none text-white">{item.name}</div>
                      <div className="text-[11px] text-white/50 mt-0.5">{item.title}</div>
                    </div>
                  </div>
                  {isCurrent && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
