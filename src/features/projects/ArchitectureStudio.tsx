import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { projectService } from '../../services/projectService';
import { aiService } from '../../services/aiService';
import { Project, ArchitectureBlueprint } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Tabs } from '../../components/ui/Tabs';
import {
  Sparkles,
  Cpu,
  Layers,
  Terminal,
  Database,
  Copy,
  Check,
  Download,
  Bot,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ArchitectureStudioProps {
  project: Project;
  onProjectUpdated?: () => void;
}

export const ArchitectureStudio: React.FC<ArchitectureStudioProps> = ({
  project,
  onProjectUpdated
}) => {
  const toast = useToast();

  const [blueprint, setBlueprint] = useState<ArchitectureBlueprint>(
    project.architectureBlueprint || {
      title: project.title,
      summary: `Automated architecture blueprint synthesized for ${project.title}.`,
      pattern: 'Plan-and-Execute + ReAct',
      model: 'Claude 3.7 Sonnet (Thinking)',
      vectorDb: 'pgvector (Hybrid Search)',
      systemPrompt: `You are the autonomous AI core for "${project.title}".
OPERATIONAL PRINCIPLES:
1. Deconstruct incoming tasks into deterministic DAGs.
2. Adhere to strict security fences for sandbox tool runs.
3. Validate all outputs with schema conformity checks.`,
      databaseSchema: `-- Relational & Vector Persistence Schema
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  vector vector(1536)
);`,
      agentTopology: [
        { name: 'Task Orchestrator', role: 'Decomposes complex requests into task graphs', tools: ['GraphScheduler', 'ContextAggregator'] },
        { name: 'Core Synthesizer', role: 'Executes domain-specific code and algorithm logic', tools: ['CodeSandbox', 'QueryEngine'] },
        { name: 'Quality Critic', role: 'Evaluates output integrity and flags edge-case failures', tools: ['StaticLinter', 'SecurityScanner'] }
      ],
      roadmap: [
        { phase: 'Phase 1: Ingestion & Data Modeling', description: 'Define schemas, set up CI/CD environment, and establish API contracts.' },
        { phase: 'Phase 2: Core Engine & Agent Tooling', description: 'Connect sandbox executor, query pipeline, and tool harness.' },
        { phase: 'Phase 3: Security & Verification Loop', description: 'Deploy automated test suites and rate-limiting safeguards.' },
        { phase: 'Phase 4: Telemetry & Production Hardening', description: 'Conduct stress testing, configure traces, and polish end-user UX.' }
      ],
      metrics: {
        estimatedTokens: '~3.6k tokens/turn',
        avgLatency: '1.2s response',
        complexityScore: 'High (Multi-Agent)',
        costEstimate: '$0.015 / interaction'
      }
    }
  );

  const [selectedModel, setSelectedModel] = useState(blueprint.model || 'Claude 3.7 Sonnet (Thinking)');
  const [selectedPattern, setSelectedPattern] = useState(blueprint.pattern || 'Plan-and-Execute + ReAct');
  const [selectedVectorDb, setSelectedVectorDb] = useState(blueprint.vectorDb || 'pgvector (Hybrid Search)');
  const [capabilities, setCapabilities] = useState<string[]>([
    'File System Sandbox',
    'AST Parser',
    'Self-Correction Loop'
  ]);

  const [specTab, setSpecTab] = useState<'arch' | 'prompts' | 'schema' | 'roadmap'>('arch');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const patterns = [
    { value: 'Plan-and-Execute + ReAct', label: 'Plan-and-Execute + ReAct' },
    { value: 'Corrective RAG (CRAG)', label: 'Corrective RAG (CRAG)' },
    { value: 'Hierarchical Multi-Agent Swarm', label: 'Hierarchical Multi-Agent Swarm' },
    { value: 'Event-Driven State Machine', label: 'Event-Driven State Machine' }
  ];

  const models = [
    { value: 'Claude 3.7 Sonnet (Thinking)', label: 'Claude 3.7 Sonnet (Thinking)' },
    { value: 'Gemini 2.5 Pro', label: 'Gemini 2.5 Pro' },
    { value: 'GPT-4o Realtime Audio', label: 'GPT-4o Realtime Audio' },
    { value: 'DeepSeek R1 + Claude 3.5', label: 'DeepSeek R1 + Claude 3.5' }
  ];

  const vectorDbs = [
    { value: 'pgvector (Hybrid Search)', label: 'pgvector (Hybrid Search)' },
    { value: 'Pinecone Serverless', label: 'Pinecone Serverless' },
    { value: 'Qdrant Distributed', label: 'Qdrant Distributed' },
    { value: 'Upstash Redis Vector', label: 'Upstash Redis Vector' }
  ];

  const allCapabilities = [
    'File System Sandbox',
    'Terminal Sandbox',
    'AST Parser',
    'Self-Correction Loop',
    'Web Retrieval',
    'Vision OCR',
    'Citation Graph',
    'Sub-300ms Audio Stream',
    'Function Calling',
    'Semantic Caching'
  ];

  const toggleCapability = (cap: string) => {
    setCapabilities((prev) =>
      prev.includes(cap) ? prev.filter((c) => c !== cap) : [...prev, cap]
    );
  };

  const handleSynthesize = async () => {
    setIsSynthesizing(true);
    try {
      const generated = await aiService.synthesizeArchitecture({
        title: project.title,
        objective: project.description,
        pattern: selectedPattern,
        model: selectedModel,
        vectorDb: selectedVectorDb,
        capabilities
      });

      setBlueprint(generated);

      // Save to project in backend
      await projectService.updateProject(project._id, {
        architectureBlueprint: generated as any
      });

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });

      toast.success('Architecture blueprint synthesized and saved to project!');
      if (onProjectUpdated) onProjectUpdated();
    } catch (err: any) {
      toast.error(err.message || 'Error synthesizing architecture');
    } finally {
      setIsSynthesizing(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.info('Copied to clipboard');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Studio Header Banner */}
      <div className="p-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-[#101326] to-cyan-950/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="cyan" size="sm">Architecture Studio</Badge>
            <span className="text-xs text-white/50">Multi-Agent & Infrastructure Synthesizer</span>
          </div>
          <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <span>AI Architecture & Specification Lab</span>
          </h3>
          <p className="text-xs text-white/60 mt-1 max-w-xl">
            Synthesize production system prompts, database schemas, agent DAG topologies, and token metrics for "{project.title}".
          </p>
        </div>

        <Button
          onClick={handleSynthesize}
          variant="glow"
          size="md"
          loading={isSynthesizing}
          icon={<Sparkles className="w-4 h-4" />}
        >
          Synthesize Blueprint
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column (1 col) */}
        <div className="flex flex-col gap-4">
          <Card className="p-5 flex flex-col gap-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>Studio Parameters</span>
            </h4>

            <Select
              label="Agent Pattern"
              options={patterns}
              value={selectedPattern}
              onChange={(e) => setSelectedPattern(e.target.value)}
            />

            <Select
              label="Foundation Model"
              options={models}
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            />

            <Select
              label="Vector Persistence"
              options={vectorDbs}
              value={selectedVectorDb}
              onChange={(e) => setSelectedVectorDb(e.target.value)}
            />

            {/* Capabilities Toggles */}
            <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
              <label className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                Agent Capabilities
              </label>
              <div className="flex flex-wrap gap-1.5">
                {allCapabilities.map((cap) => {
                  const isChecked = capabilities.includes(cap);
                  return (
                    <button
                      key={cap}
                      type="button"
                      onClick={() => toggleCapability(cap)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-indigo-600/30 border-indigo-400 text-indigo-200'
                          : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}{cap}
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              onClick={handleSynthesize}
              variant="glow"
              size="sm"
              loading={isSynthesizing}
              className="w-full mt-2"
              icon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Update Architecture Blueprint
            </Button>
          </Card>

          {/* Blueprint Telemetry Metrics Card */}
          <Card className="p-5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Synthesized Performance Metrics
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-white/40 block text-[10px]">Estimated Tokens</span>
                <span className="font-mono font-bold text-cyan-300 mt-1 block">
                  {blueprint.metrics?.estimatedTokens || '~3.8k tokens'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-white/40 block text-[10px]">Avg Latency</span>
                <span className="font-mono font-bold text-emerald-300 mt-1 block">
                  {blueprint.metrics?.avgLatency || '1.2s'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-white/40 block text-[10px]">Complexity</span>
                <span className="font-mono font-bold text-purple-300 mt-1 block">
                  {blueprint.metrics?.complexityScore || 'High'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-white/40 block text-[10px]">Estimated Cost</span>
                <span className="font-mono font-bold text-amber-300 mt-1 block">
                  {blueprint.metrics?.costEstimate || '$0.015'}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Blueprint Output Display (2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Tabs
              tabs={[
                { id: 'arch', label: 'Agent Topology', icon: <Bot className="w-3.5 h-3.5" /> },
                { id: 'prompts', label: 'System Prompt', icon: <Terminal className="w-3.5 h-3.5" /> },
                { id: 'schema', label: 'Database DDL', icon: <Database className="w-3.5 h-3.5" /> },
                { id: 'roadmap', label: 'Sprint Roadmap', icon: <Layers className="w-3.5 h-3.5" /> }
              ]}
              activeTab={specTab}
              onChange={(tab) => setSpecTab(tab as any)}
            />

            <Button
              onClick={() => copyToClipboard(JSON.stringify(blueprint, null, 2), 'all')}
              variant="secondary"
              size="sm"
              icon={copiedKey === 'all' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copiedKey === 'all' ? 'Copied' : 'Export JSON'}
            </Button>
          </div>

          {/* Sub-tab 1: Agent Topology */}
          {specTab === 'arch' && (
            <div className="flex flex-col gap-4">
              <Card className="p-5">
                <h4 className="text-sm font-bold text-white mb-2">{blueprint.title}</h4>
                <p className="text-xs text-white/60 leading-relaxed">{blueprint.summary}</p>
              </Card>

              <div className="flex flex-col gap-3">
                {blueprint.agentTopology?.map((agent, i) => (
                  <Card key={i} className="p-4 bg-[#141829]/90 border-white/10">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4 text-cyan-400" />
                          <span className="font-bold text-sm text-white">{agent.name}</span>
                        </div>
                        <p className="text-xs text-white/60 mt-1">{agent.role}</p>
                      </div>

                      <div className="flex flex-wrap gap-1 justify-end max-w-xs">
                        {agent.tools?.map((tool) => (
                          <span key={tool} className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Sub-tab 2: System Prompt */}
          {specTab === 'prompts' && (
            <Card className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-white/50">Core Agent System Directive</span>
                <button
                  onClick={() => copyToClipboard(blueprint.systemPrompt, 'prompt')}
                  className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
                >
                  {copiedKey === 'prompt' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'prompt' ? 'Copied' : 'Copy Prompt'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-[#090b14] border border-white/10 text-xs font-mono text-cyan-200/90 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                {blueprint.systemPrompt}
              </pre>
            </Card>
          )}

          {/* Sub-tab 3: Database DDL */}
          {specTab === 'schema' && (
            <Card className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-white/50">Relational & Vector Schema DDL</span>
                <button
                  onClick={() => copyToClipboard(blueprint.databaseSchema, 'schema')}
                  className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
                >
                  {copiedKey === 'schema' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'schema' ? 'Copied' : 'Copy DDL'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-[#090b14] border border-white/10 text-xs font-mono text-indigo-200/90 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                {blueprint.databaseSchema}
              </pre>
            </Card>
          )}

          {/* Sub-tab 4: Sprint Roadmap */}
          {specTab === 'roadmap' && (
            <div className="flex flex-col gap-3">
              {blueprint.roadmap?.map((step, idx) => (
                <Card key={idx} className="p-4 flex items-start gap-4">
                  <div className="w-7 h-7 rounded-xl bg-indigo-500/20 text-indigo-300 font-mono font-bold flex items-center justify-center text-xs border border-indigo-500/30 shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-white">{step.phase}</h5>
                    <p className="text-xs text-white/60 mt-1 leading-relaxed">{step.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
