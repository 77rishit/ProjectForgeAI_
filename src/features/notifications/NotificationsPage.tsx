import React, { useState } from 'react';
import {
  Bell,
  Sparkles,
  Users,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FolderGit2,
  Filter,
  Check
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';

interface NotificationItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  message: string;
  time: string;
  read: boolean;
  group: 'today' | 'yesterday' | 'earlier';
}

export const NotificationsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      icon: <Sparkles className="w-4 h-4 text-indigo-400" />,
      title: 'AI Recommendation Ready',
      message: 'New project idea "Smart Campus Assistant" matches 94% of your verified skills.',
      time: '2 hours ago',
      read: false,
      group: 'today'
    },
    {
      id: 'n2',
      icon: <Users className="w-4 h-4 text-emerald-400" />,
      title: 'Teammate Invitation Received',
      message: 'Priya Sharma invited you to join the backend engineering team for "ProjectForge AI".',
      time: '5 hours ago',
      read: false,
      group: 'today'
    },
    {
      id: 'n3',
      icon: <ShieldCheck className="w-4 h-4 text-amber-400" />,
      title: 'Milestone Rubric Approved',
      message: 'Dr. Elena Vance approved Milestone 2 deliverables with a rubric score of 9.2/10.',
      time: 'Yesterday at 4:15 PM',
      read: true,
      group: 'yesterday'
    },
    {
      id: 'n4',
      icon: <FolderGit2 className="w-4 h-4 text-indigo-400" />,
      title: 'Sprint 3 Initialized',
      message: 'Sprint 3 tasks and architecture blueprint checkpoints have been published.',
      time: 'Yesterday at 11:00 AM',
      read: true,
      group: 'yesterday'
    },
    {
      id: 'n5',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      title: 'Task Completed',
      message: 'Rohan marked "Setup JWT authentication & guards" as Done.',
      time: 'Sep 22, 2026',
      read: true,
      group: 'earlier'
    }
  ]);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const filtered = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  const todayList = filtered.filter((n) => n.group === 'today');
  const yesterdayList = filtered.filter((n) => n.group === 'yesterday');
  const earlierList = filtered.filter((n) => n.group === 'earlier');

  const renderSection = (title: string, list: NotificationItem[]) => {
    if (list.length === 0) return null;
    return (
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-dim)] px-1">
          {title}
        </div>
        <div className="space-y-2">
          {list.map((item) => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                !item.read
                  ? 'border-indigo-500/25 bg-[#141725] hover:border-indigo-500/40'
                  : 'border-[var(--border-subtle)] bg-[#10131F] hover:bg-[#141725] hover:border-white/10'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#0B0D16] border border-[var(--border-subtle)] flex items-center justify-center shrink-0">
                {item.icon}
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-white">{item.title}</h4>
                  <span className="text-[11px] font-mono text-[var(--text-dim)] shrink-0">{item.time}</span>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{item.message}</p>
              </div>

              {!item.read && (
                <span className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0 ring-4 ring-indigo-500/20" />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto w-full">
      {/* 1. HEADER */}
      <PageHeader
        title="Notification Center"
        subtitle="Real-time milestone evaluations, teammate invitations, and automated AI updates."
        actions={
          <div className="flex items-center gap-2.5">
            <div className="inline-flex items-center p-1 rounded-xl bg-[#10131F] border border-[var(--border-subtle)] text-xs">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  filter === 'all' ? 'bg-indigo-600 text-white font-semibold' : 'text-[var(--text-muted)] hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  filter === 'unread' ? 'bg-indigo-600 text-white font-semibold' : 'text-[var(--text-muted)] hover:text-white'
                }`}
              >
                Unread
              </button>
            </div>

            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[#10131F] hover:bg-white/5 text-xs text-[var(--text-muted)] hover:text-white font-medium transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          </div>
        }
      />

      {/* 2. GROUPED LISTS: TODAY, YESTERDAY, EARLIER */}
      <div className="space-y-8">
        {renderSection('Today', todayList)}
        {renderSection('Yesterday', yesterdayList)}
        {renderSection('Earlier', earlierList)}

        {filtered.length === 0 && (
          <div className="p-12 text-center rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] space-y-2">
            <Bell className="w-8 h-8 text-zinc-500 mx-auto" />
            <h3 className="text-sm font-semibold text-white">All caught up</h3>
            <p className="text-xs text-[var(--text-muted)]">No unread notifications at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
};
