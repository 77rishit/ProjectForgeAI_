import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ProjectForgeLogo } from '../../components/ui/ProjectForgeLogo';
import {
  GraduationCap,
  BookOpen,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { UserRole } from '../../types';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('student');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [semester, setSemester] = useState('Semester 5');
  const [loading, setLoading] = useState(false);

  const departments = [
    'Computer Science & Engineering',
    'Data Science & Artificial Intelligence',
    'Electrical & Computer Engineering',
    'Design & Human-Computer Interaction',
    'Information Technology'
  ];

  const semesters = [
    'Semester 1', 'Semester 2', 'Semester 3', 'Semester 4',
    'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8', 'Graduate / Masters'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.error('Please complete all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
        department,
        semester,
        skills: ['React', 'TypeScript', 'Node.js', 'Python'],
        interests: ['AI Agents', 'Distributed Systems'],
        availabilityHours: 15
      });

      toast.success('Account created! Welcome to ProjectForge AI.');
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080A12] text-[#F8FAFC] flex flex-col lg:flex-row">
      {/* ============================================================
          LEFT COLUMN: BRANDING & EDITORIAL PHILOSOPHY
          ============================================================ */}
      <div className="relative w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[rgba(255,255,255,0.06)] bg-[#0A0D18] overflow-hidden">
        {/* Ambient indigo & violet backdrop light */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Top: Logo */}
        <div className="relative z-10">
          <Link to="/" className="inline-block">
            <ProjectForgeLogo size="lg" subtitle="Project Lifecycle Platform" />
          </Link>
        </div>

        {/* Center: Hero Statement */}
        <div className="relative z-10 my-12 lg:my-0 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-300 text-xs font-mono font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>IDEATE. COLLABORATE. BUILD.</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Build projects that define your career.
          </h1>

          <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed font-normal">
            Join thousands of student engineers and creators collaborating on real-world projects, building production skills, and demonstrating mastery to advisors and employers.
          </p>

          <div className="space-y-3 pt-2">
            {[
              'Autonomous architectural proposal discovery & roadmaps',
              'Multi-factor teammate compatibility matching',
              'Structured sprint milestones with faculty sign-off'
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-xs sm:text-sm text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 text-xs font-mono text-[var(--text-dim)] pt-4">
          © {new Date().getFullYear()} ProjectForge AI · Academic Project Lifecycle
        </div>
      </div>

      {/* ============================================================
          RIGHT COLUMN: REGISTRATION FORM
          ============================================================ */}
      <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-[#080A12] relative overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-md mx-auto space-y-6 py-8"
        >
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Create an account
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Set up your profile to start finding projects and teammates.
            </p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#10131F] border border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                role === 'student'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('faculty')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                role === 'faculty'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Faculty</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              label="Full Name"
              placeholder="Rishit Patel"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              type="email"
              label="Academic Email"
              placeholder="student@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-muted)]">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full h-11 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3 text-xs sm:text-sm text-[var(--text-main)] outline-none focus:border-indigo-500/50"
                >
                  {departments.map((d) => (
                    <option key={d} value={d} className="bg-[#10131F] text-white">
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-muted)]">Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full h-11 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3 text-xs sm:text-sm text-[var(--text-main)] outline-none focus:border-indigo-500/50"
                >
                  {semesters.map((s) => (
                    <option key={s} value={s} className="bg-[#10131F] text-white">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-muted)]">Password</label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3 pr-10 text-xs sm:text-sm text-[var(--text-main)] outline-none focus:border-indigo-500/50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 text-zinc-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-muted)]">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-11 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3 text-xs sm:text-sm text-[var(--text-main)] outline-none focus:border-indigo-500/50"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full h-12 text-sm font-semibold mt-2"
            >
              Create Account
            </Button>
          </form>

          <div className="text-center pt-2 text-xs text-[var(--text-muted)]">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold">
              Sign in →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
