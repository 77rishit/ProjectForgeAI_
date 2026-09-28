import React, { useState, useEffect } from 'react';
import {
  Edit3,
  Globe,
  Plus,
  X,
  ExternalLink,
  Award,
  FileText,
  Code2,
  Cpu,
  Layers,
  Sparkles,
  Download,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { projectService } from '../../services/projectService';
import { Project } from '../../types';
import { Avatar } from '../../components/ui/Avatar';
import { Link } from 'react-router-dom';
import { formatDeadline } from '../../utils/formatters';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const toast = useToast();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Edit Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editSemester, setEditSemester] = useState('');
  const [editSkills, setEditSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [editLanguages, setEditLanguages] = useState<string[]>(['TypeScript', 'Python', 'Go', 'JavaScript', 'SQL']);
  const [newLangInput, setNewLangInput] = useState('');
  const [editInterests, setEditInterests] = useState<string[]>([]);
  const [newInterestInput, setNewInterestInput] = useState('');
  const [editGithub, setEditGithub] = useState('');
  const [editLinkedin, setEditLinkedin] = useState('');
  const [editPortfolio, setEditPortfolio] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditBio(user.bio || '');
      setEditDepartment(user.department || 'Computer Science');
      setEditSemester(String(user.semester || '5th Semester'));
      setEditSkills(
        user.skills && user.skills.length > 0
          ? user.skills
          : ['React', 'Node.js', 'PostgreSQL', 'Docker', 'REST APIs', 'System Design']
      );
      setEditLanguages(
        user.programmingLanguages && user.programmingLanguages.length > 0
          ? user.programmingLanguages
          : ['TypeScript', 'Python', 'Go', 'JavaScript', 'SQL']
      );
      setEditInterests(
        user.interests && user.interests.length > 0
          ? user.interests
          : ['AI Agents', 'Distributed Systems', 'Cloud Architecture', 'Developer Tooling']
      );
      setEditGithub(user.githubUrl || user.github || 'https://github.com');
      setEditLinkedin(user.linkedinUrl || user.linkedin || 'https://linkedin.com');
      setEditPortfolio(user.portfolioUrl || user.portfolio || '');
    }
  }, [user]);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await projectService.getMyProjects();
        setProjects(data);
      } catch (err) {
        console.error('Failed to load user projects:', err);
      } finally {
        setLoadingProjects(false);
      }
    }
    loadProjects();
  }, []);

  const name = user?.name || editName || 'Rishit Patel';
  const bio = user?.bio !== undefined && user.bio !== '' ? user.bio : (editBio || 'Student software engineer building intelligent developer platforms and full-stack collaborative applications.');
  const department = user?.department || editDepartment || 'Computer Science';
  const semester = user?.semester ? `${user.semester}` : '5th Semester';
  const skills = user?.skills && user.skills.length > 0 ? user.skills : editSkills;
  const interests = user?.interests && user.interests.length > 0 ? user.interests : editInterests;
  const languages = user?.programmingLanguages && user.programmingLanguages.length > 0 ? user.programmingLanguages : editLanguages;

  const achievements = user?.achievements && user.achievements.length > 0
    ? user.achievements
    : [
        { title: '1st Place · University Hackathon 2026', desc: 'Built real-time autonomous agent router with WebSockets & Redis.', date: 'Spring 2026' },
        { title: 'Dean’s Honor List for Academic Excellence', desc: 'Top 5% departmental ranking in Computer Science & Engineering.', date: 'Fall 2025' },
        { title: 'Certified AWS Solutions Architect Associate', desc: 'Validated proficiency in cloud architecture and microservices.', date: 'Summer 2025' }
      ];

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        name: editName.trim(),
        bio: editBio.trim(),
        department: editDepartment.trim(),
        semester: editSemester.trim(),
        skills: editSkills,
        programmingLanguages: editLanguages,
        interests: editInterests,
        github: editGithub.trim(),
        githubUrl: editGithub.trim(),
        linkedin: editLinkedin.trim(),
        linkedinUrl: editLinkedin.trim(),
        portfolio: editPortfolio.trim(),
        portfolioUrl: editPortfolio.trim()
      });
      toast.success('Profile saved to database successfully!');
      setIsEditOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkillInput.trim() && !editSkills.includes(newSkillInput.trim())) {
      setEditSkills([...editSkills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const removeSkill = (s: string) => {
    setEditSkills(editSkills.filter((item) => item !== s));
  };

  const addLanguage = () => {
    if (newLangInput.trim() && !editLanguages.includes(newLangInput.trim())) {
      setEditLanguages([...editLanguages, newLangInput.trim()]);
      setNewLangInput('');
    }
  };

  const removeLanguage = (l: string) => {
    setEditLanguages(editLanguages.filter((item) => item !== l));
  };

  const addInterest = () => {
    if (newInterestInput.trim() && !editInterests.includes(newInterestInput.trim())) {
      setEditInterests([...editInterests, newInterestInput.trim()]);
      setNewInterestInput('');
    }
  };

  const removeInterest = (i: string) => {
    setEditInterests(editInterests.filter((item) => item !== i));
  };

  return (
    <div className="space-y-16 max-w-6xl mx-auto w-full">
      {/* 1. LARGE PROFILE HEADER (Subtle Gradient Background, Student/Developer Identity) */}
      <div className="relative rounded-3xl border border-[var(--border-subtle)] bg-gradient-to-br from-[#10131F] via-[#0B0D16] to-[#080A12] p-8 sm:p-12 overflow-hidden shadow-xl">
        {/* Subtle ambient gradient mesh in background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-600/10 via-violet-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar
              name={name}
              src={user?.profileImage || user?.avatar}
              size="xl"
              className="w-20 h-20 sm:w-24 sm:h-24 text-2xl font-bold ring-4 ring-indigo-500/20 shrink-0"
            />

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                {name}
              </h1>

              <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm font-mono text-[var(--text-muted)]">
                <span className="text-indigo-400 font-semibold">{department}</span>
                <span className="text-zinc-600">·</span>
                <span className="text-zinc-300">{semester}</span>
              </div>

              <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-2xl leading-relaxed pt-1">
                {bio}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#141725] hover:bg-white/10 text-white border border-[var(--border-subtle)] transition-all cursor-pointer self-start sm:self-auto shrink-0 shadow-sm"
          >
            <Edit3 className="w-4 h-4 text-indigo-400" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* 2. SKILLS (Clean Pill Tags, No unnecessary bulky boxes) */}
      <div className="space-y-4">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-dim)]">
          CORE SKILLS & TECHNOLOGIES
        </div>

        <div className="flex flex-wrap gap-2.5">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-4 py-2 rounded-xl bg-[#10131F] border border-[var(--border-subtle)] text-xs sm:text-sm font-mono text-[var(--text-main)] hover:border-indigo-500/30 transition-colors"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* 3. PROGRAMMING LANGUAGES */}
      <div className="space-y-4">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-dim)] flex items-center gap-2">
          <Code2 className="w-4 h-4 text-indigo-400" />
          <span>PROGRAMMING LANGUAGES</span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {languages.map((lang) => (
            <span
              key={lang}
              className="px-4 py-2 rounded-xl bg-[#10131F] border border-[var(--border-subtle)] text-xs sm:text-sm font-mono text-indigo-300 font-semibold"
            >
              {lang}
            </span>
          ))}
        </div>
      </div>

      {/* 4. INTERESTS */}
      <div className="space-y-4">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-dim)]">
          AREAS OF INTEREST
        </div>

        <div className="flex flex-wrap gap-2.5">
          {interests.map((interest) => (
            <span
              key={interest}
              className="px-4 py-1.5 rounded-xl bg-[#0B0D16] text-[var(--text-muted)] text-xs sm:text-sm font-medium border border-[var(--border-subtle)]"
            >
              ✦ {interest}
            </span>
          ))}
        </div>
      </div>

      {/* 5. PROJECTS (Spacious Project Showcase) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-dim)]">
            FEATURED PROJECTS ({projects.length})
          </div>
          <Link to="/projects" className="text-xs sm:text-sm text-indigo-400 font-semibold hover:text-indigo-300">
            View all projects →
          </Link>
        </div>

        {loadingProjects ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-44 rounded-2xl bg-[#10131F]/50 border border-[var(--border-subtle)] animate-pulse" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="p-10 rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] text-center text-xs text-[var(--text-muted)]">
            No projects enrolled yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.slice(0, 4).map((p) => (
              <div
                key={p._id}
                className="p-7 rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] hover:bg-[#141725] hover:border-indigo-500/35 transition-all space-y-4 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <Link
                    to={`/projects/${p._id}`}
                    className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1"
                  >
                    {p.title}
                  </Link>
                  <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full shrink-0">
                    {p.progress ?? 68}%
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed line-clamp-2">
                  {p.description || p.abstract || 'AI-powered capstone project architecture.'}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-xs text-[var(--text-dim)]">
                  <span>Due {formatDeadline(p.updatedAt || p.createdAt)}</span>
                  <Link
                    to={`/projects/${p._id}`}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    Open Workspace →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. ACHIEVEMENTS */}
      <div className="space-y-4">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-dim)] flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>HONORS & ACHIEVEMENTS</span>
        </div>

        <div className="space-y-3">
          {achievements.map((ach: any, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <h4 className="text-sm sm:text-base font-bold text-white">{ach.title}</h4>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{ach.desc || ach.description}</p>
              </div>
              <span className="text-xs font-mono text-[var(--text-dim)] shrink-0 self-start sm:self-center">
                {ach.date}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 7. RESUME & PORTFOLIO */}
      <div className="space-y-4">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-dim)] flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-400" />
          <span>RESUME & LINKS</span>
        </div>

        <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Rishit_Patel_Resume.pdf</div>
              <div className="text-xs text-[var(--text-dim)]">Verified Academic Portfolio · Updated Sep 2026</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                toast.success('Resume downloaded!');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>

            {editGithub && (
              <a
                href={editGithub}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl border border-[var(--border-subtle)] hover:bg-white/5 text-[var(--text-muted)] hover:text-white transition-colors"
                title="GitHub"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl border border-[var(--border-subtle)] bg-[#10131F] p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="text-lg font-bold text-white">Edit Profile Identity</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-muted)]">Full Name *</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] text-xs sm:text-sm text-white outline-none focus:border-indigo-500/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-muted)]">Department</label>
                  <input
                    type="text"
                    value={editDepartment}
                    onChange={(e) => setEditDepartment(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] text-xs sm:text-sm text-white outline-none focus:border-indigo-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-muted)]">Semester</label>
                  <input
                    type="text"
                    value={editSemester}
                    onChange={(e) => setEditSemester(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] text-xs sm:text-sm text-white outline-none focus:border-indigo-500/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-muted)]">Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  placeholder="Tell others about your engineering passions and focus..."
                  className="w-full p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] text-xs sm:text-sm text-white outline-none focus:border-indigo-500/50"
                />
              </div>

              {/* Skills Editor */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[var(--text-muted)]">Skills</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editSkills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 text-xs border border-indigo-500/20"
                    >
                      {s}
                      <button type="button" onClick={() => removeSkill(s)} className="hover:text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder="Add skill (e.g. Docker, GraphQL) and press Enter"
                    className="flex-1 h-9 px-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-input)] text-xs text-white outline-none focus:border-indigo-500/50"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Programming Languages Editor */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[var(--text-muted)]">Programming Languages</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editLanguages.map((l) => (
                    <span
                      key={l}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-violet-500/10 text-violet-300 text-xs border border-violet-500/20"
                    >
                      {l}
                      <button type="button" onClick={() => removeLanguage(l)} className="hover:text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newLangInput}
                    onChange={(e) => setNewLangInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addLanguage();
                      }
                    }}
                    placeholder="Add language (e.g. Rust, Go, Python) and press Enter"
                    className="flex-1 h-9 px-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-input)] text-xs text-white outline-none focus:border-indigo-500/50"
                  />
                  <button
                    type="button"
                    onClick={addLanguage}
                    className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Interests Editor */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[var(--text-muted)]">Interests</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editInterests.map((it) => (
                    <span
                      key={it}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 text-xs border border-emerald-500/20"
                    >
                      {it}
                      <button type="button" onClick={() => removeInterest(it)} className="hover:text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newInterestInput}
                    onChange={(e) => setNewInterestInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addInterest();
                      }
                    }}
                    placeholder="Add interest (e.g. Autonomous Agents) and press Enter"
                    className="flex-1 h-9 px-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-input)] text-xs text-white outline-none focus:border-indigo-500/50"
                  />
                  <button
                    type="button"
                    onClick={addInterest}
                    className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Social URLs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-muted)]">GitHub URL</label>
                  <input
                    type="text"
                    value={editGithub}
                    onChange={(e) => setEditGithub(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] text-xs sm:text-sm text-white outline-none focus:border-indigo-500/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-muted)]">LinkedIn URL</label>
                  <input
                    type="text"
                    value={editLinkedin}
                    onChange={(e) => setEditLinkedin(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] text-xs sm:text-sm text-white outline-none focus:border-indigo-500/50"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[var(--text-muted)] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-sm disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Profile to Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
