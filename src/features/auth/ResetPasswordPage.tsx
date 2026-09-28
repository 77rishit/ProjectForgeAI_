import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ProjectForgeLogo } from '../../components/ui/ProjectForgeLogo';
import { Lock, KeyRound, Check, X, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export const ResetPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const queryToken = searchParams.get('token');
    if (queryToken) {
      setToken(queryToken);
    }
  }, [searchParams]);

  const hasMinLength = newPassword.length >= 6;
  const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token.trim()) {
      toast.error('Please provide a valid password reset token.');
      return;
    }

    if (!hasMinLength) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    if (!passwordsMatch) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword({
        token: token.trim(),
        newPassword
      });
      toast.success('Your password has been successfully reset!');
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      toast.error(err.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080A12] text-[#F8FAFC] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[500px] bg-gradient-to-tr from-indigo-600/10 via-violet-600/5 to-transparent blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md relative z-10 space-y-8"
      >
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <ProjectForgeLogo size="lg" />
          </Link>
          <h2 className="text-2xl font-extrabold text-white tracking-tight pt-2">Set New Password</h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-xs mx-auto font-normal">
            Choose a strong password for your ProjectForge AI account.
          </p>
        </div>

        <div className="p-7 sm:p-9 rounded-3xl border border-[var(--border-subtle)] bg-[#10131F] shadow-2xl backdrop-blur-xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Reset Security Token"
              placeholder="Paste token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              icon={<KeyRound className="w-4 h-4 text-indigo-400" />}
              required
              helperText={searchParams.get('token') ? 'Token pre-filled from recovery link' : undefined}
            />

            <div className="relative">
              <Input
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter at least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-zinc-500 hover:text-white"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Input
              label="Confirm New Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              required
            />

            {/* Validation pills */}
            <div className="p-3 rounded-xl bg-[#0B0D16] border border-[var(--border-subtle)] space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                {hasMinLength ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <X className="w-3.5 h-3.5 text-zinc-600" />
                )}
                <span className={hasMinLength ? 'text-emerald-400 font-medium' : 'text-zinc-500'}>
                  At least 6 characters
                </span>
              </div>
              <div className="flex items-center gap-2">
                {passwordsMatch ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <X className="w-3.5 h-3.5 text-zinc-600" />
                )}
                <span className={passwordsMatch ? 'text-emerald-400 font-medium' : 'text-zinc-500'}>
                  Passwords match
                </span>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={!hasMinLength || !passwordsMatch || !token}
              className="w-full h-12 text-sm font-semibold mt-2"
            >
              Reset Password & Sign In
            </Button>
          </form>

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
