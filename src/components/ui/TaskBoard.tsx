import React from 'react';
import { Plus, Trash2, Calendar, User, ChevronRight, ChevronLeft } from 'lucide-react';
import { Avatar } from './Avatar';
import { Button } from './Button';

export interface TaskData {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'in_review' | 'done';
  assigneeName?: string;
  assigneeAvatar?: string;
  dueDate?: string;
}

export interface TaskBoardProps {
  tasks: TaskData[];
  onMoveTask?: (taskId: string, newStatus: TaskData['status']) => void;
  onDeleteTask?: (taskId: string) => void;
  onAddTask?: () => void;
  className?: string;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  onMoveTask,
  onDeleteTask,
  onAddTask,
  className = ''
}) => {
  const columns: { id: TaskData['status']; label: string }[] = [
    { id: 'todo', label: 'TODO' },
    { id: 'in_progress', label: 'IN PROGRESS' },
    { id: 'in_review', label: 'REVIEW' },
    { id: 'done', label: 'DONE' }
  ];

  const getNextStatus = (current: TaskData['status']): TaskData['status'] | null => {
    if (current === 'todo') return 'in_progress';
    if (current === 'in_progress') return 'in_review';
    if (current === 'in_review') return 'done';
    return null;
  };

  const getPrevStatus = (current: TaskData['status']): TaskData['status'] | null => {
    if (current === 'done') return 'in_review';
    if (current === 'in_review') return 'in_progress';
    if (current === 'in_progress') return 'todo';
    return null;
  };

  return (
    <div className={`space-y-6 w-full ${className}`}>
      {/* Top action row */}
      {onAddTask && (
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono text-[var(--text-muted)]">
            <span className="font-bold text-white font-mono">{tasks.length}</span> sprint tasks
          </div>
          <Button
            onClick={onAddTask}
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
          >
            New Task
          </Button>
        </div>
      )}

      {/* Modern 4-Column Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);

          return (
            <div key={col.id} className="space-y-3.5">
              {/* Column Header */}
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-dim)]">
                  {col.label}
                </span>
                <span className="text-[11px] font-mono font-semibold text-zinc-400 bg-white/[0.05] px-2.5 py-0.5 rounded-full">
                  {colTasks.length}
                </span>
              </div>

              {/* Task Items */}
              <div className="space-y-3 min-h-[260px]">
                {colTasks.map((t) => {
                  const next = getNextStatus(t.status);
                  const prev = getPrevStatus(t.status);

                  return (
                    <div
                      key={t.id}
                      className="p-4 sm:p-5 rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] hover:bg-[#141824] hover:border-indigo-500/35 transition-all space-y-3.5 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-white leading-snug">
                          {t.title}
                        </h4>
                        {onDeleteTask && (
                          <button
                            onClick={() => onDeleteTask(t.id)}
                            className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-rose-400 transition-opacity p-1 cursor-pointer"
                            title="Delete Task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Clean metadata: Assignee & Due Date */}
                      <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-1">
                        <div className="flex items-center gap-2">
                          <Avatar name={t.assigneeName || 'User'} src={t.assigneeAvatar} size="xs" />
                          <span className="text-[11px] truncate max-w-[100px]">
                            {t.assigneeName || 'Unassigned'}
                          </span>
                        </div>

                        {t.dueDate && (
                          <span className="text-[11px] font-mono text-indigo-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-zinc-500" />
                            {t.dueDate}
                          </span>
                        )}
                      </div>

                      {/* Step controls */}
                      {(prev || next) && onMoveTask && (
                        <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-[11px]">
                          {prev ? (
                            <button
                              onClick={() => onMoveTask(t.id, prev)}
                              className="text-zinc-500 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                              <span>Back</span>
                            </button>
                          ) : (
                            <span />
                          )}

                          {next && (
                            <button
                              onClick={() => onMoveTask(t.id, next)}
                              className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <span>Next</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
