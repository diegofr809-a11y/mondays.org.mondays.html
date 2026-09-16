import React, { useState } from 'react';
import { Crown, Lock, CheckCircle2, Sparkles, MessageSquare, ArrowRight, X, ShieldAlert } from 'lucide-react';
import { validatePremiumCode, setPremiumStatus } from '../data/premiumCodes';

export const PremiumModal = ({
  isOpen,
  onClose,
  isPremium,
  onPremiumActivated,
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleRedeem = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!code.trim()) {
      setError('Please enter a code.');
      return;
    }

    if (validatePremiumCode(code)) {
      setPremiumStatus(true, code);
      setSuccess('Code activated! You now have full access to all 2,400+ games.');
      onPremiumActivated();
      setTimeout(() => {
        onClose();
      }, 1400);
    } else {
      setError('Invalid code. Join the Discord to get a working code!');
    }
  };

  const handleDeactivate = () => {
    setPremiumStatus(false);
    onPremiumActivated();
    setSuccess('Premium deactivated. Back to 500 free games.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Decorative top gradient bar */}
        <div className="h-2 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-300" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mb-1 shadow-lg">
              <Crown className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-[var(--text-main)] tracking-tight">
              grrmondays Premium
            </h2>
            <p className="text-xs text-[var(--text-dim)]">
              {isPremium
                ? 'You currently have full access to all 2,468 games!'
                : 'Free users can play 500 games. Unlock 2,000+ extra games with a code!'}
            </p>
          </div>

          {/* Discord Notice Card */}
          <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/40 space-y-2.5">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
              <MessageSquare className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>How to get a code: Join the Discord!</span>
            </div>
            <p className="text-[12px] text-indigo-200/80 leading-relaxed">
              Join our Discord community to get your free Premium Code, request new games, and chat with other players. Codes are dropped in the announcements and VIP channels!
            </p>
            <a
              href="https://discord.gg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              <span>Join the Discord</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Perks list */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-[var(--text-dim)] uppercase tracking-wider">
              Premium Perks
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)]">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-[var(--text-main)] font-medium">All 2,468 Games</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)]">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[var(--text-main)] font-medium">Zero Locked Titles</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)]">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-[var(--text-main)] font-medium">Early Updates</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)]">
                <Crown className="w-4 h-4 text-yellow-400 shrink-0" />
                <span className="text-[var(--text-main)] font-medium">Discord VIP Status</span>
              </div>
            </div>
          </div>

          {/* Redeem Code Form */}
          <div className="space-y-2 pt-1 border-t border-[var(--border-color)]">
            <label className="text-xs font-semibold text-[var(--text-main)] block">
              Enter Premium Code:
            </label>
            <form onSubmit={handleRedeem} className="flex gap-2">
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError('');
                }}
                placeholder="e.g. GRR-PREMIUM-7729"
                className="flex-1 h-9 px-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] focus:border-amber-400 text-xs font-mono font-bold text-[var(--text-main)] placeholder-[var(--text-dim)] outline-none uppercase"
              />
              <button
                type="submit"
                className="px-4 h-9 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md transition-all cursor-pointer shrink-0"
              >
                Unlock
              </button>
            </form>

            {error && (
              <div className="flex items-center gap-1.5 text-xs text-red-400 mt-1.5">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{success}</span>
              </div>
            )}
          </div>

          {/* Deactivate Option (only if active) */}
          {isPremium && (
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleDeactivate}
                className="text-[11px] text-[var(--text-dim)] hover:text-red-400 underline cursor-pointer"
              >
                Deactivate Premium (Back to 500 games)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
