import React, { useState, useRef, useEffect } from 'react';
import { THEMES } from '../utils/theme';
import { CLOAK_PRESETS } from '../data/initialData';
import { clearAllData } from '../utils/storage';
import { triggerPanic } from '../utils/cloak';
import { validatePremiumCode, setPremiumStatus } from '../data/premiumCodes';
import { AccountSettingsTab } from './AccountSettingsTab';
import { CreditsSettingsTab } from './CreditsSettingsTab';
import {
  Palette,
  Shield,
  Database,
  Check,
  RotateCcw,
  Download,
  Upload,
  Trash2,
  Globe,
  AlertTriangle,
  Gamepad2,
  Maximize2,
  ExternalLink,
  Zap,
  Layers,
  Crown,
  User,
  Heart,
} from 'lucide-react';

export const LucideSettingsView = ({
  settings,
  onUpdateSettings,
  games = [],
  onImportGames,
  onClearGames,
  onResetLibraryDefaults,
  isPremium = false,
  onOpenPremium,
  onPremiumActivated,
  initialTab = 'appearance',
}) => {
  // Tabs: 'account' | 'appearance' | 'vip' | 'stealth' | 'gameplay' | 'data' | 'credits'
  const [activeTab, setActiveTab] = useState(initialTab || 'account');
  const [showSavedNotification, setShowSavedNotification] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const [vipCodeInput, setVipCodeInput] = useState('');
  const [vipError, setVipError] = useState('');
  const [vipSuccess, setVipSuccess] = useState('');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const notifySaved = () => {
    setShowSavedNotification(true);
    setTimeout(() => setShowSavedNotification(false), 1800);
  };

  const handleRedeemVip = (e) => {
    e.preventDefault();
    setVipError('');
    setVipSuccess('');

    if (!vipCodeInput.trim()) {
      setVipError('Please enter a VIP access code.');
      return;
    }

    if (validatePremiumCode(vipCodeInput)) {
      setPremiumStatus(true, vipCodeInput);
      setVipSuccess('VIP Access Unlocked! All 2,468 games are now playable.');
      setVipCodeInput('');
      onPremiumActivated?.();
      notifySaved();
    } else {
      setVipError('Invalid VIP code. Join our Discord to claim a valid code!');
    }
  };

  const handleDeactivateVip = () => {
    if (window.confirm('Deactivate VIP status and return to 500 free games?')) {
      setPremiumStatus(false);
      setVipSuccess('');
      setVipError('');
      onPremiumActivated?.();
      notifySaved();
    }
  };

  const handleThemeSelect = (themeId) => {
    const updated = { ...settings, theme: themeId };
    onUpdateSettings(updated);
    notifySaved();
  };

  const handleUpdate = (key, value) => {
    const updated = { ...settings, [key]: value };
    onUpdateSettings(updated);
    notifySaved();
  };

  // Open about:blank disguised popup window
  const handleOpenAboutBlank = () => {
    try {
      const win = window.open('about:blank', '_blank');
      if (!win) {
        alert('Please allow popups in your browser to use this feature.');
        return;
      }
      const title =
        settings.activeCloak === 'classroom'
          ? 'Classes'
          : settings.customCloakTitle || 'grrmondays';
      win.document.title = title;
      const iframe = win.document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.width = '100vw';
      iframe.style.height = '100vh';
      iframe.style.border = 'none';
      iframe.src = window.location.href;
      win.document.body.style.margin = '0';
      win.document.body.appendChild(iframe);
    } catch (e) {
      console.error('Popout failed', e);
    }
  };

  // Test panic hotkey immediately
  const handleTestPanic = () => {
    triggerPanic(settings.panicUrl || 'https://classroom.google.com');
  };

  // Export games library backup JSON
  const handleExportData = () => {
    const backup = {
      version: '3.0',
      exportedAt: new Date().toISOString(),
      settings,
      gamesCount: games.length,
      games,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grrmondays_backup_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result);
        if (Array.isArray(parsed)) {
          onImportGames(parsed);
          setImportStatus(`Imported ${parsed.length} games`);
        } else if (parsed.games && Array.isArray(parsed.games)) {
          onImportGames(parsed.games);
          if (parsed.settings) {
            onUpdateSettings({ ...settings, ...parsed.settings });
          }
          setImportStatus(`Imported ${parsed.games.length} games and settings`);
        } else {
          setImportStatus('Invalid JSON file format.');
        }
      } catch (err) {
        setImportStatus('Error reading file.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearCacheAndReset = () => {
    if (
      window.confirm(
        'Reset all settings and clear storage? This cannot be undone.'
      )
    ) {
      clearAllData();
      window.location.reload();
    }
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto px-4 sm:px-8 py-8 select-none bg-[var(--bg-base)] text-[var(--text-main)]">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-color)]">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)]">
              Settings
            </h1>
            <p className="text-xs text-[var(--text-dim)] mt-0.5">
              Customize player account, themes, stealth mode, and credits
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isPremium ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
                <Crown className="w-3.5 h-3.5" />
                <span>Premium Unlocked</span>
              </div>
            ) : (
              <button
                onClick={onOpenPremium}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Get Premium</span>
              </button>
            )}

            {showSavedNotification && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-semibold animate-fade-in">
                <Check className="w-3.5 h-3.5" />
                <span>Saved</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] overflow-x-auto scrollbar-none">
          {/* Account Tab */}
          <button
            onClick={() => setActiveTab('account')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'account'
                ? 'bg-[var(--accent-color)] text-white shadow-md'
                : 'text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Account</span>
          </button>

          <button
            onClick={() => setActiveTab('appearance')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'appearance'
                ? 'bg-[var(--accent-color)] text-white shadow-md'
                : 'text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Themes</span>
          </button>

          {/* VIP Access Tab */}
          <button
            onClick={() => setActiveTab('vip')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'vip'
                ? 'bg-amber-500 text-black shadow-md font-bold'
                : 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 font-bold'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>VIP Access</span>
            {isPremium ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            ) : (
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Unlock
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('stealth')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'stealth'
                ? 'bg-[var(--accent-color)] text-white shadow-md'
                : 'text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Stealth</span>
          </button>

          <button
            onClick={() => setActiveTab('gameplay')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'gameplay'
                ? 'bg-[var(--accent-color)] text-white shadow-md'
                : 'text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Controls</span>
          </button>

          <button
            onClick={() => setActiveTab('data')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'data'
                ? 'bg-[var(--accent-color)] text-white shadow-md'
                : 'text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Storage</span>
          </button>

          {/* Credits Tab */}
          <button
            onClick={() => setActiveTab('credits')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'credits'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>Credits</span>
          </button>
        </div>

        {/* TAB 0: ACCOUNT */}
        {activeTab === 'account' && (
          <AccountSettingsTab onAccountChange={() => notifySaved()} />
        )}

        {/* TAB 1: APPEARANCE */}
        {activeTab === 'appearance' && (
          <div className="space-y-6 animate-fade-in">
            {/* Theme Selector */}
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-main)]">
                    Color Themes
                  </h3>
                  <p className="text-xs text-[var(--text-dim)]">
                    Pick your favorite look and color scheme.
                  </p>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--accent-color)] border border-[var(--border-color)]">
                  {THEMES[settings.theme]?.name || settings.theme}
                </span>
              </div>

              {/* Theme Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                {Object.keys(THEMES).map((themeKey) => {
                  const t = THEMES[themeKey];
                  const isSelected = settings.theme === themeKey;
                  return (
                    <button
                      key={themeKey}
                      onClick={() => handleThemeSelect(themeKey)}
                      className={`text-left p-3 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[var(--accent-color)] bg-[var(--bg-hover)] shadow-md'
                          : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-hover)]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[var(--text-main)]">
                          {t.name}
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-[var(--accent-color)] text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>

                      <p className="text-[11px] text-[var(--text-dim)] mb-3 line-clamp-1">
                        {t.description}
                      </p>

                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-5 h-5 rounded-full border border-black/30"
                          style={{ backgroundColor: t.previewColors[0] }}
                        />
                        <div
                          className="w-5 h-5 rounded-full border border-black/30"
                          style={{ backgroundColor: t.previewColors[1] }}
                        />
                        <div
                          className="w-5 h-5 rounded-full border border-black/30"
                          style={{ backgroundColor: t.previewColors[2] }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Display Toggles */}
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-4">
              <h3 className="text-sm font-bold text-[var(--text-main)]">
                Display Options
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleUpdate('compactCardGrid', !settings.compactCardGrid)}
                  className={`p-3 rounded-lg border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    settings.compactCardGrid
                      ? 'border-[var(--accent-color)] bg-[var(--bg-hover)]'
                      : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <Layers className="w-5 h-5 text-[var(--accent-color)] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-main)]">
                        Compact Game Cards
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${settings.compactCardGrid ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-700/40 text-zinc-400'}`}>
                        {settings.compactCardGrid ? 'ON' : 'OFF'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-dim)] mt-1">
                      Fits more games on the screen at once
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdate('disableAnimations', !settings.disableAnimations)}
                  className={`p-3 rounded-lg border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    settings.disableAnimations
                      ? 'border-[var(--accent-color)] bg-[var(--bg-hover)]'
                      : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <Zap className="w-5 h-5 text-[var(--accent-color)] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-main)]">
                        Less Animations
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${settings.disableAnimations ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-700/40 text-zinc-400'}`}>
                        {settings.disableAnimations ? 'ON' : 'OFF'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-dim)] mt-1">
                      Faster performance on Chromebooks
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: VIP ACCESS */}
        {activeTab === 'vip' && (
          <div className="space-y-6 animate-fade-in">
            {/* VIP Status Card */}
            <div
              className={`p-6 rounded-2xl border transition-all ${
                isPremium
                  ? 'bg-gradient-to-br from-amber-500/15 via-[var(--bg-card)] to-amber-500/5 border-amber-500/40 shadow-lg'
                  : 'bg-[var(--bg-card)] border-[var(--border-color)]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                      isPremium
                        ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                        : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                    }`}
                  >
                    <Crown className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-black tracking-tight text-[var(--text-main)]">
                        {isPremium ? 'VIP Status: Active' : 'VIP Access'}
                      </h2>
                      {isPremium ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-extrabold border border-amber-500/40">
                          ALL 2,468 GAMES UNLOCKED
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-dim)] text-[11px] font-semibold border border-[var(--border-color)]">
                          500 FREE GAMES
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-dim)] mt-1">
                      {isPremium
                        ? 'You have unrestricted lifetime access to every unblocked game in the catalog.'
                        : 'Free users can play the first 500 games. Unlock all 2,000+ extra titles with VIP.'}
                    </p>
                  </div>
                </div>

                {isPremium && (
                  <button
                    onClick={handleDeactivateVip}
                    className="self-start sm:self-auto text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    Deactivate VIP
                  </button>
                )}
              </div>
            </div>

            {/* Redeem Code Section (If not premium) */}
            {!isPremium && (
              <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--accent-color)]/10 text-[var(--accent-color)] flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-main)]">
                      Redeem VIP Access Code
                    </h3>
                    <p className="text-xs text-[var(--text-dim)]">
                      Enter your VIP key to instantly unlock the entire 2,468 games catalog.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleRedeemVip} className="flex flex-col sm:flex-row gap-3 pt-1">
                  <input
                    type="text"
                    value={vipCodeInput}
                    onChange={(e) => {
                      setVipCodeInput(e.target.value);
                      setVipError('');
                    }}
                    placeholder="Enter code (e.g. GRR-PREMIUM-7729)"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-main)] text-sm uppercase tracking-wider font-mono placeholder:normal-case placeholder:font-sans placeholder:text-[var(--text-dim)] focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-all shadow-md cursor-pointer shrink-0"
                  >
                    Redeem Code
                  </button>
                </form>

                {vipError && (
                  <p className="text-xs text-red-400 font-medium flex items-center gap-1.5 animate-shake">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {vipError}
                  </p>
                )}

                {vipSuccess && (
                  <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 animate-fade-in">
                    <Check className="w-3.5 h-3.5" />
                    {vipSuccess}
                  </p>
                )}
              </div>
            )}

            {/* Discord Community Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#5865F2]/15 via-[var(--bg-card)] to-transparent border border-[#5865F2]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#5865F2] text-white flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-[var(--text-main)]">
                    Need a VIP Code? Join our Discord
                  </h3>
                </div>
                <p className="text-xs text-[var(--text-dim)] pl-9 max-w-lg">
                  Free VIP keys are distributed in our Discord community! Join to grab active codes, suggest new games, and enter tournaments.
                </p>
              </div>

              <a
                href="https://discord.gg"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
              >
                <span>Join Discord</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* VIP Perks Grid */}
            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-4">
              <h3 className="text-sm font-bold text-[var(--text-main)]">
                VIP Membership Benefits
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                    <Gamepad2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-main)]">
                      2,468 Total Games Unlocked
                    </h4>
                    <p className="text-[11px] text-[var(--text-dim)] mt-0.5">
                      Full access to all 2,000+ restricted titles across action, retro arcade, rhythm, and sports.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-main)]">
                      Zero Lock Prompts
                    </h4>
                    <p className="text-[11px] text-[var(--text-dim)] mt-0.5">
                      No locked game popups. Every game launches directly with zero restrictions.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0">
                    <Palette className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-main)]">
                      18 Premium Themes
                    </h4>
                    <p className="text-[11px] text-[var(--text-dim)] mt-0.5">
                      Enjoy Crimson Red, Matrix Terminal, Sakura Blossom, Solar Amber, and all custom themes.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-main)]">
                      VIP Badge & Discord Role
                    </h4>
                    <p className="text-[11px] text-[var(--text-dim)] mt-0.5">
                      Gold VIP styling on your interface and access to exclusive VIP channels.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STEALTH */}
        {activeTab === 'stealth' && (
          <div className="space-y-5 animate-fade-in">
            {/* Quick Actions */}
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3">
              <h4 className="text-xs font-bold text-[var(--text-main)]">
                Stealth & Panic Actions
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleOpenAboutBlank}
                  className="flex items-center gap-2.5 p-3 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] hover:border-[var(--accent-color)] transition-all cursor-pointer text-left"
                >
                  <ExternalLink className="w-5 h-5 text-[var(--accent-color)] shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-[var(--text-main)]">
                      Open in Safe Window (about:blank)
                    </div>
                    <div className="text-[11px] text-[var(--text-dim)]">
                      Hides site from browser history
                    </div>
                  </div>
                </button>

                <button
                  onClick={handleTestPanic}
                  className="flex items-center gap-2.5 p-3 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-red-500/30 hover:border-red-500 transition-all cursor-pointer text-left"
                >
                  <Shield className="w-5 h-5 text-red-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-red-300">
                      Test Panic Button Now
                    </div>
                    <div className="text-[11px] text-[var(--text-dim)]">
                      Leaves immediately to {settings.panicUrl || 'Google Classroom'}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Tab Cloaks */}
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3">
              <div>
                <h4 className="text-xs font-bold text-[var(--text-main)]">
                  Tab Disguise Presets
                </h4>
                <p className="text-[11px] text-[var(--text-dim)]">
                  Changes your tab's title and icon so it looks like schoolwork
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                {CLOAK_PRESETS.map((preset) => {
                  const isSelected = settings.activeCloak === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleUpdate('activeCloak', preset.id)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[var(--accent-color)] bg-[var(--bg-hover)] ring-1 ring-[var(--accent-color)]'
                          : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)]'
                      }`}
                    >
                      <img
                        src={preset.favicon}
                        alt=""
                        className="w-4 h-4 rounded-xs shrink-0"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <span className="text-xs font-semibold text-[var(--text-main)] truncate flex-1">
                        {preset.name}
                      </span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[var(--accent-color)] shrink-0" />
                      )}
                    </button>
                  );
                })}

                <button
                  onClick={() => handleUpdate('activeCloak', 'custom')}
                  className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    settings.activeCloak === 'custom'
                      ? 'border-[var(--accent-color)] bg-[var(--bg-hover)] ring-1 ring-[var(--accent-color)]'
                      : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <Globe className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="text-xs font-semibold text-[var(--text-main)] truncate flex-1">
                    Custom Disguise
                  </span>
                  {settings.activeCloak === 'custom' && (
                    <Check className="w-3.5 h-3.5 text-[var(--accent-color)] shrink-0" />
                  )}
                </button>
              </div>

              {settings.activeCloak === 'custom' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[var(--border-color)]">
                  <div>
                    <label className="text-[10px] font-semibold text-[var(--text-dim)] mb-1 block">
                      Tab Title:
                    </label>
                    <input
                      type="text"
                      value={settings.customCloakTitle || ''}
                      onChange={(e) => handleUpdate('customCloakTitle', e.target.value)}
                      placeholder="e.g. Google Docs"
                      className="w-full h-8 px-2.5 rounded bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] outline-none focus:border-[var(--accent-color)]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-[var(--text-dim)] mb-1 block">
                      Favicon URL:
                    </label>
                    <input
                      type="text"
                      value={settings.customCloakFavicon || ''}
                      onChange={(e) => handleUpdate('customCloakFavicon', e.target.value)}
                      placeholder="https://.../favicon.ico"
                      className="w-full h-8 px-2.5 rounded bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] outline-none focus:border-[var(--accent-color)]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Panic Key */}
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3">
              <div>
                <h4 className="text-xs font-bold text-[var(--text-main)]">
                  Panic Key Setup
                </h4>
                <p className="text-[11px] text-[var(--text-dim)]">
                  Pressing this key instantly redirects to a safe educational site
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-[var(--text-dim)] mb-1 block">
                    Panic Key:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={settings.panicKey}
                      onChange={(e) => handleUpdate('panicKey', e.target.value.slice(-1))}
                      maxLength={1}
                      className="w-16 h-8 text-center rounded bg-[var(--bg-surface)] border border-[var(--border-color)] font-mono text-sm font-bold text-[var(--text-main)] outline-none focus:border-[var(--accent-color)]"
                    />
                    <span className="text-[11px] text-[var(--text-dim)]">
                      Press this key anytime to escape
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-[var(--text-dim)] mb-1 block">
                    Safe Website:
                  </label>
                  <input
                    type="text"
                    value={settings.panicUrl}
                    onChange={(e) => handleUpdate('panicUrl', e.target.value)}
                    placeholder="https://classroom.google.com"
                    className="w-full h-8 px-2.5 rounded bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] outline-none focus:border-[var(--accent-color)]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CONTROLS */}
        {activeTab === 'gameplay' && (
          <div className="space-y-5 animate-fade-in">
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-4">
              <h3 className="text-sm font-bold text-[var(--text-main)]">
                Game Window Controls
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleUpdate('autoFullscreen', !settings.autoFullscreen)}
                  className={`p-3 rounded-lg border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    settings.autoFullscreen
                      ? 'border-[var(--accent-color)] bg-[var(--bg-hover)]'
                      : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <Maximize2 className="w-5 h-5 text-[var(--accent-color)] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-main)]">
                        Auto-Fullscreen
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${settings.autoFullscreen ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-700/40 text-zinc-400'}`}>
                        {settings.autoFullscreen ? 'ON' : 'OFF'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-dim)] mt-1">
                      Opens games in full screen automatically
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdate('openInNewTab', !settings.openInNewTab)}
                  className={`p-3 rounded-lg border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    settings.openInNewTab
                      ? 'border-[var(--accent-color)] bg-[var(--bg-hover)]'
                      : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <ExternalLink className="w-5 h-5 text-[var(--accent-color)] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-main)]">
                        New Tab Mode
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${settings.openInNewTab ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-700/40 text-zinc-400'}`}>
                        {settings.openInNewTab ? 'ON' : 'OFF'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-dim)] mt-1">
                      Launches games into their own new window
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdate('confirmBeforeLeave', !settings.confirmBeforeLeave)}
                  className={`p-3 rounded-lg border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    settings.confirmBeforeLeave
                      ? 'border-[var(--accent-color)] bg-[var(--bg-hover)]'
                      : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <Shield className="w-5 h-5 text-[var(--accent-color)] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-main)]">
                        Leave Warning
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${settings.confirmBeforeLeave ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-700/40 text-zinc-400'}`}>
                        {settings.confirmBeforeLeave ? 'ON' : 'OFF'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-dim)] mt-1">
                      Asks before closing tab to prevent losing game progress
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: STORAGE */}
        {activeTab === 'data' && (
          <div className="space-y-5 animate-fade-in">
            {/* VIP Status Card */}
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-main)]">
                      Premium Membership Status
                    </h4>
                    <p className="text-[11px] text-[var(--text-dim)]">
                      {isPremium
                        ? 'All 2,468 games unlocked'
                        : 'Free tier: 500 games accessible'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onOpenPremium}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  {isPremium ? 'Manage VIP' : 'Enter Code'}
                </button>
              </div>
            </div>

            {/* Games Library Status */}
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-main)]">
                    Games Catalog
                  </h4>
                  <p className="text-[11px] text-[var(--text-dim)]">
                    Total games stored in your browser
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-[var(--accent-color)]">
                    {games.length}
                  </span>
                  <span className="text-xs text-[var(--text-dim)] ml-1">games</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border-color)]">
                <button
                  onClick={handleExportData}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] text-xs font-medium text-[var(--text-main)] transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                  <span>Backup Games</span>
                </button>

                <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] text-xs font-medium text-[var(--text-main)] cursor-pointer transition-all">
                  <Upload className="w-3.5 h-3.5 text-blue-400" />
                  <span>Restore</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportFile}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={() => {
                    if (window.confirm('Reset games library to original collection?')) {
                      onResetLibraryDefaults();
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] text-xs font-medium text-amber-300 transition-all ml-auto cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Default</span>
                </button>
              </div>

              {importStatus && (
                <div className="mt-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 p-2 rounded border border-emerald-500/30">
                  {importStatus}
                </div>
              )}
            </div>

            {/* Clear Storage */}
            <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <h4 className="text-xs font-bold text-red-200">
                  Clear Browser Cache
                </h4>
              </div>
              <p className="text-[11px] text-red-300/80">
                Wipes all saved settings, favorites, and game data from this browser.
              </p>

              <button
                onClick={handleClearCacheAndReset}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Storage</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: CREDITS */}
        {activeTab === 'credits' && (
          <CreditsSettingsTab />
        )}
      </div>
    </div>
  );
};
