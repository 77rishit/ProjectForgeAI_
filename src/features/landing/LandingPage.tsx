import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Users,
  Layers,
  Cpu,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Brain,
  Code2,
  GitBranch,
  Clock,
  Compass,
  Zap,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { ProjectForgeLogo } from '../../components/ui/ProjectForgeLogo';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#080A12] text-[#F8FAFC] selection:bg-indigo-500/25 selection:text-white overflow-hidden">
      {/* 1. PUBLIC NAVBAR */}
      <header className="sticky top-0 z-50 h-20 w-full border-b border-[rgba(255,255,255,0.07)] bg-[#080A12]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto h-full px-6 sm:px-8 lg:px-12 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <ProjectForgeLogo size="md" subtitle="Academic Intelligence Platform" />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#94A3B8]">
            <a href="#discovery" className="hover:text-white transition-colors">
              Idea Discovery
            </a>
            <a href="#matching" className="hover:text-white transition-colors">
              Team Matching
            </a>
            <a href="#lifecycle" className="hover:text-white transition-colors">
              Project Lifecycle
            </a>
            <a href="#faculty" className="hover:text-white transition-colors">
              Faculty Portal
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-[#94A3B8] hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-24 pb-32 sm:pt-32 sm:pb-40 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        {/* Subtle background ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-indigo-600/10 via-violet-600/10 to-transparent blur-[120px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center relative z-10">
          {/* Left: Editorial Headline */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-mono font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>IDEATE. COLLABORATE. BUILD.</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              Turn your next idea into a project <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-200">worth building.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#94A3B8] leading-relaxed max-w-2xl font-normal">
              ProjectForge AI helps students discover ideas, find compatible teammates, and manage projects from initial concept through faculty sign-off.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base shadow-xl shadow-indigo-600/25 active:scale-[0.98] transition-all"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#10131F] hover:bg-[#141725] text-white font-semibold text-base transition-colors"
              >
                <Compass className="w-4 h-4 text-indigo-400" />
                <span>Explore Live Demo</span>
              </Link>
            </div>

            {/* Social proof metric row */}
            <div className="pt-6 border-t border-[rgba(255,255,255,0.07)] flex flex-wrap items-center gap-8 text-sm text-[#94A3B8]">
              <div>
                <span className="font-bold text-white font-mono text-base">500+</span> Academic Projects
              </div>
              <div className="w-1 h-1 rounded-full bg-zinc-700" />
              <div>
                <span className="font-bold text-white font-mono text-base">94%</span> Match Compatibility
              </div>
              <div className="w-1 h-1 rounded-full bg-zinc-700" />
              <div>
                <span className="font-bold text-white font-mono text-base">12+</span> Partner Universities
              </div>
            </div>
          </div>

          {/* Right: Abstract Project Workspace Visual (Original 3D/Glass UI Canvas) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl border border-[rgba(255,255,255,0.1)] bg-gradient-to-b from-[#10131F] to-[#0B0D16] p-6 shadow-2xl backdrop-blur-xl space-y-6">
              {/* Header simulation */}
              <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.07)]">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-[#64748B] ml-2">workspace.canvas.tsx</span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Sprint Active
                </span>
              </div>

              {/* Featured Workspace Card inside visual */}
              <div className="p-5 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#141725] space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-indigo-400 uppercase font-semibold">Active Capstone</span>
                    <h4 className="text-base font-bold text-white mt-0.5">ProjectForge AI</h4>
                  </div>
                  <span className="text-xl font-bold font-mono text-indigo-400">68%</span>
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  AI-powered project lifecycle platform for university capstones.
                </p>

                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                  <div className="w-[68%] h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                </div>

                <div className="flex items-center justify-between text-xs text-[#94A3B8] pt-1">
                  <span>4 Collaborators</span>
                  <span className="font-mono text-zinc-400">Due Sep 30</span>
                </div>
              </div>

              {/* Floating AI Recommendation Node */}
              <motion.div
                initial={{ y: 8 }}
                animate={{ y: -6 }}
                transition={{ duration: 3.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                className="p-4 rounded-xl border border-indigo-500/30 bg-[#10131F]/90 backdrop-blur-md shadow-xl space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-xs font-semibold text-white">AI Team Match</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    96% Synergy
                  </span>
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-bold text-xs text-indigo-300">
                    RP
                  </div>
                  <div className="text-xs">
                    <div className="font-semibold text-white">Rishit Patel</div>
                    <div className="text-[11px] text-[#94A3B8]">Frontend & Architecture · CS Sem 5</div>
                  </div>
                </div>
              </motion.div>

              {/* Clean Timeline Mini */}
              <div className="pl-3 relative before:absolute before:left-1 before:top-1.5 before:bottom-1.5 before:w-[1px] before:bg-white/10 space-y-2.5 text-xs">
                <div className="relative flex items-center justify-between">
                  <div className="absolute -left-[11px] w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-[#0B0D16]" />
                  <span className="text-white font-medium">Sprint 3: Milestone Review</span>
                  <span className="font-mono text-[10px] text-indigo-400">TODAY</span>
                </div>
                <div className="relative flex items-center justify-between">
                  <div className="absolute -left-[11px] w-2 h-2 rounded-full bg-zinc-600 ring-2 ring-[#0B0D16]" />
                  <span className="text-[#94A3B8]">Deploy Sandbox Demo</span>
                  <span className="font-mono text-[10px] text-zinc-500">SEP 29</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE PROBLEM SECTION */}
      <section className="py-24 sm:py-32 border-t border-[rgba(255,255,255,0.07)] bg-[#0B0D16]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-3xl space-y-4 mb-16">
            <span className="text-xs font-mono font-bold tracking-wider text-indigo-400 uppercase">
              THE ACADEMIC DILEMMA
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Why student projects struggle before they even write code.
            </h2>
            <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed">
              Traditional academic workflows isolate students into superficial brainstorming, random partner selection, and bureaucratic manual milestone tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#10131F] space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Generic, Outdated Ideas</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Students resort to repetitive CRUD clones because existing portals offer no intelligent technical roadmaps or industry relevance.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#10131F] space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Unbalanced Teammates</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Pairing without multi-factor compatibility creates skill deficits, mismatched availability, and unfair burden on individual contributors.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#10131F] space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Faculty Review Bottlenecks</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Professors are overwhelmed with hundreds of submissions, turning milestone approvals into delayed email exchanges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. AI PROJECT DISCOVERY SECTION */}
      <section id="discovery" className="py-24 sm:py-32 border-t border-[rgba(255,255,255,0.07)]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono font-bold tracking-wider text-indigo-400 uppercase">
                ✦ AI-POWERED DISCOVERY
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Curated project proposals engineered for modern tech stacks.
              </h2>
              <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed">
                Never start from a blank page. ProjectForge analyzes your skills, curriculum requirements, and interest profile to generate actionable architectural roadmaps.
              </p>

              <ul className="space-y-3.5 pt-2 text-sm text-[#94A3B8]">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Full-stack architecture blueprints with system prompts & schema definitions</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Difficulty calibrated to semester level (Beginner, Intermediate, Advanced)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Integrated faculty-approved rubric compatibility</span>
                </li>
              </ul>

              <div className="pt-4">
                <Link
                  to="/discovery"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  <span>Explore Idea Directory</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right: Proposal Preview Card */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[#10131F] p-8 space-y-6 shadow-2xl">
                <div className="flex items-start justify-between">
                  <span className="px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-semibold">
                    ✨ 94% Compatibility Match
                  </span>
                  <span className="text-xs font-mono text-[#64748B]">6-8 weeks</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Smart Campus Assistant</h3>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    Build a contextual multi-agent campus assistant using vector retrieval, event schedules, and role-based permissions.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {['React', 'Node.js', 'PostgreSQL', 'LangChain', 'Vector DB'].map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg bg-[#141725] border border-[rgba(255,255,255,0.07)] text-xs font-mono text-[#94A3B8]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-[#0B0D16] border border-[rgba(255,255,255,0.07)] text-xs text-[#94A3B8] italic">
                  "Matches your verified proficiency in React and Node.js with high capstone scoring potential."
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SMART TEAM MATCHING SECTION */}
      <section id="matching" className="py-24 sm:py-32 border-t border-[rgba(255,255,255,0.07)] bg-[#0B0D16]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-3xl space-y-4 mb-16">
            <span className="text-xs font-mono font-bold tracking-wider text-indigo-400 uppercase">
              ✦ SMART TEAM MATCHING
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Discover collaborators whose skills complement yours.
            </h2>
            <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed">
              Our multi-factor matching algorithm weights verified skill complementary, weekly availability hours, and shared domain interests.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Priya Sharma',
                role: 'Backend & Cloud Engineer',
                dept: 'Computer Science · Sem 6',
                score: 96,
                highlight: 'Complements your React skills with Node.js and PostgreSQL proficiency.',
                skills: ['Node.js', 'PostgreSQL', 'Docker', 'Go']
              },
              {
                name: 'Kavya Verma',
                role: 'AI / Machine Learning Engineer',
                dept: 'Data Science & AI · Sem 6',
                score: 92,
                highlight: 'Brings deep PyTorch knowledge to match your full-stack infrastructure.',
                skills: ['Python', 'PyTorch', 'FastAPI', 'MLOps']
              },
              {
                name: 'Arjun Mehta',
                role: 'Product Designer & UI Engineer',
                dept: 'HCI & Design · Sem 5',
                score: 89,
                highlight: 'Expert in design tokens and Figma-to-code component systems.',
                skills: ['Figma', 'Tailwind', 'UX Design', 'TypeScript']
              }
            ].map((peer, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#10131F] hover:border-indigo-500/35 transition-all space-y-5"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-300 text-sm">
                    {peer.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <span className="text-sm font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    {peer.score}% Match
                  </span>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-white">{peer.name}</h4>
                  <div className="text-xs text-indigo-400 font-medium">{peer.role}</div>
                  <div className="text-xs text-[#64748B] mt-0.5">{peer.dept}</div>
                </div>

                <p className="text-xs text-[#94A3B8] leading-relaxed italic bg-[#0B0D16] p-3 rounded-xl border border-[rgba(255,255,255,0.05)]">
                  "{peer.highlight}"
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {peer.skills.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-md bg-[#141725] text-[11px] font-mono text-[#94A3B8]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PROJECT LIFECYCLE SECTION */}
      <section id="lifecycle" className="py-24 sm:py-32 border-t border-[rgba(255,255,255,0.07)]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-3xl space-y-4 mb-20">
            <span className="text-xs font-mono font-bold tracking-wider text-indigo-400 uppercase">
              ✦ COMPLETE LIFECYCLE
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              From first brainstorm to formal defense.
            </h2>
            <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed">
              Every stage of your project is mapped into structured milestones with deliverable checklists, real-time code links, and automated rubric grading.
            </p>
          </div>

          {/* Timeline Process Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { step: '01', title: 'Ideate', desc: 'Discover AI proposals & refine architecture.' },
              { step: '02', title: 'Assemble', desc: 'Find complementary teammates & assign roles.' },
              { step: '03', title: 'Sprint', desc: 'Execute sprint tasks on modern Kanban boards.' },
              { step: '04', title: 'Review', desc: 'Submit deliverables for faculty rubric evaluation.' },
              { step: '05', title: 'Defend', desc: 'Generate verified project portfolio & demo.' }
            ].map((st, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#10131F] space-y-3 relative group"
              >
                <div className="text-2xl font-mono font-extrabold text-indigo-400/40 group-hover:text-indigo-400 transition-colors">
                  {st.step}
                </div>
                <h4 className="text-base font-bold text-white">{st.title}</h4>
                <p className="text-xs text-[#94A3B8] leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FACULTY MONITORING SECTION */}
      <section id="faculty" className="py-24 sm:py-32 border-t border-[rgba(255,255,255,0.07)] bg-[#0B0D16]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono font-bold tracking-wider text-indigo-400 uppercase">
                ✦ FACULTY EXPERIENCE
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Modern cohort oversight, not college ERP software.
              </h2>
              <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed">
                Empower advisors with instant visibility into project health scores, stalled sprint tasks, and objective AI-assisted rubric grading.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#10131F]">
                  <div className="text-2xl font-bold font-mono text-indigo-400">1-Click</div>
                  <div className="text-xs text-[#94A3B8] mt-1">AI Rubric Assessments</div>
                </div>
                <div className="p-4 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#10131F]">
                  <div className="text-2xl font-bold font-mono text-emerald-400">Real-Time</div>
                  <div className="text-xs text-[#94A3B8] mt-1">Health Score Tracking</div>
                </div>
              </div>
            </div>

            {/* Right: Faculty Evaluation Mock */}
            <div className="lg:col-span-6">
              <div className="p-8 rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[#10131F] space-y-5 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.07)]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-semibold text-white">Milestone Review Portal</span>
                  </div>
                  <span className="text-xs font-mono text-emerald-400">Ready for Grade</span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#94A3B8]">Technical Execution</span>
                    <span className="font-mono font-bold text-white">9 / 10</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-zinc-800">
                    <div className="w-[90%] h-full bg-indigo-500 rounded-full" />
                  </div>

                  <div className="flex justify-between text-xs pt-1">
                    <span className="text-[#94A3B8]">Architecture Innovation</span>
                    <span className="font-mono font-bold text-white">9.5 / 10</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-zinc-800">
                    <div className="w-[95%] h-full bg-violet-500 rounded-full" />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0B0D16] border border-[rgba(255,255,255,0.07)] text-xs text-[#94A3B8] italic">
                  "Exemplary implementation of JWT guards and asynchronous matching pipelines."
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="py-24 sm:py-32 border-t border-[rgba(255,255,255,0.07)] relative">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center space-y-8 relative z-10">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
            Ready to build a project that stands out?
          </h2>
          <p className="text-base sm:text-xl text-[#94A3B8] max-w-2xl mx-auto">
            Join students and faculty across leading computer science and engineering programs using ProjectForge AI.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base shadow-xl shadow-indigo-600/25 active:scale-[0.98] transition-all"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#10131F] hover:bg-[#141725] text-white font-semibold text-base transition-colors"
            >
              <span>Instant Demo Access</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="border-t border-[rgba(255,255,255,0.07)] py-12 px-6 sm:px-8 lg:px-12 bg-[#06070E] text-xs text-[#64748B]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <ProjectForgeLogo size="sm" showText={false} />
            <span>© {new Date().getFullYear()} ProjectForge AI. Academic Intelligence Platform.</span>
          </div>

          <div className="flex items-center gap-6 text-[#94A3B8]">
            <Link to="/login" className="hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="hover:text-white transition-colors">
              Register
            </Link>
            <a href="#discovery" className="hover:text-white transition-colors">
              Features
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
