import React, { useState, useEffect } from 'react';
import {
  User,
  UserPlus,
  LogIn,
  LogOut,
  CheckCircle,
  AlertCircle,
  Key,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import {
  getCurrentUser,
  registerUser,
  loginUser,
  logoutUser,
} from '../utils/auth';

const AVATAR_COLORS = [
  '#10b981', // Emerald
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#06b6d4', // Cyan
  '#14b8a6', // Teal
];

export const AccountSettingsTab = ({ onAccountChange }) => {
  const [user, setUser] = useState(getCurrentUser());
  const [mode, setMode] = useState('register'); // 'register' | 'login'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedColor, setSelectedColor] = useState('#10b981');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim()) {
      setError('Please choose a username.');
      return;
    }
    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }
    if (!password) {
      setError('Please set a password.');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    try {
      const newUser = registerUser({
        username: username.trim(),
        email: email.trim(),
        password,
        avatarColor: selectedColor,
      });
      setUser(newUser);
      setSuccess(`Account created! Welcome, ${newUser.username}.`);
      setUsername('');
      setEmail('');
      setPassword('');
      onAccountChange?.(newUser);
    } catch (err) {
      setError(err.message || 'Failed to create account.');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim() || !password) {
      setError('Please enter both your username/email and password.');
      return;
    }

    try {
      const loggedUser = loginUser({
        usernameOrEmail: username.trim(),
        password,
      });
      setUser(loggedUser);
      setSuccess(`Logged in as ${loggedUser.username}!`);
      setUsername('');
      setPassword('');
      onAccountChange?.(loggedUser);
    } catch (err) {
      setError(err.message || 'Invalid login details.');
    }
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setSuccess('You have been logged out.');
    setError('');
    onAccountChange?.(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* If already logged in: Profile Display */}
      {user ? (
        <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg uppercase"
                style={{ backgroundColor: user.avatarColor || '#10b981' }}
              >
                {user.username.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-[var(--text-main)]">
                    {user.username}
                  </h3>
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck className="w-3 h-3" />
                    Active Account
                  </span>
                </div>
                {user.email && (
                  <p className="text-xs text-[var(--text-dim)] flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3 h-3" />
                    {user.email}
                  </p>
                )}
                <p className="text-[11px] text-[var(--text-dim)] mt-1">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition-all cursor-pointer self-start sm:self-auto"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-dim)] flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[var(--text-main)]">
                Account Active & Synced
              </p>
              <p className="mt-0.5">
                Your custom profile and gameplay preferences are preserved on this browser.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Not logged in: Account Creation & Login forms */
        <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-6">
          {/* Header & Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-color)]">
            <div>
              <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                <User className="w-5 h-5 text-[var(--accent-color)]" />
                {mode === 'register' ? 'Create an Account' : 'Sign In to Account'}
              </h3>
              <p className="text-xs text-[var(--text-dim)] mt-0.5">
                {mode === 'register'
                  ? 'Set up your grrmondays player profile to save your setup'
                  : 'Log in to your existing grrmondays profile'}
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] self-start sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                  setSuccess('');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-[var(--accent-color)] text-white shadow-sm'
                    : 'text-[var(--text-dim)] hover:text-[var(--text-main)]'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Account</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                  setSuccess('');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-[var(--accent-color)] text-white shadow-sm'
                    : 'text-[var(--text-dim)] hover:text-[var(--text-main)]'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={mode === 'register' ? handleRegister : handleLogin}
            className="space-y-4 max-w-md"
          >
            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-main)]">
                {mode === 'register' ? 'Username' : 'Username or Email'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={
                    mode === 'register'
                      ? 'Choose a username (e.g. GamerPro)'
                      : 'Enter username or email'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--accent-color)]"
                />
              </div>
            </div>

            {/* Email (Only on register) */}
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--text-main)] flex items-center justify-between">
                  <span>Email</span>
                  <span className="text-[10px] text-[var(--text-dim)] font-normal">
                    (Optional)
                  </span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--accent-color)]"
                />
              </div>
            )}

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-main)]">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a secure password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--accent-color)]"
                />
              </div>
            </div>

            {/* Avatar Color Picker (Only on register) */}
            {mode === 'register' && (
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-[var(--text-main)]">
                  Avatar Color
                </label>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {AVATAR_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform cursor-pointer flex items-center justify-center ${
                        selectedColor === c
                          ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[var(--bg-card)]'
                          : 'hover:scale-110 opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c }}
                    >
                      {selectedColor === c && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                {mode === 'register' ? (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Account</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
