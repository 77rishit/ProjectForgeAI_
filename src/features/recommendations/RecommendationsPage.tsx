import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Users,
  Compass,
  CheckCircle2,
  Cpu,
  Layers,
  Clock,
  Send
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ideaService } from '../../services/ideaService';
import { matchingService } from '../../services/matchingService';
import { aiService } from '../../services/aiService';
import { ProjectIdea, TeammateMatch } from '../../types';
import { Avatar } from '../../components/ui/Avatar';
import { PersonCard } from '../../components/ui/PersonCard';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { EmptyState } from '../../components/ui/EmptyState';
import { SendInviteModal } from '../team-matching/SendInviteModal';
import { UserProfileModal } from '../team-matching/UserProfileModal';

export const RecommendationsPage: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState<ProjectIdea[]>([]);
  const [matches, setMatches] = useState<TeammateMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const [selectedMatch, setSelectedMatch] = useState<TeammateMatch | null>(null);
  const [profileModalUser, setProfileModalUser] = useState<any>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [recs, teamMatches] = await Promise.all([
        ideaService.getRecommendedIdeas().catch(() => []),
        matchingService.getRecommendations({}).catch(() => [])
      ]);
      setIdeas(recs);
      setMatches(teamMatches);
    } catch (err) {
      console.error('Failed to load AI recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveIdea = async (idea: ProjectIdea) => {
    setSavingId(idea._id);
    try {
      const res = await ideaService.adoptIdea(idea._id);
      toast.success('Project idea saved into your MongoDB workspace!');
      navigate(`/projects/${res.project._id}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save project');
    } finally {
      setSavingId(null);
    }
  };

  const handleDismissIdea = (ideaId: string) => {
    setIdeas((prev) => prev.filter((i) => i._id !== ideaId));
    toast.info('Recommendation dismissed');
  };

  return (
    <div className="space-y-16 max-w-7xl mx-auto w-full">
      {/* 1. HERO SECTION (Subtle AI visual treatment, not a giant full banner) */}
      <div className="relative pt-6 pb-2">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI RECOMMENDATION ENGINE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-main)] tracking-tight">
            AI-powered recommendations
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
            Project ideas and teammates matched to your verified skills, course syllabus, and interests.
          </p>
        </div>
      </div>

      {/* 2. SECTION: RECOMMENDED PROJECTS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <span>Recommended Projects</span>
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
              Architectural blueprints calibrated to your development stack.
            </p>
          </div>

          <Link
            to="/discovery"
            className="text-xs sm:text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>View all ideas</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-[#10131F]/50 border border-[var(--border-subtle)] animate-pulse" />
            ))}
          </div>
        ) : ideas.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] text-xs text-[var(--text-muted)]">
            No recommendations generated yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.slice(0, 6).map((idea) => {
              const match = idea.matchPercentage ?? 92;
              const stack = (idea.technologies || idea.recommendedStack || ['React', 'Node.js', 'AI']).slice(0, 4);

              return (
                <div
                  key={idea._id}
                  className="rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] hover:border-indigo-500/40 p-6 sm:p-7 flex flex-col justify-between space-y-5 transition-all duration-200 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-[11px] font-mono text-indigo-400 uppercase font-semibold">
                        ✦ {idea.domain || idea.category || 'AI System'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold shrink-0">
                        {match}% match
                      </span>
                    </div>

                    <Link
                      to={`/ideas/${idea._id}`}
                      className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors block line-clamp-1"
                    >
                      {idea.title}
                    </Link>

                    <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed line-clamp-2">
                      {idea.description || idea.problemStatement || 'AI-curated capstone project architecture.'}
                    </p>
                  </div>

                  <div className="space-y-4 pt-2 border-t border-[var(--border-subtle)]">
                    <div className="flex flex-wrap gap-1.5">
                      {stack.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md bg-[#141725] text-[11px] font-mono text-[var(--text-muted)]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
                      <span className="text-xs font-mono text-[var(--text-dim)] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {idea.estimatedDuration || '6-8 weeks'}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleDismissIdea(idea._id)}
                          className="px-2.5 py-1 rounded-lg text-xs text-[var(--text-muted)] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          Dismiss
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSaveIdea(idea)}
                          disabled={savingId === idea._id}
                          className="px-3 py-1 rounded-lg bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/30 text-indigo-300 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {savingId === idea._id ? 'Saving...' : 'Save'}
                        </button>

                        <Link
                          to={`/ideas/${idea._id}`}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                        >
                          <span>Explore</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. SECTION: RECOMMENDED TEAMMATES */}
      <div className="space-y-6">
        <SectionHeader
          title="Recommended Teammates"
          description="Collaborators whose skills complement your profile and share project interests."
          action={
            <Link
              to="/team-matching"
              className="text-xs sm:text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>Explore team finder</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          }
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-[#10131F]/50 border border-[var(--border-subtle)] animate-pulse" />
            ))}
          </div>
        ) : matches.length === 0 ? (
          <EmptyState
            icon={<Users className="w-6 h-6 text-indigo-400" />}
            title="No teammate recommendations available"
            description="Update your profile skills and project preferences to receive peer matches."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.slice(0, 6).map((match) => {
              const u = match.user;
              const score = match.compatibilityScore || match.matchPercentage || 92;
              const explanation =
                match.whyMatches?.[0] ||
                match.matchHighlights?.[0] ||
                `Complements your frontend skills with deep backend expertise.`;

              return (
                <PersonCard
                  key={match.userId || u._id}
                  id={match.userId || u._id}
                  name={u.name}
                  avatarUrl={u.profileImage || u.avatar}
                  role={match.recommendedRole || u.preferredRole || 'Software Engineer'}
                  department={u.department}
                  skills={u.skills || ['React', 'TypeScript', 'Node.js']}
                  compatibilityScore={score}
                  aiExplanation={explanation}
                  onViewProfile={() => setProfileModalUser(u)}
                  onInvite={() => setSelectedMatch(match)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {selectedMatch && (
        <SendInviteModal
          isOpen={Boolean(selectedMatch)}
          onClose={() => setSelectedMatch(null)}
          match={selectedMatch}
          projects={[]}
          onInviteSent={() => setSelectedMatch(null)}
        />
      )}

      {/* User Profile Modal */}
      {profileModalUser && (
        <UserProfileModal
          isOpen={Boolean(profileModalUser)}
          onClose={() => setProfileModalUser(null)}
          user={profileModalUser}
        />
      )}
    </div>
  );
};
