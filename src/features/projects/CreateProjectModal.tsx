import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { projectService } from '../../services/projectService';
import { matchingService } from '../../services/matchingService';
import { aiService } from '../../services/aiService';
import { User } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { FolderPlus, Sparkles, GitBranch, Globe } from 'lucide-react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
  onProjectCreated?: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onCreated,
  onProjectCreated
}) => {
  const toast = useToast();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [abstract, setAbstract] = useState('');
  const [category, setCategory] = useState('AI / Machine Learning');
  const [facultyMentor, setFacultyMentor] = useState('');
  const [tagsString, setTagsString] = useState('React, TypeScript, PyTorch');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [synthesizeWithAI, setSynthesizeWithAI] = useState(true);
  const [loading, setLoading] = useState(false);
  const [facultyList, setFacultyList] = useState<User[]>([]);

  const categories = [
    { value: 'AI / Machine Learning', label: 'AI / Machine Learning' },
    { value: 'Full-Stack Web3', label: 'Full-Stack Web3' },
    { value: 'Healthcare & Biotech', label: 'Healthcare & Biotech' },
    { value: 'ClimateTech & IoT', label: 'ClimateTech & IoT' },
    { value: 'Cybersecurity & Cloud', label: 'Cybersecurity & Cloud' },
    { value: 'EdTech & Social Impact', label: 'EdTech & Social Impact' },
    { value: 'Robotics & Embedded Systems', label: 'Robotics & Embedded Systems' },
    { value: 'Data Science & Analytics', label: 'Data Science & Analytics' }
  ];

  useEffect(() => {
    if (isOpen) {
      matchingService.getFacultyMentors().then(setFacultyList).catch(console.error);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error('Project title and description are required.');
      return;
    }

    setLoading(true);
    try {
      const tags = tagsString.split(',').map((t) => t.trim()).filter(Boolean);

      let blueprint = null;
      if (synthesizeWithAI) {
        try {
          blueprint = await aiService.synthesizeArchitecture({
            title,
            objective: description,
            pattern: 'Plan-and-Execute + ReAct'
          });
        } catch {
          // Soft fail for AI blueprint
        }
      }

      const project = await projectService.createProject({
        title,
        description,
        abstract: abstract || description.slice(0, 140),
        category,
        facultyMentor: facultyMentor ? (facultyMentor as any) : undefined,
        tags,
        githubUrl,
        demoUrl,
        architectureBlueprint: blueprint as any
      });

      toast.success(`Project "${project.title}" created successfully!`);
      onClose();
      if (onCreated) onCreated();
      if (onProjectCreated) onProjectCreated();
      navigate(`/projects/${project._id}`);
    } catch (err: any) {
      toast.error(err.message || 'Error creating project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-2">
          <FolderPlus className="w-5 h-5 text-indigo-400" />
          <span>Create New Academic Project</span>
        </div>
      }
      description="Initialize project workspace, assign milestones, and request faculty mentorship."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Project Title"
          placeholder="e.g. NeuroAssist: Multimodal Brain-Computer Interface"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="w-full flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-white/80 uppercase tracking-wider">
            Project Description & Objectives
          </label>
          <textarea
            rows={3}
            placeholder="Detailed overview of the engineering problem, solution architecture, and expected deliverables..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#090c17]/80 p-3.5 text-sm text-white placeholder-white/30 outline-none focus:border-indigo-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Project Category"
            options={categories}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <div className="w-full flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-white/80 uppercase tracking-wider">
              Request Faculty Mentor
            </label>
            <select
              value={facultyMentor}
              onChange={(e) => setFacultyMentor(e.target.value)}
              className="w-full appearance-none rounded-xl border border-white/10 bg-[#090c17]/80 px-3.5 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
            >
              <option value="">-- No Mentor Selected (Optional) --</option>
              {facultyList.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.name} ({f.department})
                </option>
              ))}
            </select>
          </div>
        </div>

        <Input
          label="Tech Stack Tags (Comma separated)"
          placeholder="e.g. React, Node.js, PyTorch, Docker"
          value={tagsString}
          onChange={(e) => setTagsString(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="GitHub Repository Link"
            placeholder="https://github.com/org/repo"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            icon={<GitBranch className="w-4 h-4" />}
          />

          <Input
            label="Live Demo Link (Optional)"
            placeholder="https://myproject.demo.app"
            value={demoUrl}
            onChange={(e) => setDemoUrl(e.target.value)}
            icon={<Globe className="w-4 h-4" />}
          />
        </div>

        {/* AI Blueprint Checkbox */}
        <label className="flex items-center gap-3 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/25 cursor-pointer">
          <input
            type="checkbox"
            checked={synthesizeWithAI}
            onChange={(e) => setSynthesizeWithAI(e.target.checked)}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
          />
          <div className="text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Synthesize AI Technical Architecture Blueprint</span>
            </span>
            <span className="text-white/50 block mt-0.5">
              Automatically creates system prompt, schema DDL, agent topology, and initial milestones.
            </span>
          </div>
        </label>

        <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
          <Button type="button" onClick={onClose} variant="ghost" size="md">
            Cancel
          </Button>
          <Button type="submit" variant="glow" size="md" loading={loading}>
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  );
};
