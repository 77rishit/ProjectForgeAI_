import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Bot, User as UserIcon, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { aiService, AIChatMessage } from '../../services/aiService';
import { Project, Task, Milestone } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface ProjectAIAssistantProps {
  project: Project;
  tasks: Task[];
  milestones: Milestone[];
}

export const ProjectAIAssistant: React.FC<ProjectAIAssistantProps> = ({
  project,
  tasks,
  milestones
}) => {
  const { user } = useAuth();
  const toast = useToast();
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load persisted chat history
  useEffect(() => {
    async function loadHistory() {
      if (!project._id) return;
      try {
        const history = await aiService.getChatHistory(project._id);
        if (history && history.length > 0) {
          setMessages(history);
        } else {
          // Default welcoming seed
          setMessages([
            {
              role: 'assistant',
              content: `Hello ${user?.name?.split(' ')[0] || 'there'}! I am your ProjectForge AI Copilot for "${project.title}". I have full context of your ${tasks.length} sprint tasks, ${milestones.length} milestones, and tech stack (${project.technologies?.join(', ') || 'configured'}). Ask me anything—from architectural recommendations to "What should I work on next?"`
            }
          ]);
        }
      } catch (err) {
        console.warn('Could not load chat history:', err);
      } finally {
        setInitialLoading(false);
      }
    }
    loadHistory();
  }, [project._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    setInput('');
    setError(null);

    // Optimistically append user message
    const userMsg: AIChatMessage = { role: 'user', content: query, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await aiService.chat(query, {
        projectId: project._id,
        projectTitle: project.title,
        description: project.description || project.abstract,
        technologies: project.technologies || project.tags,
        progress: project.progress,
        tasks: tasks.map((t) => ({ title: t.title, status: t.status, priority: t.priority })),
        milestones: milestones.map((m) => ({ title: m.title, status: m.status, targetDate: m.targetDate ? String(m.targetDate) : undefined }))
      });

      if (res.success && res.message) {
        const assistantMsg: AIChatMessage = {
          role: 'assistant',
          content: res.message,
          createdAt: new Date().toISOString()
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error(res.message || 'AI unavailable right now. Please try again.');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'AI unavailable right now. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'What should I work on next?',
    'Review our upcoming milestone deadlines',
    'How do we structure our backend API?',
    'Identify potential sprint bottlenecks'
  ];

  return (
    <div className="flex flex-col h-[650px] rounded-2xl border border-[var(--border-subtle)] bg-[#0B0E19] overflow-hidden">
      {/* Top Header */}
      <div className="px-6 py-4 border-b border-[var(--border-subtle)] bg-[#101322] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>ProjectForge AI Copilot</span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Connected
              </span>
            </h3>
            <p className="text-xs text-[var(--text-muted)] truncate max-w-sm">
              Context: {project.title} ({project.progress}% completed)
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[var(--text-dim)]">
          <span>Backend OpenAI Service</span>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {initialLoading ? (
          <div className="py-20 text-center text-xs font-mono text-zinc-500 animate-pulse">
            Loading project assistant memory...
          </div>
        ) : (
          messages.map((m, idx) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={idx}
                className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse text-right' : 'mr-auto text-left'}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${
                    isUser
                      ? 'bg-indigo-600 text-white'
                      : 'bg-[#151929] border border-[var(--border-subtle)] text-indigo-400'
                  }`}
                >
                  {isUser ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-[#121626] border border-[var(--border-subtle)] text-slate-200 rounded-tl-none shadow-sm'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            );
          })
        )}

        {/* Thinking Indicator */}
        {loading && (
          <div className="flex gap-3 max-w-[85%] mr-auto text-left animate-pulse">
            <div className="w-8 h-8 rounded-xl shrink-0 bg-[#151929] border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4 animate-spin text-indigo-400" />
            </div>
            <div className="p-3.5 rounded-2xl bg-[#121626] border border-indigo-500/30 text-indigo-300 text-xs font-mono flex items-center gap-2">
              <span>✦ Thinking... ProjectForge AI is evaluating your project workspace</span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-6 py-2 border-t border-[var(--border-subtle)] bg-[#0e111d] flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-mono text-[var(--text-dim)] shrink-0">Quick Ask:</span>
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            disabled={loading}
            onClick={() => handleSendMessage(qp)}
            className="text-xs shrink-0 px-3 py-1 rounded-full border border-white/5 bg-white/[0.03] hover:bg-white/[0.08] hover:border-indigo-500/30 text-[var(--text-muted)] hover:text-white transition-all cursor-pointer"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-4 border-t border-[var(--border-subtle)] bg-[#101322] flex items-center gap-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask AI Assistant about "${project.title}"...`}
          disabled={loading}
          className="flex-1 h-11 px-4 rounded-xl border border-[var(--border-subtle)] bg-[#0B0D16] text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-500 transition-colors"
        />

        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          {loading ? (
            <Sparkles className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Send</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
