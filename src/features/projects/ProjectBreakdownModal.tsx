import React, { useState } from 'react';
import { Project, Milestone, Task } from '../../types';
import { aiService, ProjectBreakdownMilestone } from '../../services/aiService';
import { milestoneService } from '../../services/milestoneService';
import { taskService } from '../../services/taskService';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { Sparkles, CheckSquare, Square, Calendar, Plus, AlertCircle, Clock } from 'lucide-react';

interface ProjectBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onPlanSaved: () => void;
}

export const ProjectBreakdownModal: React.FC<ProjectBreakdownModalProps> = ({
  isOpen,
  onClose,
  project,
  onPlanSaved
}) => {
  const toast = useToast();
  const [duration, setDuration] = useState('8-10 weeks');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generated plan state
  const [milestones, setMilestones] = useState<
    (ProjectBreakdownMilestone & { selected: boolean; targetDays: number })[]
  >([]);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await aiService.breakDownProject({
        title: project.title,
        description: project.description || project.abstract || 'University software engineering project.',
        technologies: project.technologies || project.tags || [],
        duration
      });

      if (!res.milestones || res.milestones.length === 0) {
        throw new Error('No milestones returned from breakdown service.');
      }

      let cumulativeDays = 14;
      const formatted = res.milestones.map((m) => {
        cumulativeDays += 14;
        return {
          ...m,
          selected: true,
          targetDays: cumulativeDays,
          tasks: (m.tasks || []).map((t) => ({ ...t, selected: true }))
        };
      });

      setMilestones(formatted);
      toast.success(`Generated ${formatted.length} milestone phases! Review and customize below.`);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'AI unavailable right now. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const toggleMilestone = (index: number) => {
    setMilestones((prev) =>
      prev.map((m, i) => (i === index ? { ...m, selected: !m.selected } : m))
    );
  };

  const toggleTask = (mIndex: number, tIndex: number) => {
    setMilestones((prev) =>
      prev.map((m, i) => {
        if (i !== mIndex) return m;
        const newTasks = m.tasks.map((t: any, j: number) =>
          j === tIndex ? { ...t, selected: !t.selected } : t
        );
        return { ...m, tasks: newTasks };
      })
    );
  };

  const handleSaveToProject = async () => {
    const selectedMilestones = milestones.filter((m) => m.selected);
    if (selectedMilestones.length === 0) {
      toast.error('Select at least one milestone to save.');
      return;
    }

    setSaving(true);
    try {
      let savedMilestoneCount = 0;
      let savedTaskCount = 0;

      for (let i = 0; i < selectedMilestones.length; i++) {
        const m = selectedMilestones[i];
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + m.targetDays);

        const createdMilestone = await milestoneService.createMilestone({
          projectId: project._id,
          title: m.title,
          description: m.description,
          order: i + 1,
          targetDate: targetDate.toISOString(),
          deliverables: m.tasks.map((t) => ({ title: t.title, completed: false }))
        });
        savedMilestoneCount++;

        // Create tasks under this milestone
        const selectedTasks = (m.tasks as any[]).filter((t) => t.selected !== false);
        for (const t of selectedTasks) {
          const taskDueDate = new Date();
          taskDueDate.setDate(taskDueDate.getDate() + (t.estimatedDays || 3));

          await taskService.createTask({
            projectId: project._id,
            title: t.title,
            description: `Auto-generated from milestone phase: ${m.title}`,
            milestoneId: createdMilestone._id,
            dueDate: taskDueDate.toISOString(),
            priority: 'medium'
          });
          savedTaskCount++;
        }
      }

      toast.success(`Successfully saved ${savedMilestoneCount} milestones and ${savedTaskCount} sprint tasks to your project!`);
      onPlanSaved();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save milestones to project.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <span>AI Project Plan Breakdown Studio</span>
        </div>
      }
      description={`Deconstruct "${project.title}" into sequential milestone phases and sprint tasks.`}
    >
      <div className="space-y-6">
        {/* Error banner */}
        {error && (
          <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/10 flex items-center gap-2 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Breakdown Config Form */}
        <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[#10131F] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-white">Target Project Timeline</div>
            <p className="text-xs text-[var(--text-muted)]">
              Specify overall semester timeframe for estimated day distributions.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] bg-[#0B0D16] text-xs text-white outline-none focus:border-indigo-500"
            >
              <option value="4-6 weeks">4-6 weeks (Sprint Capstone)</option>
              <option value="8-10 weeks">8-10 weeks (Standard Semester)</option>
              <option value="12-16 weeks">12-16 weeks (Full Academic Year)</option>
            </select>

            <Button
              onClick={handleGenerate}
              variant="primary"
              size="md"
              loading={loading}
              disabled={loading}
              icon={<Sparkles className="w-3.5 h-3.5" />}
            >
              {loading ? '✦ Thinking...' : 'Generate Plan'}
            </Button>
          </div>
        </div>

        {/* Thinking Indicator */}
        {loading && (
          <div className="p-8 text-center space-y-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 animate-pulse">
            <div className="text-sm font-semibold text-indigo-400 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-indigo-400" />
              <span>✦ Thinking... ProjectForge AI is deconstructing your project roadmap</span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Analyzing dependencies, sprint sizing, and chronological milestone stages...
            </p>
          </div>
        )}

        {/* Review & Customization Stream */}
        {!loading && milestones.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2 text-xs">
              <span className="font-semibold text-white">Review Generated Plan</span>
              <span className="text-[var(--text-dim)]">Uncheck any items you don't wish to add to MongoDB</span>
            </div>

            <div className="max-h-[380px] overflow-y-auto space-y-4 pr-1">
              {milestones.map((m, mIdx) => (
                <div
                  key={mIdx}
                  className={`p-4 rounded-xl border transition-all ${
                    m.selected
                      ? 'border-indigo-500/30 bg-[#121626]'
                      : 'border-white/5 bg-white/[0.02] opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleMilestone(mIdx)}
                        className="text-indigo-400 hover:text-indigo-300 cursor-pointer"
                      >
                        {m.selected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                      </button>
                      <div>
                        <div className="text-sm font-bold text-white">
                          Phase 0{mIdx + 1}: {m.title}
                        </div>
                        <p className="text-xs text-[var(--text-muted)]">{m.description}</p>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full shrink-0">
                      Day +{m.targetDays}
                    </span>
                  </div>

                  {/* Tasks nested */}
                  <div className="mt-3 pl-8 space-y-2">
                    <div className="text-[11px] font-mono text-[var(--text-dim)] uppercase">Actionable Tasks:</div>
                    {m.tasks.map((t: any, tIdx: number) => (
                      <div
                        key={tIdx}
                        className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-slate-300"
                      >
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleTask(mIdx, tIdx)}
                            className="text-indigo-400 hover:text-indigo-300 cursor-pointer"
                          >
                            {t.selected !== false ? (
                              <CheckSquare className="w-4 h-4" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                          <span>{t.title}</span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {t.estimatedDays || 2}d
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
              <span className="text-xs text-[var(--text-muted)]">
                Selected milestones will be created in your database.
              </span>
              <div className="flex gap-2">
                <Button onClick={onClose} variant="ghost" size="md">
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveToProject}
                  variant="primary"
                  size="md"
                  loading={saving}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Save Plan to Project
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
