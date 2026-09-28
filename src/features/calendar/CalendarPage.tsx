import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Users,
  Video,
  Bookmark,
  Trash2,
  X
} from 'lucide-react';
import { projectService } from '../../services/projectService';
import { taskService } from '../../services/taskService';
import { calendarService } from '../../services/calendarService';
import { Project, Task, CalendarEvent, CalendarEventType } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { formatTaskDue } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export const CalendarPage: React.FC = () => {
  const toast = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // New Event Modal State
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState('10:00 AM');
  const [newLocation, setNewLocation] = useState('Zoom / Lab 304');
  const [newType, setNewType] = useState<CalendarEventType>('meeting');
  const [newDescription, setNewDescription] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [projs, myTasks, myEvents] = await Promise.all([
        projectService.getMyProjects().catch(() => []),
        taskService.getMyTasks().catch(() => []),
        calendarService.getEvents().catch(() => [])
      ]);
      setProjects(projs);
      setTasks(myTasks);
      setEvents(myEvents);
    } catch (err) {
      console.error('Failed to load calendar data:', err);
      toast.error('Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Generate calendar days
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error('Event title is required');
      return;
    }

    try {
      setCreating(true);
      const created = await calendarService.createEvent({
        title: newTitle.trim(),
        date: newDate,
        time: newTime.trim() || 'All Day',
        location: newLocation.trim() || 'Online',
        type: newType,
        description: newDescription.trim()
      });

      setEvents((prev) => [created, ...prev]);
      setShowModal(false);
      setNewTitle('');
      setNewDescription('');
      toast.success('Event scheduled successfully');
    } catch (err) {
      console.error('Failed to create event:', err);
      toast.error('Failed to create event. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteEvent = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await calendarService.deleteEvent(id);
      setEvents((prev) => prev.filter((ev) => ev._id !== id));
      toast.success('Event deleted');
    } catch (err) {
      toast.error('Failed to delete event');
    }
  };

  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());

  const formatEventDate = (dateVal: string | Date | undefined) => {
    if (!dateVal) return '';
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return String(dateVal);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getBadgeStyles = (type: string) => {
    switch (type) {
      case 'faculty':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'team':
        return 'bg-sky-500/15 text-sky-300 border-sky-500/30';
      case 'checkpoint':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'deadline':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      case 'defense':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
    }
  };

  const selectedDayTasks = tasks.filter((t) => {
    if (!t.dueDate || selectedDay === null) return false;
    const d = new Date(t.dueDate);
    return d.getFullYear() === year && d.getMonth() === month && d.getDate() === selectedDay;
  });

  const selectedDayEvents = events.filter((ev) => {
    if (!ev.date || selectedDay === null) return false;
    const d = new Date(ev.date);
    return d.getFullYear() === year && d.getMonth() === month && d.getDate() === selectedDay;
  });

  return (
    <div className="space-y-8 w-full">
      {/* 1. EDITORIAL HEADER */}
      <PageHeader
        title="Calendar & Deadlines"
        subtitle="Coordinate capstone milestone deliverables, team syncs, and faculty checkpoints across the semester."
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const sDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay || 1).padStart(2, '0')}`;
                setNewDate(sDate);
                setShowModal(true);
              }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule Event</span>
            </button>
            <div className="inline-flex items-center gap-2 p-1 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs font-semibold">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg hover:bg-white/5 text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-mono text-[var(--text-main)]">
                {monthNames[month]} {year}
              </span>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg hover:bg-white/5 text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        }
      />

      {/* 2. 2-COLUMN PRODUCTIVITY COMPOSITION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT: Large Calendar Area (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-dim)] pb-2 border-b border-[var(--border-subtle)]">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {calendarDays.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="h-20 sm:h-24 rounded-xl bg-transparent" />;
              }

              const isToday =
                day === new Date().getDate() &&
                month === new Date().getMonth() &&
                year === new Date().getFullYear();

              const isSelected = day === selectedDay;

              // Distinct indicators based on user database data
              const dayTasks = tasks.filter((t) => {
                if (!t.dueDate) return false;
                const d = new Date(t.dueDate);
                return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
              });

              const dayEvents = events.filter((ev) => {
                if (!ev.date) return false;
                const d = new Date(ev.date);
                return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
              });

              return (
                <div
                  key={`day-${day}`}
                  onClick={() => {
                    setSelectedDay(day);
                    const sDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    setNewDate(sDate);
                  }}
                  className={`h-20 sm:h-24 p-2 rounded-xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'border-indigo-400 bg-indigo-500/15 shadow-md shadow-indigo-500/20 ring-2 ring-indigo-500/30'
                      : isToday
                      ? 'border-indigo-500/70 bg-indigo-500/10 font-bold'
                      : 'border-[var(--border-subtle)] bg-[#0B0D16] hover:border-white/20 hover:bg-[#141725]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={
                        isSelected
                          ? 'text-white font-mono font-bold'
                          : isToday
                          ? 'text-indigo-400 font-mono font-bold'
                          : 'text-[var(--text-main)] font-mono'
                      }
                    >
                      {day}
                    </span>
                    {isToday && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 ring-2 ring-indigo-500/30" />
                    )}
                  </div>

                  <div className="space-y-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map((ev) => {
                      const badgeStyle = getBadgeStyles(ev.type);
                      return (
                        <div
                          key={ev._id}
                          className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded font-medium border truncate ${badgeStyle}`}
                          title={`${ev.title} (${ev.time || ''})`}
                        >
                          {ev.title}
                        </div>
                      );
                    })}
                    {dayTasks.slice(0, Math.max(0, 2 - dayEvents.length)).map((t) => (
                      <div
                        key={t._id}
                        className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded font-medium border bg-amber-500/15 text-amber-300 border-amber-500/30 truncate"
                        title={`Due: ${t.title}`}
                      >
                        Due: {t.title}
                      </div>
                    ))}
                    {dayEvents.length + dayTasks.length > 2 && (
                      <div className="text-[9px] text-[var(--text-dim)] font-mono font-bold">
                        +{dayEvents.length + dayTasks.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Daily Agenda Spotlight + Upcoming Deadlines & Events (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* 1. SELECTED DAY AGENDA SPOTLIGHT */}
          <div className="rounded-2xl border border-indigo-500/30 bg-[#121526] p-5 space-y-3.5 shadow-lg shadow-indigo-950/20">
            <div className="flex items-center justify-between pb-2 border-b border-indigo-500/20">
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-300 font-mono flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span>
                  {monthNames[month]} {selectedDay} Agenda
                </span>
              </div>
              <button
                onClick={() => {
                  const sDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
                  setNewDate(sDate);
                  setShowModal(true);
                }}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-white hover:text-indigo-300 bg-indigo-600/30 hover:bg-indigo-600/50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Event</span>
              </button>
            </div>

            {selectedDayEvents.length === 0 && selectedDayTasks.length === 0 ? (
              <div className="text-xs text-[var(--text-muted)] py-3 text-center">
                No events or deadlines on {monthNames[month]} {selectedDay}.
                <div className="text-[11px] text-[var(--text-dim)] mt-1">
                  Click another day on the calendar or "Add Event" above.
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {selectedDayEvents.map((ev) => (
                  <div key={ev._id} className="p-3 rounded-xl bg-[#0B0D16] border border-[var(--border-subtle)] space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white truncate">{ev.title}</span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase font-bold shrink-0 ${getBadgeStyles(
                          ev.type
                        )}`}
                      >
                        {ev.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] font-mono text-[var(--text-muted)]">
                      <span className="flex items-center gap-1 text-indigo-400 font-semibold">
                        <Clock className="w-3 h-3" />
                        {ev.time}
                      </span>
                      {ev.location && <span className="truncate">📍 {ev.location}</span>}
                    </div>
                    {ev.description && (
                      <p className="text-[11px] text-[var(--text-dim)] pt-0.5 leading-relaxed">{ev.description}</p>
                    )}
                  </div>
                ))}
                {selectedDayTasks.map((t) => (
                  <div key={t._id} className="p-3 rounded-xl bg-[#0B0D16] border border-amber-500/20 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-amber-200 truncate">Due: {t.title}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold uppercase">
                        TASK DUE
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-[var(--text-muted)]">
                      Status: {t.status.toUpperCase()} · Priority: {t.priority?.toUpperCase() || 'NORMAL'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. UPCOMING DEADLINES */}
          <div className="space-y-3.5">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-dim)] flex items-center justify-between">
              <span>ACTIVE TASK DEADLINES</span>
              <span className="font-mono text-indigo-400">{tasks.length} active</span>
            </div>

            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] p-5 space-y-4">
              {tasks.length > 0 ? (
                tasks.slice(0, 4).map((t) => (
                  <div key={t._id} className="flex items-start gap-3 pb-3 border-b border-[var(--border-subtle)] last:border-0 last:pb-0">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-white truncate">{t.title}</div>
                      <div className="text-[11px] text-[var(--text-muted)] font-mono mt-0.5">
                        Due {formatTaskDue(t.dueDate)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-[var(--text-muted)] text-center py-2">
                  No upcoming deadlines pending.
                </div>
              )}
            </div>
          </div>

          {/* 3. SCHEDULED EVENTS & SESSIONS (Formatted Dates, Distinct Badges) */}
          <div className="space-y-3.5">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-dim)] flex items-center justify-between">
              <span>SCHEDULED SESSIONS & CHECKPOINTS</span>
              <span className="font-mono text-indigo-400">{events.length}</span>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {events.length > 0 ? (
                events.map((ev) => (
                  <div
                    key={ev._id}
                    onClick={() => {
                      if (ev.date) {
                        const d = new Date(ev.date);
                        setSelectedDay(d.getDate());
                      }
                    }}
                    className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] hover:border-indigo-500/30 transition-all space-y-2 group cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-semibold text-white truncate flex-1">{ev.title}</h4>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold border ${getBadgeStyles(
                            ev.type
                          )}`}
                        >
                          {ev.type}
                        </span>
                        <button
                          onClick={(e) => handleDeleteEvent(ev._id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 text-[var(--text-muted)] transition-opacity cursor-pointer"
                          title="Delete event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--text-muted)]">
                      <Clock className="w-3 h-3 text-[var(--text-dim)]" />
                      <span>
                        {formatEventDate(ev.date)} • {ev.time}
                      </span>
                    </div>

                    {ev.location && (
                      <div className="text-[11px] text-[var(--text-dim)] truncate">
                        📍 {ev.location}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] text-center text-xs text-[var(--text-muted)]">
                  No scheduled events. Click "Schedule Event" above to create one.
                </div>
              )}
            </div>
          </div>

          {/* Quick Notice */}
          <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] space-y-3">
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-indigo-400" />
              <span>Sprint Notice</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Sprint deliverables and faculty reviews synchronize automatically with your capstone milestones. All schedules are saved securely in your database.
            </p>
          </div>
        </div>
      </div>

      {/* SCHEDULE EVENT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="text-sm font-bold text-white">Schedule New Event / Sync</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Faculty Checkpoint with Advisor"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0D16] border border-[var(--border-subtle)] text-xs text-white placeholder-[var(--text-dim)] focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0D16] border border-[var(--border-subtle)] text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 3:30 PM"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0D16] border border-[var(--border-subtle)] text-xs text-white placeholder-[var(--text-dim)] focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                    Location / Link
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Zoom / Room 4B"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0D16] border border-[var(--border-subtle)] text-xs text-white placeholder-[var(--text-dim)] focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                    Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0D16] border border-[var(--border-subtle)] text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="meeting">Team Meeting</option>
                    <option value="checkpoint">Faculty Checkpoint</option>
                    <option value="deadline">Sprint Deadline</option>
                    <option value="other">General Sync</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                  Description / Agenda
                </label>
                <textarea
                  rows={2}
                  placeholder="Notes, agenda or preparation materials..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0D16] border border-[var(--border-subtle)] text-xs text-white placeholder-[var(--text-dim)] focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[var(--text-muted)] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {creating ? 'Saving...' : 'Save to Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
