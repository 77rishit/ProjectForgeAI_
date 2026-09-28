import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ProjectForgeLogo } from '../../components/ui/ProjectForgeLogo';
import { Mail, ArrowLeft, KeyRound, CheckCircle2, Copy, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export const ForgotPasswordPage: React.FC = () => {
  const { forgotPassword } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your university email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPassword(email);
      setSubmitted(true);
      if (res.resetUrl) {
        setResetUrl(res.resetUrl);
      }
      if (res.resetToken) {
        setResetToken(res.resetToken);
      }
      toast.success('Password recovery instructions dispatched!');
    } catch (err: any) {
      toast.error(err.message || 'Unable to process password reset request.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Reset link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-[#080A12] text-[#F8FAFC] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[600px] h-[500px] bg-gradient-to-tr from-indigo-600/10 via-violet-600/5 to-transparent blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md relative z-10 space-y-8"
      >
        {/* Brand header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <ProjectForgeLogo size="lg" />
          </Link>
          <h2 className="text-2xl font-extrabold text-white tracking-tight pt-2">Reset Password</h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-xs mx-auto font-normal">
            Enter your university email to receive recovery instructions.
          </p>
        </div>

        {/* Card */}
        <div className="p-7 sm:p-9 rounded-3xl border border-[var(--border-subtle)] bg-[#10131F] shadow-2xl backdrop-blur-xl space-y-6">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-4 rounded-xl bg-[#0B0D16] border border-indigo-500/20 text-xs text-indigo-300/90 leading-relaxed flex items-start gap-2.5">
                <KeyRound className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>
                  Provide your registered university email. We will issue a secure, time-sensitive reset token.
                </span>
              </div>

              <Input
                label="University Email"
                type="email"
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4" />}
                required
              />

              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full h-12 text-sm font-semibold mt-2"
              >
                Send Reset Instructions
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-1" />
                <h3 className="font-bold text-sm text-white">Reset Instructions Dispatched</h3>
                <p className="text-xs text-[var(--text-muted)]">
                  We processed your recovery request for <span className="text-white font-semibold">{email}</span>.
                </p>
              </div>

              {resetUrl && (
                <div className="p-4 rounded-xl bg-[#0B0D16] border border-[var(--border-subtle)] space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-muted)]">
                    <span>Direct Access Reset Link</span>
                    <span className="text-[10px] text-emerald-400 font-mono">1h Expiry</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#080A12] border border-white/5 text-xs font-mono text-indigo-300 break-all select-all">
                    {resetUrl}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => copyToClipboard(resetUrl)}
                      className="flex-1 text-xs"
                    >
                      <Copy className="w-3.5 h-3.5 mr-1" />
                      Copy Link
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(`/reset-password?token=${resetToken}`)}
                      className="flex-1 text-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5 mr-1" />
                      Reset Now
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="pt-2 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
