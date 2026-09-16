import React, { useState, useRef, useEffect } from 'react';
import { THEMES } from '../utils/theme';
import { CLOAK_PRESETS } from '../data/initialData';
import { clearAllData } from '../utils/storage';
import { triggerPanic } from '../utils/cloak';
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
  Volume2,
  VolumeX,
  Gamepad2,
  Maximize2,
  ExternalLink,
  Zap,
  FolderArchive,
  Dices,
  Eye,
  Sliders,
  Play,
  Square,
  Sparkles,
  Layers,
} from 'lucide-react';

export const LucideSettingsView = ({
  settings,
  onUpdateSettings,
  games = [],
  onImportGames,
  onClearGames,
  onResetLibraryDefaults,
}) => {
  // Tabs: 'appearance' | 'audio' | 'stealth' | 'gameplay' | 'data'
  const [activeTab, setActiveTab] = useState('appearance');
  const [showSavedNotification, setShowSavedNotification] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const [isTestingAudio, setIsTestingAudio] = useState(false);
  const [testAudioCount, setTestAudioCount] = useState(0);
  const audioTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioTimerRef.current) {
        clearTimeout(audioTimerRef.current);
      }
    };
  }, []);

  const notifySaved = () => {
    setShowSavedNotification(true);
    setTimeout(() => setShowSavedNotification(false), 2000);
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

  // Play test audio for 3 seconds
  const handleTestAudio = () => {
    if (audioTimerRef.current) {
      clearTimeout(audioTimerRef.current);
    }
    setIsTestingAudio(true);
    setTestAudioCount((c) => c + 1);
    audioTimerRef.current = setTimeout(() => {
      setIsTestingAudio(false);
    }, 3000);
  };

  // Open about:blank disguised popup window
  const handleOpenAboutBlank = () => {
    try {
      const win = window.open('about:blank', '_blank');
      if (!win) {
        alert('Pop-up was blocked. Please allow popups for this site in your browser URL bar.');
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
      console.error('Failed to launch about:blank iframe window', e);
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

  // Download complete project source code ZIP
  const handleDownloadSourceZip = () => {
    const a = document.createElement('a');
    a.href = './grrmondays-source.zip';
    a.download = 'grrmondays-source.zip';
    document.body.appendChild(a);
    a.click();
    a.remove();
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
          setImportStatus(`Successfully imported ${parsed.length} games`);
        } else if (parsed.games && Array.isArray(parsed.games)) {
          onImportGames(parsed.games);
          if (parsed.settings) {
            onUpdateSettings({ ...settings, ...parsed.settings });
          }
          setImportStatus(
            `Successfully imported ${parsed.games.length} games and preferences`
          );
        } else {
          setImportStatus('Invalid JSON format: Expected games array.');
        }
      } catch (err) {
        setImportStatus('Error reading file: invalid JSON');
      }
    };
    reader.readAsText(file);
  };

  const handleClearCacheAndReset = () => {
    if (
      window.confirm(
        'Are you sure you want to clear all storage and reset all preferences? This cannot be undone.'
      )
    ) {
      clearAllData();
      window.location.reload();
    }
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto px-4 sm:px-8 py-8 select-none bg-[var(--bg-base)] text-[var(--text-main)]">
      {/* Hidden audio player for testing Ted speech in settings */}
      {isTestingAudio && (
        <div className="sr-only pointer-events-none" aria-hidden="true">
          <iframe
            key={testAudioCount}
            src={`https://www.youtube-nocookie.com/embed/pCNWg9l_sHk?autoplay=1&start=0&controls=0&disablekb=1&fs=0&modestbranding=1&rel=0&iv_load_policy=3&enablejsapi=1`}
            allow="autoplay; encrypted-media"
            title="Grrr Mondays Audio Test"
            className="w-1 h-1 opacity-0 pointer-events-none fixed -top-[9999px] -left-[9999px]"
          />
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-color)]">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)]">
              Settings & Preferences
            </h1>
            <p className="text-xs text-[var(--text-dim)] mt-0.5">
              Customize themes, Ted audio, stealth cloaking, gameplay controls, and source code downloads
            </p>
          </div>

          {showSavedNotification && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-semibold animate-fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>Preferences Saved</span>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('appearance')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'appearance'
                ? 'bg-[var(--accent-color)] text-white shadow-md'
                : 'text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Appearance & Themes</span>
          </button>

          <button
            onClick={() => setActiveTab('audio')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'audio'
                ? 'bg-[var(--accent-color)] text-white shadow-md'
                : 'text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Ted & Audio</span>
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
            <span>Stealth & Cloaking</span>
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
            <span>Gameplay & Controls</span>
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
            <span>Data & Source Code</span>
          </button>
        </div>

        {/* TAB 1: APPEARANCE & THEMES */}
        {activeTab === 'appearance' && (
          <div className="space-y-6 animate-fade-in">
            {/* Theme Selector */}
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-main)]">
                    Theme Palette Engine (10 UI Themes)
                  </h3>
                  <p className="text-xs text-[var(--text-dim)]">
                    Select a color profile. CSS variables update instantly across the entire interface.
                  </p>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--accent-color)] border border-[var(--border-color)]">
                  Active: {THEMES[settings.theme]?.name || settings.theme}
                </span>
              </div>

              {/* 10 Theme Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                {Object.keys(THEMES).map((themeKey) => {
                  const t = THEMES[themeKey];
                  const isSelected = settings.theme === themeKey;
                  return (
                    <button
                      key={themeKey}
                      onClick={() => handleThemeSelect(themeKey)}
                      className={`text-left p-3 rounded-lg border transition-all relative overflow-hidden group cursor-pointer ${
                        isSelected
                          ? 'border-[var(--accent-color)] bg-[var(--bg-hover)] shadow-lg'
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

                      {/* Swatch dots */}
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-5 h-5 rounded-full border border-black/30 shadow-xs"
                          style={{ backgroundColor: t.previewColors[0] }}
                          title="Base Background"
                        />
                        <div
                          className="w-5 h-5 rounded-full border border-black/30 shadow-xs"
                          style={{ backgroundColor: t.previewColors[1] }}
                          title="Accent Color"
                        />
                        <div
                          className="w-5 h-5 rounded-full border border-black/30 shadow-xs"
                          style={{ backgroundColor: t.previewColors[2] }}
                          title="Card / Highlight"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Layout & Visual Toggles */}
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-4">
              <h3 className="text-sm font-bold text-[var(--text-main)]">
                Display & Visual Layout Toggles
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Compact Grid Toggle */}
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
                      Fits more game titles onto a single screen with denser spacing
                    </p>
                  </div>
                </button>

                {/* Disable Animations */}
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
                        Reduce Motion & Animations
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${settings.disableAnimations ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-700/40 text-zinc-400'}`}>
                        {settings.disableAnimations ? 'ON' : 'OFF'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-dim)] mt-1">
                      Smoother performance on lower-end laptops and Chromebooks
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TED & AUDIO SETTINGS */}
        {activeTab === 'audio' && (
          <div className="space-y-5 animate-fade-in">
            {/* Ted Sound Control Card */}
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-main)]">
                    Ted Bear Speech & Sound
                  </h3>
                  <p className="text-xs text-[var(--text-dim)]">
                    Configure the #Grrr... Mondays audio clip that plays when clicking Ted
                  </p>
                </div>
                <button
                  onClick={handleTestAudio}
                  disabled={isTestingAudio}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent-color)] text-white text-xs font-semibold shadow-sm hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isTestingAudio ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                      <span>Playing 3s Clip...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Test Ted Audio</span>
                    </>
                  )}
                </button>
              </div>

              {/* Sound Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* Ted Sound Enabled Toggle */}
                <button
                  type="button"
                  onClick={() => handleUpdate('tedSoundEnabled', !settings.tedSoundEnabled)}
                  className={`p-3 rounded-lg border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    settings.tedSoundEnabled
                      ? 'border-[var(--accent-color)] bg-[var(--bg-hover)]'
                      : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <Volume2 className="w-5 h-5 text-[var(--accent-color)] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-main)]">
                        Ted Voice Line
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${settings.tedSoundEnabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-700/40 text-zinc-400'}`}>
                        {settings.tedSoundEnabled ? 'ENABLED' : 'MUTED'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-dim)] mt-1">
                      Play audio clip when clicking the Ted bear on the home screen
                    </p>
                  </div>
                </button>

                {/* Master Sound Effects Toggle */}
                <button
                  type="button"
                  onClick={() => handleUpdate('soundEffectsEnabled', !settings.soundEffectsEnabled)}
                  className={`p-3 rounded-lg border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    settings.soundEffectsEnabled
                      ? 'border-[var(--accent-color)] bg-[var(--bg-hover)]'
                      : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <Sliders className="w-5 h-5 text-[var(--accent-color)] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-main)]">
                        UI Sound Feedback
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${settings.soundEffectsEnabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-700/40 text-zinc-400'}`}>
                        {settings.soundEffectsEnabled ? 'ENABLED' : 'DISABLED'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-dim)] mt-1">
                      Audio feedback for game clicks, notifications, and button presses
                    </p>
                  </div>
                </button>
              </div>

              {/* Volume Slider */}
              <div className="pt-2 border-t border-[var(--border-color)]">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-[var(--text-main)] flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-[var(--accent-color)]" />
                    <span>Playback Volume: {settings.audioVolume ?? 80}%</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleUpdate('audioVolume', settings.audioVolume === 0 ? 80 : 0)}
                    className="text-xs text-[var(--accent-color)] hover:underline cursor-pointer"
                  >
                    {settings.audioVolume === 0 ? 'Unmute' : 'Mute All'}
                  </button>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.audioVolume ?? 80}
                  onChange={(e) => handleUpdate('audioVolume', parseInt(e.target.value, 10))}
                  className="w-full accent-[var(--accent-color)] cursor-pointer h-2 bg-[var(--bg-surface)] rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STEALTH & CLOAKING */}
        {activeTab === 'stealth' && (
          <div className="space-y-5 animate-fade-in">
            {/* Emergency Panic & Unblock Actions */}
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-main)]">
                    Stealth Window & Panic Controls
                  </h4>
                  <p className="text-[11px] text-[var(--text-dim)]">
                    Instantly mask tabs or open in a disguised popout window
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* About:blank Button */}
                <button
                  onClick={handleOpenAboutBlank}
                  className="flex items-center gap-2.5 p-3 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] hover:border-[var(--accent-color)] transition-all cursor-pointer text-left group"
                >
                  <ExternalLink className="w-5 h-5 text-[var(--accent-color)] group-hover:scale-110 transition-transform shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-[var(--text-main)]">
                      Open in Cloaked Window (`about:blank`)
                    </div>
                    <div className="text-[11px] text-[var(--text-dim)]">
                      Hides URL from browser history & extensions
                    </div>
                  </div>
                </button>

                {/* Test Panic Hotkey Button */}
                <button
                  onClick={handleTestPanic}
                  className="flex items-center gap-2.5 p-3 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-red-500/30 hover:border-red-500 transition-all cursor-pointer text-left group"
                >
                  <Shield className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-red-300">
                      Trigger Panic Hotkey Now
                    </div>
                    <div className="text-[11px] text-[var(--text-dim)]">
                      Instantly leaves site to {settings.panicUrl || 'Google Classroom'}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Tab Disguise Presets */}
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3">
              <div>
                <h4 className="text-xs font-bold text-[var(--text-main)]">
                  Tab Cloaking Presets (8 Disguises)
                </h4>
                <p className="text-[11px] text-[var(--text-dim)]">
                  Instantly changes this browser tab's title and icon to match educational portals
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
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-[var(--text-main)] truncate">
                          {preset.name}
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[var(--accent-color)] shrink-0" />
                      )}
                    </button>
                  );
                })}

                {/* Custom Cloak Option */}
                <button
                  onClick={() => handleUpdate('activeCloak', 'custom')}
                  className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    settings.activeCloak === 'custom'
                      ? 'border-[var(--accent-color)] bg-[var(--bg-hover)] ring-1 ring-[var(--accent-color)]'
                      : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <Globe className="w-4 h-4 text-purple-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-[var(--text-main)] truncate">
                      Custom Disguise
                    </div>
                  </div>
                  {settings.activeCloak === 'custom' && (
                    <Check className="w-3.5 h-3.5 text-[var(--accent-color)] shrink-0" />
                  )}
                </button>
              </div>

              {/* Custom Cloak inputs when selected */}
              {settings.activeCloak === 'custom' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[var(--border-color)]">
                  <div>
                    <label className="text-[10px] font-semibold text-[var(--text-dim)] mb-1 block">
                      Custom Tab Title:
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
                      Custom Favicon URL:
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

            {/* Panic Key Settings */}
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3">
              <div>
                <h4 className="text-xs font-bold text-[var(--text-main)]">
                  Panic Hotkey Configuration
                </h4>
                <p className="text-[11px] text-[var(--text-dim)]">
                  Pressing this single key instantly opens the safe destination URL in this tab
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-[var(--text-dim)] mb-1 block">
                    Panic Hotkey Trigger:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={settings.panicKey}
                      onChange={(e) => handleUpdate('panicKey', e.target.value.slice(-1))}
                      maxLength={1}
                      className="w-20 h-8 px-3 text-center rounded bg-[var(--bg-surface)] border border-[var(--border-color)] font-mono text-sm font-bold text-[var(--text-main)] outline-none focus:border-[var(--accent-color)]"
                    />
                    <span className="text-[10px] text-[var(--text-dim)]">
                      (Press any key to trigger panic redirect)
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-[var(--text-dim)] mb-1 block">
                    Safe Redirect URL:
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

        {/* TAB 4: GAMEPLAY & CONTROLS */}
        {activeTab === 'gameplay' && (
          <div className="space-y-5 animate-fade-in">
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-4">
              <h3 className="text-sm font-bold text-[var(--text-main)]">
                Game Player Controls & Window Handling
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Auto Fullscreen Button Toggle */}
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
                        Auto-Fullscreen Mode
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${settings.autoFullscreen ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-700/40 text-zinc-400'}`}>
                        {settings.autoFullscreen ? 'ON' : 'OFF'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-dim)] mt-1">
                      Automatically request fullscreen view when launching a game modal
                    </p>
                  </div>
                </button>

                {/* Open in New Window Toggle */}
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
                        Open Games in New Window
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${settings.openInNewTab ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-700/40 text-zinc-400'}`}>
                        {settings.openInNewTab ? 'ON' : 'OFF'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-dim)] mt-1">
                      Pop out game iframe into a standalone browser window
                    </p>
                  </div>
                </button>

                {/* Prevent Tab Close Confirmation Toggle */}
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
                        Anti-Close Dialog (School Safe)
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${settings.confirmBeforeLeave ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-700/40 text-zinc-400'}`}>
                        {settings.confirmBeforeLeave ? 'ON' : 'OFF'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-dim)] mt-1">
                      Prompt "Changes you made may not be saved" when closing tab to prevent accidental loss
                    </p>
                  </div>
                </button>

                {/* High Performance Mode */}
                <button
                  type="button"
                  onClick={() => handleUpdate('highPerformanceMode', !settings.highPerformanceMode)}
                  className={`p-3 rounded-lg border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    settings.highPerformanceMode
                      ? 'border-[var(--accent-color)] bg-[var(--bg-hover)]'
                      : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <Zap className="w-5 h-5 text-[var(--accent-color)] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-main)]">
                        Hardware Accelerated High-FPS
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${settings.highPerformanceMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-700/40 text-zinc-400'}`}>
                        {settings.highPerformanceMode ? 'ON' : 'OFF'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-dim)] mt-1">
                      Request high-refresh rate canvas context for action and racing games
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DATA, SOURCE CODE & BACKUP */}
        {activeTab === 'data' && (
          <div className="space-y-5 animate-fade-in">
            {/* Download Full Source Code Card */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 via-[var(--bg-card)] to-indigo-950/30 border border-purple-500/30 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
                    <FolderArchive className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Download Complete Project Source Code (.ZIP)
                    </h4>
                    <p className="text-xs text-purple-200/70 mt-1">
                      Get the entire offline source code for grrmondays including all 2,468 games, React components, Tailwind styling, Vite build configuration, and assets.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleDownloadSourceZip}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg transition-all cursor-pointer shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Download ZIP</span>
                </button>
              </div>
            </div>

            {/* Library Overview Card */}
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-main)]">
                    Games Library Status
                  </h4>
                  <p className="text-[11px] text-[var(--text-dim)]">
                    Local persistent library synchronized with full built-in game catalog
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-[var(--accent-color)]">
                    {games.length}
                  </span>
                  <span className="text-xs text-[var(--text-dim)] ml-1">games loaded</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border-color)]">
                <button
                  onClick={handleExportData}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] text-xs font-medium text-[var(--text-main)] transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                  <span>Backup Library to JSON</span>
                </button>

                <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] text-xs font-medium text-[var(--text-main)] cursor-pointer transition-all">
                  <Upload className="w-3.5 h-3.5 text-blue-400" />
                  <span>Restore from JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportFile}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        'Reset games library to full built-in collection (2,468 games)?'
                      )
                    ) {
                      onResetLibraryDefaults();
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] text-xs font-medium text-amber-300 transition-all ml-auto cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Original Games (2,468)</span>
                </button>
              </div>

              {importStatus && (
                <div className="mt-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 p-2 rounded border border-emerald-500/30">
                  {importStatus}
                </div>
              )}
            </div>

            {/* Clear Storage / Cache */}
            <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <h4 className="text-xs font-bold text-red-200">
                  Clear Local Storage & Cache
                </h4>
              </div>
              <p className="text-[11px] text-red-300/80">
                Wipes all saved shortcuts, customized preferences, search history, and cached game session data from this browser.
              </p>

              <button
                onClick={handleClearCacheAndReset}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Local Storage & Cache</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
