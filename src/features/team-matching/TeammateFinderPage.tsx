import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Mail,
  FolderGit2,
  Undo2,
  Check,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { matchingService, TeammateFilterParams } from '../../services/matchingService';
import { projectService } from '../../services/projectService';
import { TeammateMatch, TeamRequest, User, Project } from '../../types';
import { Avatar } from '../../components/ui/Avatar';
import { PersonCard } from '../../components/ui/PersonCard';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { EmptyState } from '../../components/ui/EmptyState';
import { UserProfileModal } from './UserProfileModal';
import { SendInviteModal } from './SendInviteModal';
import { AddToTeamModal } from './AddToTeamModal';

export const TeammateFinderPage: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState<'recommended' | 'all' | 'requests'>('recommended');
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [selectedInterest, setSelectedInterest] = useState('All');
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');

  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const [matches, setMatches] = useState<TeammateMatch[]>([]);
  const [allStudents, setAllStudents] = useState<User[]>([]);
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [requests, setRequests] = useState<{ incoming: TeamRequest[]; outgoing: TeamRequest[] }>({
    incoming: [],
    outgoing: []
  });
  const [loading, setLoading] = useState(true);
  const [recentlyDismissed, setRecentlyDismissed] = useState<{ id: string; name: string }[]>([]);

  // Modals
  const [profileModalUser, setProfileModalUser] = useState<User | null>(null);
  const [profileModalScore, setProfileModalScore] = useState<number | undefined>(undefined);
  const [inviteModalMatch, setInviteModalMatch] = useState<TeammateMatch | null>(null);
  const [addToTeamMatch, setAddToTeamMatch] = useState<TeammateMatch | null>(null);

  const departmentOptions = [
    'All',
    'Computer Science & Engineering',
    'Data Science & Artificial Intelligence',
    'Design & Human-Computer Interaction',
    'Electrical & Computer Engineering',
    'Cybersecurity & Information Assurance'
  ];

  const skillOptions = [
    'All',
    'React',
    'TypeScript',
    'Node.js',
    'Go',
    'PostgreSQL',
    'Docker',
    'PyTorch',
    'Python',
    'Figma',
    'Tailwind CSS'
  ];

  useEffect(() => {
    const fetchAuxiliaryData = async () => {
      try {
        const [projs, reqs] = await Promise.all([
          projectService.getMyProjects(),
          matchingService.getMyRequests()
        ]);
        setMyProjects(projs);
        setRequests(reqs);
        if (projs.length > 0 && !selectedProjectId) {
          setSelectedProjectId(projs[0]._id);
        }
      } catch (err) {
        console.error('Failed to load auxiliary data:', err);
      }
    };
    fetchAuxiliaryData();
  }, []);

  const loadCandidates = async () => {
    setLoading(true);
    try {
      const filterParams: TeammateFilterParams = {
        department: selectedDept !== 'All' ? selectedDept : undefined,
        skills: selectedSkill !== 'All' ? selectedSkill : undefined,
        interests: selectedInterest !== 'All' ? selectedInterest : undefined,
        semester: selectedSemester !== 'All' ? selectedSemester : undefined,
        availability: selectedAvailability !== 'All' ? selectedAvailability : undefined,
        experience: selectedExperience !== 'All' ? selectedExperience : undefined,
        projectId: selectedProjectId || undefined,
        search: search.trim() || undefined
      };

      const [recs, directory] = await Promise.all([
        matchingService.getRecommendations(filterParams),
        matchingService.getStudents({
          department: selectedDept !== 'All' ? selectedDept : undefined,
          skill: selectedSkill !== 'All' ? selectedSkill : undefined,
          search: search.trim() || undefined
        })
      ]);

      setMatches(recs);
      setAllStudents(directory);
    } catch (err: any) {
      console.error('Failed to load teammate matches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, [selectedDept, selectedSkill, selectedInterest, selectedSemester, selectedAvailability, selectedExperience, selectedProjectId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadCandidates();
  };

  const handleViewProfile = (candidateUser: User, score?: number) => {
    setProfileModalUser(candidateUser);
    setProfileModalScore(score);
  };

  const handleSendInvite = (match: TeammateMatch) => {
    setInviteModalMatch(match);
  };

  const handleRespondRequest = async (requestId: string, status: 'accepted' | 'rejected') => {
    try {
      await matchingService.respondToRequest(requestId, status);
      toast.success(`Request ${status}!`);
      const updatedReqs = await matchingService.getMyRequests();
      setRequests(updatedReqs);
    } catch (err: any) {
      toast.error(err.message || 'Error responding to request');
    }
  };

  return (
    <div className="space-y-8 w-full">
      {/* 1. EDITORIAL TEAM DISCOVERY HEADER */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-main)] tracking-tight">
              Build your team.
            </h1>
            <p className="text-base sm:text-lg text-[var(--text-muted)] font-normal">
              Find people whose skills complement yours.
            </p>
          </div>

          {/* Segmented View Switcher */}
          <div className="inline-flex items-center p-1 rounded-xl bg-[#10131F] border border-[var(--border-subtle)] text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('recommended')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'recommended'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-[var(--text-muted)] hover:text-white'
              }`}
            >
              Recommended ({matches.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-[var(--text-muted)] hover:text-white'
              }`}
            >
              All Peers ({allStudents.length})
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'requests'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-[var(--text-muted)] hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Invites ({requests.incoming.length})</span>
            </button>
          </div>
        </div>

        {/* Search & Criteria */}
        <div className="space-y-3 pt-1">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Search by student name, skill tags, or preferred roles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '44px', paddingRight: '100px' }}
              className="w-full py-3 rounded-xl border border-[var(--border-subtle)] bg-[#0D101C] text-xs sm:text-sm text-[var(--text-main)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-indigo-500/50 transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm cursor-pointer transition-colors"
            >
              Search
            </button>
          </form>

          {/* Quick Skill Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1.5">
            {skillOptions.map((sk) => (
              <button
                key={sk}
                onClick={() => setSelectedSkill(sk)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedSkill === sk
                    ? 'bg-indigo-600 text-white shadow-sm border border-indigo-500 font-semibold'
                    : 'bg-[#10131F] text-[var(--text-muted)] hover:text-white border border-[var(--border-subtle)] hover:bg-[#141725]'
                }`}
              >
                {sk}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. CANDIDATE TALENT CARDS */}
      {activeTab === 'recommended' && (
        <div className="space-y-6">
          <SectionHeader
            title="Ranked Complementary Candidates"
            description={`${matches.length} students whose skillsets complement your profile.`}
          />

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-64 rounded-2xl border border-[var(--border-subtle)] bg-[#10131F]/50 animate-pulse" />
              ))}
            </div>
          ) : matches.length === 0 ? (
            <EmptyState
              icon={<Users className="w-6 h-6 text-indigo-400" />}
              title="No matching candidates found"
              description="Try adjusting your filter criteria or search query to discover more peers."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match) => {
                const { user: candidate } = match;
                const compatibility = match.compatibilityScore || match.matchPercentage || 94;
                const skills = (match.complementarySkills && match.complementarySkills.length > 0
                  ? [...match.complementarySkills, ...(candidate.skills || [])]
                  : candidate.skills || ['Node.js', 'MongoDB', 'Express']
                ).slice(0, 4);
                const matchReason = match.whyMatches && match.whyMatches.length > 0
                  ? match.whyMatches[0]
                  : 'Complements your frontend skills';

                return (
                  <PersonCard
                    key={match.userId}
                    id={match.userId}
                    name={candidate.name}
                    avatarUrl={candidate.profileImage || candidate.avatar}
                    role={candidate.preferredRole || candidate.department || 'Full-Stack Developer'}
                    department={candidate.department}
                    semester={candidate.semester || 'Semester 6'}
                    skills={skills}
                    compatibilityScore={compatibility}
                    aiExplanation={matchReason}
                    onViewProfile={() => handleViewProfile(candidate, compatibility)}
                    onInvite={() => handleSendInvite(match)}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ALL STUDENTS DIRECTORY */}
      {activeTab === 'all' && (
        <div className="space-y-6">
          <SectionHeader
            title="Student Directory"
            description={`Explore ${allStudents.length} verified university engineering students.`}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allStudents.map((st) => (
              <PersonCard
                key={st._id}
                id={st._id}
                name={st.name}
                avatarUrl={st.profileImage || st.avatar}
                role={st.preferredRole || 'Student'}
                department={st.department}
                semester={st.semester || 'Semester 6'}
                skills={st.skills}
                onViewProfile={() => handleViewProfile(st)}
                onInvite={() =>
                  setInviteModalMatch({
                    userId: st._id,
                    user: st,
                    compatibilityScore: 85,
                    matchHighlights: [],
                    complementarySkills: [],
                    overlapSkills: [],
                    recommendedRole: st.preferredRole || 'Teammate'
                  })
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: INVITATIONS */}
      {activeTab === 'requests' && (
        <div className="space-y-8">
          <div className="space-y-4">
            <SectionHeader
              title="Incoming Invitations"
              description={`You have ${requests.incoming.length} active team invitations.`}
            />

            {requests.incoming.length === 0 ? (
              <EmptyState
                icon={<Mail className="w-6 h-6 text-indigo-400" />}
                title="No pending invitations"
                description="When peers invite you to join their capstone projects, they will appear here."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {requests.incoming.map((req) => (
                  <div key={req._id} className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-indigo-400">
                        {req.projectId?.title || 'Project'}
                      </span>
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300">
                        {req.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Avatar name={req.fromUser?.name || 'Sender'} size="md" />
                      <div>
                        <strong className="text-white text-sm block font-semibold">{req.fromUser?.name}</strong>
                        <span className="text-xs text-[var(--text-muted)]">{req.fromUser?.department}</span>
                      </div>
                    </div>

                    {req.message && (
                      <p className="text-xs sm:text-sm text-[var(--text-muted)] bg-[#141824] p-3 rounded-xl border border-[var(--border-subtle)] leading-relaxed">
                        "{req.message}"
                      </p>
                    )}

                    {req.status === 'pending' && (
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border-subtle)]">
                        <button
                          onClick={() => handleRespondRequest(req._id, 'rejected')}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleRespondRequest(req._id, 'accepted')}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
                        >
                          Accept
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Candidate Profile Modal */}
      <UserProfileModal
        isOpen={Boolean(profileModalUser)}
        onClose={() => setProfileModalUser(null)}
        user={profileModalUser}
        matchScore={profileModalScore}
        onInvite={(u) => {
          setInviteModalMatch({
            userId: u._id,
            user: u,
            compatibilityScore: profileModalScore || 85,
            matchHighlights: [],
            complementarySkills: [],
            overlapSkills: [],
            recommendedRole: u.preferredRole || 'Technical Collaborator'
          });
        }}
      />

      {/* Send Team Invitation Modal */}
      <SendInviteModal
        isOpen={Boolean(inviteModalMatch)}
        onClose={() => setInviteModalMatch(null)}
        candidate={inviteModalMatch?.user || null}
        match={inviteModalMatch}
        projects={myProjects}
        onSuccess={() => {
          matchingService.getMyRequests().then(setRequests);
        }}
      />

      {/* Direct Add to Team Modal */}
      <AddToTeamModal
        isOpen={Boolean(addToTeamMatch)}
        onClose={() => setAddToTeamMatch(null)}
        candidate={addToTeamMatch?.user || null}
        match={addToTeamMatch}
        projects={myProjects}
        onSuccess={() => {
          projectService.getMyProjects().then(setMyProjects);
        }}
      />
    </div>
  );
};
