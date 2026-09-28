import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { matchingService } from '../../services/matchingService';
import { aiService, TeamMatchAI } from '../../services/aiService';
import { User, Project, TeammateMatch } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { Sparkles, Send, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';

interface MatchDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: TeammateMatch | null;
  projects: Project[];
}

export const MatchDetailsModal: React.FC<MatchDetailsModalProps> = ({
  isOpen,
  onClose,
  match,
  projects
}) => {
  const { user } = useAuth();
  const toast = useToast();

  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?._id || '');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  // Real AI evaluation state
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<TeamMatchAI | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  if (!match) return null;

  const currentProject = projects.find((p) => p._id === selectedProjectId) || projects[0];

  const handleRunAiEvaluation = async () => {
    if (!currentProject) {
      toast.error('Select a project first to evaluate compatibility.');
      return;
    }

    setAnalyzing(true);
    setAiError(null);

    try {
      const result = await aiService.matchTeam(
        {
          title: currentProject.title,
          description: currentProject.description,
          requiredSkills: currentProject.technologies || []
        },
        {
          name: match.user.name,
          skills: match.user.skills || [],
          interests: match.user.interests || [],
          experience: match.user.year || match.user.department || 'Undergraduate'
        }
      );

      setAiAnalysis(result);
      toast.success(`Evaluated compatibility: ${result.compatibility}%`);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'AI unavailable right now. Please try again.';
      setAiError(msg);
      toast.error(msg);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSendInvite = async () => {
    if (!selectedProjectId) {
      toast.error('Please choose a project to invite this teammate to.');
      return;
    }

    setSending(true);
    try {
      await matchingService.sendRequest({
        toUserId: match.user._id,
        projectId: selectedProjectId,
        type: 'invite',
        message: message || `Hi ${match.user.name.split(' ')[0]}, I saw your profile and our complementary skills match. Would love to team up!`,
        compatibilityScore: aiAnalysis ? aiAnalysis.compatibility : match.compatibilityScore,
        matchHighlights: aiAnalysis ? aiAnalysis.strengths : match.matchHighlights
      });

      toast.success(`Invitation sent to ${match.user.name}!`);
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to send invitation');
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <span>AI Teammate Fit & Synergy Evaluation</span>
        </div>
      }
      description="Connects to the backend OpenAI evaluation engine to analyze project fit objectively."
    >
      <div className="flex flex-col gap-5">
        {/* Candidate Profile summary */}
        <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
          <Avatar name={match.user.name} size="lg" src={match.user.profileImage || match.user.avatar} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white">{match.user.name}</h3>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {aiAnalysis ? `${aiAnalysis.compatibility}% AI Evaluated` : `${match.compatibilityScore || 85}% Base Score`}
              </span>
            </div>
            <div className="text-xs text-white/50 mt-0.5">{match.user.department} • {match.user.year}</div>
            <div className="text-xs text-indigo-300 font-medium mt-1">
              Role: {match.recommendedRole || match.user.preferredRole || 'Contributor'}
            </div>
          </div>
        </div>

        {/* AI Action Trigger */}
        {currentProject && !aiAnalysis && (
          <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-white">Evaluate against "{currentProject.title}"</div>
              <p className="text-[11px] text-[var(--text-muted)]">
                AI analyzes actual project requirements vs candidate's verified skills.
              </p>
            </div>
            <Button
              onClick={handleRunAiEvaluation}
              loading={analyzing}
              variant="primary"
              size="sm"
              icon={<Sparkles className="w-3.5 h-3.5" />}
            >
              {analyzing ? '✦ Thinking...' : 'Analyze Fit'}
            </Button>
          </div>
        )}

        {/* AI Thinking Animation */}
        {analyzing && (
          <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-center space-y-2 animate-pulse">
            <div className="text-xs font-semibold text-indigo-300 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-indigo-400" />
              <span>✦ Thinking... ProjectForge AI is evaluating technical alignment</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              Auditing candidate skills against project dependencies and stack...
            </p>
          </div>
        )}

        {/* AI Error Display */}
        {aiError && (
          <div className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/10 flex items-center gap-2 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{aiError}</span>
          </div>
        )}

        {/* Live AI Analysis Results */}
        {aiAnalysis && (
          <div className="p-4 rounded-xl border border-indigo-500/30 bg-[#121626] space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
                ✦ AI Compatibility Report
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {aiAnalysis.compatibility}% Match
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
              {aiAnalysis.reason}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Strengths */}
              <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 space-y-1.5">
                <span className="font-semibold text-emerald-400 text-[11px] uppercase tracking-wide">Key Strengths</span>
                <div className="flex flex-wrap gap-1">
                  {aiAnalysis.strengths?.length > 0 ? (
                    aiAnalysis.strengths.map((str, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px]">
                        ✓ {str}
                      </span>
                    ))
                  ) : (
                    <span className="text-zinc-500 text-[10px]">No specific strengths flagged</span>
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 space-y-1.5">
                <span className="font-semibold text-amber-400 text-[11px] uppercase tracking-wide">Skills Gap / Needed</span>
                <div className="flex flex-wrap gap-1">
                  {aiAnalysis.missingSkills?.length > 0 ? (
                    aiAnalysis.missingSkills.map((gap, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[10px]">
                        ! {gap}
                      </span>
                    ))
                  ) : (
                    <span className="text-emerald-400 text-[10px]">No missing core skills</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Invite to Project Form */}
        <div className="flex flex-col gap-3 pt-3 border-t border-white/10">
          <label className="text-xs font-bold text-white/80 uppercase tracking-wider">
            Send Invitation to Project
          </label>

          {projects.length === 0 ? (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
              You must create a project first before sending team invitations.
            </div>
          ) : (
            <>
              <select
                value={selectedProjectId}
                onChange={(e) => {
                  setSelectedProjectId(e.target.value);
                  setAiAnalysis(null);
                }}
                className="w-full rounded-xl border border-white/10 bg-[#090c17] px-3.5 py-2 text-sm text-white outline-none focus:border-indigo-500"
              >
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title} ({p.members?.length || 1}/{p.maxMembers} members)
                  </option>
                ))}
              </select>

              <textarea
                rows={3}
                placeholder="Include a short personalized note about why your project fits their interests..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#090c17] p-3 text-sm text-white placeholder-white/30 outline-none focus:border-indigo-500"
              />

              <div className="flex justify-end gap-2 mt-1">
                <Button onClick={onClose} variant="ghost" size="md">
                  Cancel
                </Button>
                <Button
                  onClick={handleSendInvite}
                  variant="primary"
                  size="md"
                  loading={sending}
                  icon={<Send className="w-4 h-4" />}
                >
                  Send Invitation
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};
