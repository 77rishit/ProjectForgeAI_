import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { taskService } from '../../services/taskService';
import { Task, Project, Milestone, TaskStatus, TaskPriority } from '../../types';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import {
  Plus,
  Clock,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Calendar
} from 'lucide-react';
import { formatTaskDue } from '../../utils/formatters';

interface KanbanBoardProps {
  project: Project;
  tasks: Task[];
  milestones: Milestone[];
  onTasksUpdated: () => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  project,
  tasks,
  milestones,
  onTasksUpdated
}) => {
  const { user } = useAuth();
  const toast = useToast();

  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium');
  const [taskAssignee, setTaskAssignee] = useState<string>('');
  const [taskMilestone, setTaskMilestone] = useState<string>('');
  const [taskDueDate, setTaskDueDate] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const columns: { id: TaskStatus; label: string; count: number }[] = [
    { id: 'todo', label: 'TODO', count: tasks.filter((t) => t.status === 'todo').length },
    { id: 'in_progress', label: 'IN PROGRESS', count: tasks.filter((t) => t.status === 'in_progress').length },
    { id: 'in_review', label: 'REVIEW', count: tasks.filter((t) => t.status === 'in_review').length },
    { id: 'done', label: 'DONE', count: tasks.filter((t) => t.status === 'done').length }
  ];

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) {
      toast.error('Task title is required.');
      return;
    }

    setLoading(true);
    try {
      await taskService.createTask({
        projectId: project._id,
        title: taskTitle,
        description: taskDesc,
        priority: taskPriority,
        assignee: taskAssignee || undefined,
        milestoneId: taskMilestone || undefined,
        dueDate: taskDueDate || undefined,
        tags: []
      });

      toast.success('Task created');
      setIsNewTaskOpen(false);
      setTaskTitle('');
      setTaskDesc('');
      onTasksUpdated();
    } catch (err: any) {
      toast.error(err.message || 'Error creating task');
    } finally {
      setLoading(false);
    }
  };

  const handleMoveTask = async (task: Task, newStatus: TaskStatus) => {
    try {
      await taskService.updateTask(task._id, { status: newStatus });
      onTasksUpdated();
    } catch (err: any) {
      toast.error(err.message || 'Error moving task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      toast.info('Task deleted');
      onTasksUpdated();
    } catch (err: any) {
      toast.error(err.message || 'Error deleting task');
    }
  };

  const getNextStatus = (current: TaskStatus): TaskStatus | null => {
    if (current === 'todo') return 'in_progress';
    if (current === 'in_progress') return 'in_review';
    if (current === 'in_review') return 'done';
    return null;
  };

  const getPrevStatus = (current: TaskStatus): TaskStatus | null => {
    if (current === 'done') return 'in_review';
    if (current === 'in_review') return 'in_progress';
    if (current === 'in_progress') return 'todo';
    return null;
  };

  return (
    <div className="space-y-6 w-full">
      {/* Board Header & Add Action */}
      <div className="flex items-center justify-between">
        <div className="text-xs font-mono text-[var(--text-muted)]">
          <span className="font-bold text-white font-mono">{tasks.length}</span> sprint tasks
        </div>

        <button
          onClick={() => setIsNewTaskOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm shadow-indigo-600/25 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* 4-COLUMN KANBAN BOARD */}
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
                <span className="text-[11px] font-mono font-semibold text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full">
                  {colTasks.length}
                </span>
              </div>

              {/* Column Task Cards */}
              <div className="space-y-3 min-h-[220px]">
                {colTasks.map((task) => {
                  const next = getNextStatus(task.status);
                  const prev = getPrevStatus(task.status);

                  return (
                    <div
                      key={task._id}
                      className="p-4 sm:p-5 rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] hover:bg-[#141725] hover:border-indigo-500/35 transition-all space-y-3 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-white leading-snug">
                          {task.title}
                        </h4>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-rose-400 transition-opacity p-1"
                          title="Delete Task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Compact readable metadata: Assignee & Due Date */}
                      <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-1">
                        <div className="flex items-center gap-2">
                          <Avatar
                            name={task.assignee?.name || 'User'}
                            src={task.assignee?.profileImage || task.assignee?.avatar}
                            size="xs"
                          />
                          <span className="text-[11px] truncate max-w-[90px]">
                            {task.assignee?.name || 'Unassigned'}
                          </span>
                        </div>

                        {task.dueDate && (
                          <span className="text-[11px] font-mono text-indigo-400">
                            Due {formatTaskDue(task.dueDate)}
                          </span>
                        )}
                      </div>

                      {/* Directional Move buttons */}
                      <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-[11px]">
                        {prev ? (
                          <button
                            onClick={() => handleMoveTask(task, prev)}
                            className="text-zinc-500 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <ArrowLeft className="w-3 h-3" />
                            <span>Move back</span>
                          </button>
                        ) : <span />}

                        {next && (
                          <button
                            onClick={() => handleMoveTask(task, next)}
                            className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold transition-colors cursor-pointer ml-auto"
                          >
                            <span>Advance</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {colTasks.length === 0 && (
                  <div className="h-28 rounded-2xl border border-dashed border-[var(--border-subtle)] flex items-center justify-center text-xs text-zinc-600 font-mono">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Task Modal */}
      {isNewTaskOpen && (
        <Modal
          isOpen={isNewTaskOpen}
          onClose={() => setIsNewTaskOpen(false)}
          title="Create Sprint Task"
        >
          <form onSubmit={handleCreateTask} className="space-y-4 pt-2">
            <Input
              label="Task Title"
              placeholder="Finish authentication & guards"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              required
            />

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-muted)]">Description (optional)</label>
              <textarea
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
                placeholder="Details, acceptance criteria..."
                rows={3}
                className="w-full p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] text-xs sm:text-sm text-[var(--text-main)] placeholder:text-[var(--text-dim)] outline-none focus:border-indigo-500/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-muted)]">Priority</label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value as any)}
                  className="w-full h-11 px-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] text-xs sm:text-sm text-[var(--text-main)] outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-muted)]">Assignee</label>
                <select
                  value={taskAssignee}
                  onChange={(e) => setTaskAssignee(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] text-xs sm:text-sm text-[var(--text-main)] outline-none"
                >
                  <option value="">Unassigned</option>
                  {(project.members || []).map((m: any) => (
                    <option key={m.user?._id || m.user?.id} value={m.user?._id || m.user?.id}>
                      {m.user?.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Input
              type="date"
              label="Due Date"
              value={taskDueDate}
              onChange={(e) => setTaskDueDate(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
              <Button type="button" variant="ghost" onClick={() => setIsNewTaskOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={loading}>
                Create Task
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
