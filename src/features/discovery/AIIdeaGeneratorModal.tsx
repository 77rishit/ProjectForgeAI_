import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { aiService, ProjectIdeaAI } from '../../services/aiService';
import { projectService } from '../../services/projectService';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Sparkles, ArrowRight, CheckCircle2, AlertCircle, Clock, Tag } from 'lucide-react';

interface AIIdeaGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIdeaCreated?: () => void;
}

export const AIIdeaGeneratorModal: React.FC<AIIdeaGeneratorModalProps> = ({ isOpen, onClose, onIdeaCreated }) => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [domain, setDomain] = useState('AI / Machine Learning');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [skillsString, setSkillsString] = useState(user?.skills?.join(', ') || 'React, TypeScript, Node.js, Python');
  const [interestsString, setInterestsString] = useState(user?.interests?.join(', ') || 'Autonomous Systems, Cloud, Web3');
  const [generating, setGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generatedIdeas, setGeneratedIdeas] = useState<ProjectIdeaAI[]>([]);
  const [adoptingId, setAdoptingId] = useState<string | null>(null);

  const domainOptions = [
    { value: 'AI / Machine Learning', label: 'AI / Machine Learning' },
    { value: 'Healthcare & Biotech', label: 'Healthcare & Biotech' },
    { value: 'ClimateTech & IoT', label: 'ClimateTech & IoT' },
    { value: 'Cybersecurity & Cloud', label: 'Cybersecurity & Cloud' },
    { value: 'Full-Stack Web3', label: 'Full-Stack Web3' },
    { value: 'EdTech & Social Impact', label: 'EdTech & Social Impact' }
  ];

  const difficultyOptions = [
    { value: 'Beginner', label: 'Beginner (Introductory)' },
    { value: 'Intermediate', label: 'Intermediate (Semester Project)' },
    { value: 'Advanced', label: 'Advanced (Year-Long Capstone)' }
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setErrorMessage(null);

    try {
      const skills = skillsString.split(',').map((s) => s.trim()).filter(Boolean);
      const interests = interestsString.split(',').map((s) => s.trim()).filter(Boolean);

      const ideas = await aiService.generateProjectIdeas({
        preferredDomain: domain,
        experienceLevel: difficulty,
        skills,
        interests,
        department: user?.department || 'Computer Science & Engineering',
        semester: user?.semester ? String(user.semester) : 'Semester 6'
      });

      setGeneratedIdeas(ideas);
      toast.success(`Generated ${ideas.length} custom capstone concepts!`);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'AI unavailable right now. Please try again.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setGenerating(false);
    }
  };

  const handleAdopt = async (idea: ProjectIdeaAI, index: number) => {
    setAdoptingId(String(index));
    try {
      const newProject = await projectService.createProject({
        title: idea.title,
        description: idea.description,
        abstract: idea.reason,
        category: domain,
        technologies: idea.technologies || [],
        tags: [idea.difficulty, ...(idea.technologies || []).slice(0, 3)],
        status: 'planning',
        progress: 0
      });

      toast.success('Project idea successfully saved to your MongoDB workspace!');
      onClose();
      if (onIdeaCreated) onIdeaCreated();
      navigate(`/projects/${newProject._id}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save project idea');
    } finally {
      setAdoptingId(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>AI Project Idea Studio</span>
        </div>
      }
      description="Connects to the ProjectForge AI engine to generate custom capstone concepts."
    >
      <div className="space-y-6">
        {/* Error message banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/10 flex items-center gap-3 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Generation Criteria Form */}
        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
          <Select
            label="Domain Focus"
            options={domainOptions}
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />

          <Select
            label="Scope / Difficulty"
            options={difficultyOptions}
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          />

          <div className="sm:col-span-2">
            <Input
              label="Verified Skills to Leverage"
              value={skillsString}
              onChange={(e) => setSkillsString(e.target.value)}
              placeholder="e.g. React, PyTorch, Node.js, Docker"
            />
          </div>

          <div className="sm:col-span-2">
            <Input
              label="Topics & Academic Interests"
              value={interestsString}
              onChange={(e) => setInterestsString(e.target.value)}
              placeholder="e.g. LLM Agents, Microservices, Health Informatics"
            />
          </div>

          <div className="sm:col-span-2 flex items-center justify-between pt-2">
            <span className="text-xs text-[var(--text-dim)] font-mono">
              ✦ Backend AI Service
            </span>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={generating}
              disabled={generating}
              icon={<Sparkles className="w-3.5 h-3.5" />}
            >
              {generating ? '✦ Thinking...' : 'Generate Project Concepts'}
            </Button>
          </div>
        </form>

        {/* Loading Skeleton */}
        {generating && (
          <div className="p-8 text-center space-y-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 animate-pulse">
            <div className="inline-flex items-center gap-2 text-indigo-400 text-sm font-semibold">
              <Sparkles className="w-4 h-4 animate-spin text-indigo-400" />
              <span>✦ Thinking... ProjectForge AI is analyzing your technical profile</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
              Synthesizing problem statements, required technical stack, and milestone roadmaps.
            </p>
          </div>
        )}

        {/* Results Stream */}
        {!generating && generatedIdeas.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[var(--text-dim)] border-b border-[var(--border-subtle)] pb-2">
              <span className="font-semibold text-[var(--text-main)]">Generated Proposals ({generatedIdeas.length})</span>
              <span>1-click adopt to launch project</span>
            </div>

            {generatedIdeas.map((idea, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                        {idea.difficulty}
                      </span>
                      {idea.estimatedDuration && (
                        <span className="text-[10px] font-mono text-[var(--text-dim)] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {idea.estimatedDuration}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-[var(--text-main)]">{idea.title}</h4>
                  </div>

                  <Button
                    onClick={() => handleAdopt(idea, idx)}
                    variant="primary"
                    size="sm"
                    loading={adoptingId === String(idx)}
                    icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  >
                    Save & Launch
                  </Button>
                </div>

                <div className="text-xs text-[var(--text-muted)] space-y-1.5">
                  <p className="text-slate-300 leading-relaxed">{idea.description}</p>
                  {idea.reason && (
                    <p className="text-indigo-300/80 bg-indigo-500/5 p-2 rounded-lg border border-indigo-500/10 text-[11px]">
                      <span className="font-semibold">Why this fits: </span> {idea.reason}
                    </p>
                  )}
                </div>

                {/* Stack */}
                {idea.technologies && idea.technologies.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[var(--border-subtle)] text-xs">
                    <span className="text-[var(--text-dim)] text-[11px] font-mono">Stack:</span>
                    {idea.technologies.map((tech: string) => (
                      <span key={tech} className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px] border border-white/5">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};
