import React, { useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ProjectForgeLogo } from '../../components/ui/ProjectForgeLogo';
import {
  GraduationCap,
  BookOpen,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export const LoginPage: React.FC = () => {
  const { login, demoLogin } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

  const isExpired = searchParams.get('expired') === 'true';
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login({ email: email.trim().toLowerCase(), password });
      toast.success('Welcome back to ProjectForge AI!');
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role: 'student' | 'faculty' | 'admin') => {
    setDemoLoading(role);
    try {
      await demoLogin(role);
      toast.success(`Signed in as ${role.toUpperCase()} demo user!`);
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error(err.message || 'Demo login failed');
    } finally {
      setDemoLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#080A12] text-[#F8FAFC] flex flex-col lg:flex-row">
      {/* ============================================================
          LEFT COLUMN: PROJECTFORGE BRANDING & PRODUCT IDENTITY
          ============================================================ */}
      <div className="relative w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[rgba(255,255,255,0.06)] bg-[#0A0D18] overflow-hidden">
        {/* Subtle ambient indigo & violet backdrop light */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Top: Logo */}
        <div className="relative z-10">
          <Link to="/" className="inline-block">
            <ProjectForgeLogo size="lg" subtitle="Project Lifecycle Platform" />
          </Link>
        </div>

        {/* Center: Editorial Hero Typography */}
        <div className="relative z-10 my-12 lg:my-0 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-300 text-xs font-mono font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>IDEATE. COLLABORATE. BUILD.</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Turn your next idea into a project worth building.
          </h1>

          <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed font-normal">
            An AI-powered project lifecycle platform for students. Discover curated architectures, find complementary teammates, and deliver capstones with confidence.
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

        {/* Bottom: Quiet footer note */}
        <div className="relative z-10 text-xs font-mono text-[var(--text-dim)] pt-4">
          © {new Date().getFullYear()} ProjectForge AI · Academic Project Lifecycle
        </div>
      </div>

      {/* ============================================================
          RIGHT COLUMN: AUTHENTICATION FORM & DEMO SANDBOX
          ============================================================ */}
      <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-[#080A12] relative">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-md mx-auto space-y-8"
        >
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Sign in to ProjectForge
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Enter your credentials or choose a 1-click sandbox role to preview.
            </p>
          </div>

          {isExpired && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Your session has expired. Please sign in again.</span>
            </div>
          )}

          {/* 1-Click Sandbox Switcher */}
          <div className="p-4 rounded-2xl bg-[#10131F] border border-indigo-500/20 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                1-Click Demo Sandbox
              </span>
              <span className="text-[10px] font-mono text-[var(--text-dim)]">Instant login</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemo('student')}
                disabled={Boolean(demoLoading)}
                className="flex flex-col items-center p-3 rounded-xl bg-[#141824] hover:bg-indigo-600/20 border border-[var(--border-subtle)] hover:border-indigo-500/40 transition-all text-center cursor-pointer group"
              >
                <GraduationCap className="w-4 h-4 text-indigo-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white">Student</span>
                <span className="text-[10px] text-zinc-500 mt-0.5">Rishit</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemo('faculty')}
                disabled={Boolean(demoLoading)}
                className="flex flex-col items-center p-3 rounded-xl bg-[#141824] hover:bg-violet-600/20 border border-[var(--border-subtle)] hover:border-violet-500/40 transition-all text-center cursor-pointer group"
              >
                <BookOpen className="w-4 h-4 text-violet-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white">Faculty</span>
                <span className="text-[10px] text-zinc-500 mt-0.5">Dr. Elena</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemo('admin')}
                disabled={Boolean(demoLoading)}
                className="flex flex-col items-center p-3 rounded-xl bg-[#141824] hover:bg-rose-600/20 border border-[var(--border-subtle)] hover:border-rose-500/40 transition-all text-center cursor-pointer group"
              >
                <ShieldCheck className="w-4 h-4 text-rose-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white">Admin</span>
                <span className="text-[10px] text-zinc-500 mt-0.5">Dean</span>
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-[var(--border-subtle)]" />
            <span className="absolute bg-[#080A12] px-3 text-[11px] font-mono text-[var(--text-dim)] uppercase">
              Or with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Academic Email"
              placeholder="student@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[var(--text-muted)]">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 sm:h-12 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] px-4 pr-11 text-sm text-[var(--text-main)] placeholder:text-[var(--text-dim)] transition-all outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/15"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-zinc-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full h-12 text-sm font-semibold"
            >
              Sign In to ProjectForge
            </Button>
          </form>

          {/* Switch to Register */}
          <div className="text-center pt-2 text-xs text-[var(--text-muted)]">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold">
              Create student account →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
