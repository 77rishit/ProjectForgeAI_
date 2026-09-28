import React, { useState } from 'react';
import {
  User,
  Palette,
  Bell,
  Lock,
  Shield,
  Check,
  Save,
  Moon,
  Sun
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';

export const SettingsPage: React.FC = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'notifications' | 'privacy' | 'security'>('profile');

  // Profile Form
  const [name, setName] = useState(user?.name || '');
  const [department, setDepartment] = useState(user?.department || 'Computer Science & Engineering');
  const [semester, setSemester] = useState(String(user?.semester || 'Semester 6'));
  const [bio, setBio] = useState(user?.bio || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Security Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);

  // Preferences toggles initialized from user record
  const [emailDigest, setEmailDigest] = useState(user?.preferences?.emailDigest ?? true);
  const [sprintAlerts, setSprintAlerts] = useState(user?.preferences?.sprintAlerts ?? true);
  const [teammateInvites, setTeammateInvites] = useState(user?.preferences?.teammateInvites ?? true);
  const [profileVisible, setProfileVisible] = useState(user?.preferences?.profileVisible ?? user?.lookingForTeam ?? true);
  const [savingPrefs, setSavingPrefs] = useState(false);

  // Sync state if user reloads/changes
  React.useEffect(() => {
    if (user) {
      setName(user.name || '');
      setDepartment(user.department || 'Computer Science & Engineering');
      setSemester(String(user.semester || 'Semester 6'));
      setBio(user.bio || '');
      if (user.preferences) {
        setEmailDigest(user.preferences.emailDigest ?? true);
        setSprintAlerts(user.preferences.sprintAlerts ?? true);
        setTeammateInvites(user.preferences.teammateInvites ?? true);
        setProfileVisible(user.preferences.profileVisible ?? user.lookingForTeam ?? true);
      }
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile({
        name: name.trim(),
        department: department.trim(),
        semester: semester.trim(),
        bio: bio.trim()
      });
      toast.success('Settings updated successfully in database!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile settings');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleTogglePreference = async (key: 'emailDigest' | 'sprintAlerts' | 'teammateInvites', newValue: boolean) => {
    if (key === 'emailDigest') setEmailDigest(newValue);
    if (key === 'sprintAlerts') setSprintAlerts(newValue);
    if (key === 'teammateInvites') setTeammateInvites(newValue);

    try {
      const updatedPrefs = {
        ...user?.preferences,
        emailDigest: key === 'emailDigest' ? newValue : emailDigest,
        sprintAlerts: key === 'sprintAlerts' ? newValue : sprintAlerts,
        teammateInvites: key === 'teammateInvites' ? newValue : teammateInvites,
        profileVisible
      };
      await updateProfile({ preferences: updatedPrefs });
      toast.success('Notification preference saved');
    } catch (err) {
      toast.error('Failed to save preference');
    }
  };

  const handleTogglePrivacy = async (newValue: boolean) => {
    setProfileVisible(newValue);
    try {
      const updatedPrefs = {
        ...user?.preferences,
        profileVisible: newValue
      };
      await updateProfile({
        preferences: updatedPrefs,
        lookingForTeam: newValue
      });
      toast.success('Privacy setting saved to database');
    } catch (err) {
      toast.error('Failed to save privacy setting');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Please provide both current and new password');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setChangingPass(true);
    try {
      await changePassword({ currentPassword, newPassword });
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setChangingPass(false);
    }
  };

  const navItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'security', label: 'Security', icon: Lock }
  ] as const;

  return (
    <div className="space-y-8 max-w-5xl mx-auto w-full">
      {/* 1. EDITORIAL HEADER */}
      <PageHeader
        title="Account Settings"
        subtitle="Manage your personal workspace preferences, credentials, and notification frequencies."
      />

      {/* 2. TWO COLUMN SETTINGS COMPOSITION */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Categories (3 cols) */}
        <div className="md:col-span-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-indigo-500/12 text-indigo-300 font-semibold border-l-2 border-indigo-500 pl-3'
                    : 'text-[var(--text-muted)] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0 text-[var(--text-dim)]" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* RIGHT COLUMN: Settings Content Forms (9 cols) */}
        <div className="md:col-span-9 space-y-8">
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="space-y-1 pb-4 border-b border-[var(--border-subtle)]">
                <h3 className="text-base font-bold text-white">General Information</h3>
                <p className="text-xs text-[var(--text-muted)]">Your basic student profile details displayed to teammates and faculty.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rishit Patel"
                />

                <Input
                  label="Academic Department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Computer Science & Engineering"
                />

                <Input
                  label="Semester / Year"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  placeholder="Semester 6"
                />

                <Input
                  label="Email Address"
                  value={user?.email || ''}
                  disabled
                  helperText="Primary academic email managed by institutional SSO."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-muted)]">Short Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] text-xs sm:text-sm text-[var(--text-main)] placeholder:text-[var(--text-dim)] outline-none focus:border-indigo-500/50"
                  placeholder="Briefly describe your core technical passions, recent hackathons, or capstone interests..."
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" loading={savingProfile} variant="primary" icon={<Save className="w-4 h-4" />}>
                  Save Changes to Database
                </Button>
              </div>
            </form>
          )}

          {/* TAB 2: APPEARANCE */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div className="space-y-1 pb-4 border-b border-[var(--border-subtle)]">
                <h3 className="text-base font-bold text-white">Interface Theme</h3>
                <p className="text-xs text-[var(--text-muted)]">Customize the look and feel of your ProjectForge workspace canvas.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => {
                    if (theme !== 'dark') toggleTheme();
                    updateProfile({ preferences: { ...user?.preferences, theme: 'dark' } }).catch(() => {});
                  }}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    theme === 'dark' ? 'border-indigo-500 bg-[#10131F]' : 'border-[var(--border-subtle)] bg-[#0B0D16] opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4 text-indigo-400" />
                      <span className="text-sm font-bold text-white">Midnight Charcoal</span>
                    </div>
                    {theme === 'dark' && <Check className="w-4 h-4 text-indigo-400" />}
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">
                    Deep navy background (#080A12) with electric indigo accents and high contrast typography.
                  </p>
                </div>

                <div
                  onClick={() => {
                    if (theme !== 'light') toggleTheme();
                    updateProfile({ preferences: { ...user?.preferences, theme: 'light' } }).catch(() => {});
                  }}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    theme === 'light' ? 'border-indigo-500 bg-white' : 'border-[var(--border-subtle)] bg-[#0B0D16] opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-bold text-white">Daylight</span>
                    </div>
                    {theme === 'light' && <Check className="w-4 h-4 text-indigo-400" />}
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">
                    Crisp bright theme for daytime reading and presentation mode.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="space-y-1 pb-4 border-b border-[var(--border-subtle)]">
                <h3 className="text-base font-bold text-white">Notification Frequencies</h3>
                <p className="text-xs text-[var(--text-muted)]">Choose what triggers push and email notifications. Settings save automatically to your profile.</p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    key: 'emailDigest' as const,
                    title: 'Weekly Sprint Digest',
                    desc: 'Receive a summary every Monday with upcoming milestone target dates.',
                    state: emailDigest
                  },
                  {
                    key: 'sprintAlerts' as const,
                    title: 'Task Assignment & Deadlines',
                    desc: 'Notify me when tasks are assigned or due within 24 hours.',
                    state: sprintAlerts
                  },
                  {
                    key: 'teammateInvites' as const,
                    title: 'Teammate Match Invites',
                    desc: 'Get notified immediately when peers send collaborative invitations.',
                    state: teammateInvites
                  }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[#10131F] flex items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">{item.desc}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTogglePreference(item.key, !item.state)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                        item.state ? 'bg-indigo-600' : 'bg-zinc-800'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                          item.state ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PRIVACY */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="space-y-1 pb-4 border-b border-[var(--border-subtle)]">
                <h3 className="text-base font-bold text-white">Directory & Project Privacy</h3>
                <p className="text-xs text-[var(--text-muted)]">Control your visibility in the student collaborator directory.</p>
              </div>

              <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[#10131F] flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Looking for Teammates</h4>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Allow other student founders and team leads to discover you in matchmaking.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleTogglePrivacy(!profileVisible)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    profileVisible ? 'bg-indigo-600' : 'bg-zinc-800'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      profileVisible ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: SECURITY */}
          {activeTab === 'security' && (
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="space-y-1 pb-4 border-b border-[var(--border-subtle)]">
                <h3 className="text-base font-bold text-white">Change Password</h3>
                <p className="text-xs text-[var(--text-muted)]">Update your account credentials to keep your project artifacts safe.</p>
              </div>

              <div className="space-y-4 max-w-md">
                <Input
                  type="password"
                  label="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                />

                <Input
                  type="password"
                  label="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                />

                <Input
                  type="password"
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" loading={changingPass} variant="primary">
                  Update Password
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
