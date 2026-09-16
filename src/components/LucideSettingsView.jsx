import React, { useState } from 'react';
import { THEMES } from '../utils/theme';
import { CLOAK_PRESETS } from '../data/initialData';
import { clearAllData } from '../utils/storage';
import {
  Palette,
  Sparkles,
  Shield,
  Database,
  Check,
  RotateCcw,
  Download,
  Upload,
  Trash2,
  Terminal,
  Key,
  Globe,
  AlertTriangle,
} from 'lucide-react';

export const LucideSettingsView = ({
  settings,
  onUpdateSettings,
  games,
  onImportGames,
  onClearGames,
  onResetLibraryDefaults,
}) => {
  const [activeTab, setActiveTab] = useState('appearance');
  const [showSavedNotification, setShowSavedNotification] = useState(false);
  const [importStatus, setImportStatus] = useState(null);

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

  const handleExportData = () => {
    const backup = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      settings,
      gamesCount: games.length,
      games,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
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
          setImportStatus(`Successfully imported ${parsed.length} games`);
        } else if (parsed.games && Array.isArray(parsed.games)) {
          onImportGames(parsed.games);
          if (parsed.settings) {
            onUpdateSettings({ ...settings, ...parsed.settings });
          }
          setImportStatus(`Successfully imported ${parsed.games.length} games and settings`);
        } else {
          setImportStatus('Invalid JSON format: Expected games array.');
        }
      } catch (err) {
        setImportStatus('Failed to parse JSON file.');
      }
      setTimeout(() => setImportStatus(null), 4000);
    };
    reader.readAsText(file);
  };

  const handleClearCacheAndReset = () => {
    if (window.confirm('Clear all local storage, cached preferences, and reset grrmondays to defaults?')) {
      clearAllData();
      window.location.reload();
    }
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto px-4 sm:px-8 py-8 lucide-bg select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-color)]">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)]">
              Settings & Customization
            </h1>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Customize themes, Gemini AI parameters, stealth tab disguises, and storage
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
            className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'appearance'
                ? 'bg-[var(--accent-color)] text-white shadow-md'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Appearance & Themes</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'ai'
                ? 'bg-[var(--accent-color)] text-white shadow-md'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Assistant (Gemini)</span>
          </button>

          <button
            onClick={() => setActiveTab('stealth')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'stealth'
                ? 'bg-[var(--accent-color)] text-white shadow-md'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Stealth & Search</span>
          </button>

          <button
            onClick={() => setActiveTab('data')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'data'
                ? 'bg-[var(--accent-color)] text-white shadow-md'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Data & Storage</span>
          </button>
        </div>

        {/* TAB 1: APPEARANCE & THEMES */}
        {activeTab === 'appearance' && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-main)]">
                    Theme Palette Engine (10 UI Themes)
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Select a color profile. CSS variables update instantly across the entire interface.
                  </p>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--badge-bg)] text-[var(--accent-color)] border border-[var(--border-color)]">
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
                      className={`text-left p-3 rounded-lg border transition-all relative overflow-hidden group ${
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

                      <p className="text-[11px] text-[var(--text-muted)] mb-3 line-clamp-1">
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
          </div>
        )}

        {/* TAB 2: AI ASSISTANT (GEMINI) */}
        {activeTab === 'ai' && (
          <div className="space-y-5 animate-fade-in">
            {/* Gemini Badge */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-purple-950/40 to-indigo-950/30 border border-blue-500/30 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">
                    grrmondays AI Assistant
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-[10px] font-semibold text-blue-300">
                    Powered by Google Gemini AI
                  </span>
                </div>
                <p className="text-xs text-[#9bb0d4] mt-1">
                  The integrated conversational agent leverages Google's Gemini models for rapid homework tutoring, coding assistance, and knowledge retrieval.
                </p>
              </div>
            </div>

            {/* Creativity / Temperature Selector */}
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-main)]">
                    Creativity & Temperature Control
                  </h4>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Adjust how strictly deterministic or creative responses should be
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-[var(--accent-color)]">
                  {settings.aiTemperature === 0.2 ? '0.2 (Precise)' : settings.aiTemperature === 1.0 ? '1.0 (Creative)' : '0.7 (Balanced)'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { val: 0.2, label: 'Precise', desc: 'Factual & structured' },
                  { val: 0.7, label: 'Balanced', desc: 'Standard conversational' },
                  { val: 1.0, label: 'Creative', desc: 'Expansive & brainstorming' },
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => handleUpdate('aiTemperature', item.val)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      settings.aiTemperature === item.val
                        ? 'border-[var(--accent-color)] bg-[var(--bg-hover)] shadow-xs'
                        : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)]'
                    }`}
                  >
                    <div className="text-xs font-bold text-[var(--text-main)]">{item.label}</div>
                    <div className="text-[10px] text-[var(--text-muted)]">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom System Instructions */}
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[var(--accent-color)]" />
                <h4 className="text-xs font-bold text-[var(--text-main)]">
                  Custom System Instructions / Persona
                </h4>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                Provide custom directives or rules for how grrmondays AI formats its answers.
              </p>
              <textarea
                value={settings.aiSystemInstructions}
                onChange={(e) => handleUpdate('aiSystemInstructions', e.target.value)}
                rows={3}
                placeholder="e.g. Always explain scientific questions using plain English and concise bullet points..."
                className="w-full p-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] placeholder-[var(--text-dim)] outline-none focus:border-[var(--accent-color)] transition-all"
              />
            </div>

            {/* Custom AI API Key (Navy AI / Google Gemini) */}
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-[var(--accent-color)]" />
                  <h4 className="text-xs font-bold text-[var(--text-main)]">
                    AI API Key Configuration
                  </h4>
                </div>
                {settings.aiCustomApiKey?.startsWith('sk-navy-') && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-semibold text-emerald-300">
                    Navy AI Key Active
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                Supports Navy AI keys (<code className="font-mono text-purple-300">sk-navy-...</code>) and Google Gemini keys with automatic failover to guarantee 24/7 uptime.
              </p>
              <div className="space-y-1.5">
                <input
                  type="password"
                  value={settings.aiCustomApiKey || ''}
                  onChange={(e) => handleUpdate('aiCustomApiKey', e.target.value)}
                  placeholder="sk-navy-... or AIzaSy..."
                  className="w-full h-9 px-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] placeholder-[var(--text-dim)] outline-none focus:border-[var(--accent-color)] transition-all font-mono"
                />
                <div className="flex items-center justify-between text-[10px] text-[var(--text-dim)]">
                  <span>Current key: {settings.aiCustomApiKey ? `${settings.aiCustomApiKey.slice(0, 10)}...${settings.aiCustomApiKey.slice(-4)}` : 'Built-in Google Gemini (Active)'}</span>
                  {settings.aiCustomApiKey ? (
                    <button
                      type="button"
                      onClick={() => handleUpdate('aiCustomApiKey', '')}
                      className="text-[var(--accent-color)] hover:underline font-semibold"
                    >
                      Use Built-in Gemini
                    </button>
                  ) : (
                    <span className="text-emerald-400 font-medium">Optimal 24/7 Uptime</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STEALTH & CLOAKING & SEARCH */}
        {activeTab === 'stealth' && (
          <div className="space-y-5 animate-fade-in">
            {/* Tab Disguise Presets */}
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3">
              <div>
                <h4 className="text-xs font-bold text-[var(--text-main)]">
                  Tab Cloaking Presets
                </h4>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Instantly disguises your browser tab's title and favicon as school or productivity portals
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {CLOAK_PRESETS.map((preset) => {
                  const isSelected = settings.activeCloak === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleUpdate('activeCloak', preset.id)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'border-[var(--accent-color)] bg-[var(--bg-hover)]'
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
                        <div className="text-[10px] text-[var(--text-muted)] truncate">
                          {preset.title}
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[var(--accent-color)] shrink-0" />}
                    </button>
                  );
                })}

                {/* Custom Cloak Option */}
                <button
                  onClick={() => handleUpdate('activeCloak', 'custom')}
                  className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-left transition-all ${
                    settings.activeCloak === 'custom'
                      ? 'border-[var(--accent-color)] bg-[var(--bg-hover)]'
                      : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <Globe className="w-4 h-4 text-purple-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-[var(--text-main)] truncate">
                      Custom Disguise
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)] truncate">
                      Custom Title & Favicon
                    </div>
                  </div>
                  {settings.activeCloak === 'custom' && (
                    <Check className="w-3.5 h-3.5 text-[var(--accent-color)] shrink-0" />
                  )}
                </button>
              </div>

              {/* Custom Cloak inputs when selected */}
              {settings.activeCloak === 'custom' && (
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-[var(--text-muted)] mb-1 block">
                      Custom Tab Title:
                    </label>
                    <input
                      type="text"
                      value={settings.customCloakTitle || ''}
                      onChange={(e) => handleUpdate('customCloakTitle', e.target.value)}
                      placeholder="e.g. Science Project - Google Docs"
                      className="w-full h-8 px-2.5 rounded bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] outline-none focus:border-[var(--accent-color)]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-[var(--text-muted)] mb-1 block">
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

            {/* Default Search Engine */}
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3">
              <div>
                <h4 className="text-xs font-bold text-[var(--text-main)]">
                  Default Omnibar Search Engine
                </h4>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Used when searching keywords or queries from the grrmondays home omnibar
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'duckduckgo', name: 'DuckDuckGo', desc: 'Privacy-focused' },
                  { id: 'google', name: 'Google', desc: 'Standard search' },
                  { id: 'bing', name: 'Bing', desc: 'Microsoft engine' },
                  { id: 'brave', name: 'Brave Search', desc: 'Independent index' },
                ].map((engine) => (
                  <button
                    key={engine.id}
                    onClick={() => handleUpdate('defaultSearchEngine', engine.id)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      settings.defaultSearchEngine === engine.id
                        ? 'border-[var(--accent-color)] bg-[var(--bg-hover)]'
                        : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)]'
                    }`}
                  >
                    <div className="text-xs font-bold text-[var(--text-main)]">{engine.name}</div>
                    <div className="text-[10px] text-[var(--text-muted)]">{engine.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Proxy Engine Mode */}
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3">
              <div>
                <h4 className="text-xs font-bold text-[var(--text-main)]">
                  Proxy Relay Engine Mode
                </h4>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Select the proxy relay mechanism used for embedding external websites
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'direct', name: 'Direct / Sandboxed', desc: 'Fastest native embedding' },
                  { id: 'ultraviolet', name: 'Ultraviolet Mode', desc: 'Client service worker proxy' },
                  { id: 'wisp', name: 'Wisp Relay', desc: 'WebSocket transport relay' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => handleUpdate('proxyEngineMode', mode.id)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      settings.proxyEngineMode === mode.id
                        ? 'border-[var(--accent-color)] bg-[var(--bg-hover)]'
                        : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)]'
                    }`}
                  >
                    <div className="text-xs font-bold text-[var(--text-main)]">{mode.name}</div>
                    <div className="text-[10px] text-[var(--text-muted)]">{mode.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Emergency Panic Hotkey */}
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3">
              <div>
                <h4 className="text-xs font-bold text-[var(--text-main)]">
                  Emergency Panic Hotkey & Redirect
                </h4>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Pressing this key instantly leaves grrmondays and redirects the tab to a safe URL
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-[var(--text-muted)] mb-1 block">
                    Panic Hotkey Trigger:
                  </label>
                  <input
                    type="text"
                    value={settings.panicKey}
                    onChange={(e) => handleUpdate('panicKey', e.target.value.slice(-1))}
                    maxLength={1}
                    className="w-20 h-8 px-3 text-center rounded bg-[var(--bg-surface)] border border-[var(--border-color)] font-mono text-sm font-bold text-[var(--text-main)] outline-none focus:border-[var(--accent-color)]"
                  />
                  <span className="text-[10px] text-[var(--text-dim)] ml-2">
                    (Default: <code className="text-purple-400">]</code>)
                  </span>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-[var(--text-muted)] mb-1 block">
                    Safe Redirect Destination:
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

        {/* TAB 4: DATA & STORAGE */}
        {activeTab === 'data' && (
          <div className="space-y-5 animate-fade-in">
            {/* Library Overview Card */}
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-main)]">
                    Games Library Status
                  </h4>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Local persistent library synchronized with extracted study.html games
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-[var(--accent-color)]">
                    {games.length}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] ml-1">games loaded</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border-color)]">
                <button
                  onClick={handleExportData}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] text-xs font-medium text-[var(--text-main)] transition-all"
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
                    if (window.confirm('Reset games library to full built-in collection (2,468 games)?')) {
                      onResetLibraryDefaults();
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] text-xs font-medium text-amber-300 transition-all ml-auto"
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
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-md transition-all"
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
