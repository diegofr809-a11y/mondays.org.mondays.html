import React, { useState } from 'react';
import {
  Gamepad2,
  Search,
  Globe,
  Shield,
  AlertTriangle,
  Plus,
  Menu,
  X,
  Settings,
} from 'lucide-react';
import { AppSettings } from '../types';
import { CLOAK_PRESETS } from '../data/initialData';

interface NavbarProps {
  activeTab: 'home' | 'games' | 'categories' | 'proxy' | 'requests';
  setActiveTab: (tab: 'home' | 'games' | 'categories' | 'proxy' | 'requests') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenAddGame: () => void;
  onOpenSettings: () => void;
  onPanic: () => void;
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  gamesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenAddGame,
  onOpenSettings,
  onPanic,
  settings,
  onUpdateSettings,
  gamesCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cloakDropdownOpen, setCloakDropdownOpen] = useState(false);

  const handleSelectCloak = (cloakId: string) => {
    onUpdateSettings({ ...settings, activeCloak: cloakId });
    setCloakDropdownOpen(false);
  };

  const navItems: { id: 'home' | 'games' | 'categories' | 'proxy' | 'requests'; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'games', label: 'Games' },
    { id: 'categories', label: 'Categories' },
    { id: 'proxy', label: 'Web Proxy' },
    { id: 'requests', label: 'Requests' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#111319] border-b border-[#222733] select-none text-xs">
      <div className="max-w-[1500px] mx-auto px-3">
        <div className="flex items-center justify-between h-11 gap-3">
          
          {/* Logo / Website Name */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-1.5 focus:outline-none"
              id="navbar-logo"
            >
              <div className="w-6 h-6 rounded-xs bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Gamepad2 className="w-3.5 h-3.5" />
              </div>
              <span className="font-extrabold text-sm tracking-tight text-white">
                UNBLOCKED<span className="text-emerald-400 font-normal ml-1">GAMES</span>
              </span>
            </button>
          </div>

          {/* Search bar near the top */}
          <div className="flex-1 max-w-xs sm:max-w-sm mx-2">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 w-3.5 h-3.5 text-[#556075] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== 'games' && activeTab !== 'home') {
                    setActiveTab('games');
                  }
                }}
                placeholder="Search games..."
                className="w-full pl-8 pr-7 py-1 bg-[#161a22] text-white placeholder-[#556075] text-xs rounded-xs border border-[#262c3a] focus:outline-none focus:border-emerald-500/60 focus:bg-[#191e27]"
                id="main-nav-search-bar"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 text-[#556075] hover:text-white p-0.5"
                  title="Clear"
                >
                  <X className="w-3 h-3" />
                </button>
              ) : (
                <kbd className="absolute right-2 hidden md:inline-block px-1 text-[9px] bg-[#202533] text-[#6b7994] rounded-xs border border-[#2b3345] font-mono">
                  /
                </kbd>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-2.5 py-1 rounded-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#1e2330] text-emerald-400 border border-emerald-500/30'
                      : 'text-[#8592a8] hover:text-white hover:bg-[#181c26] border border-transparent'
                  }`}
                  id={`nav-link-${item.id}`}
                >
                  {item.label}
                  {item.id === 'games' && gamesCount > 0 && (
                    <span className="ml-1 text-[10px] font-mono px-1 py-0.2 rounded-xs bg-[#242b3a] text-[#a0aec0]">
                      {gamesCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Stealth & Utility Controls */}
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            {/* Add Custom Game Button */}
            <button
              onClick={onOpenAddGame}
              className="flex items-center gap-1 px-2 py-1 rounded-xs bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-xs font-bold border border-emerald-500/30 transition-colors"
              title="Add Custom Game URL"
              id="header-add-game-btn"
            >
              <Plus className="w-3 h-3" />
              <span>Add Game</span>
            </button>

            {/* Cloak Disguise Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCloakDropdownOpen(!cloakDropdownOpen)}
                className={`p-1 rounded-xs border text-xs transition-colors ${
                  settings.activeCloak !== 'none'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-[#161a22] text-[#8592a8] hover:text-white border-[#262c3a]'
                }`}
                title="Tab Cloak / Disguise"
                id="header-cloak-btn"
              >
                <Shield className="w-3.5 h-3.5" />
              </button>

              {cloakDropdownOpen && (
                <div className="absolute right-0 mt-1 w-44 bg-[#141720] border border-[#272e3d] rounded-xs shadow-xl py-1 z-50 text-xs">
                  <div className="px-2.5 py-1 text-[10px] font-bold text-[#556075] uppercase tracking-wider">
                    Tab Disguise
                  </div>
                  {CLOAK_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleSelectCloak(p.id)}
                      className={`w-full text-left px-2.5 py-1 flex items-center justify-between hover:bg-[#1d222e] transition-colors ${
                        settings.activeCloak === p.id ? 'text-emerald-400 font-bold' : 'text-[#cbd5e1]'
                      }`}
                    >
                      <span>{p.name}</span>
                      {settings.activeCloak === p.id && <span className="text-[10px]">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Panic Key Button */}
            <button
              onClick={onPanic}
              className="flex items-center gap-1 px-2 py-1 rounded-xs bg-red-950/40 hover:bg-red-900/60 text-red-400 text-xs font-bold border border-red-800/40 transition-colors"
              title={`Emergency panic redirect (Press ${settings.panicKey})`}
              id="header-panic-btn"
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Panic [{settings.panicKey}]</span>
            </button>

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              className="p-1 rounded-xs bg-[#161a22] hover:bg-[#1d222e] text-[#8592a8] hover:text-white border border-[#262c3a] transition-colors"
              title="Settings"
              id="header-settings-btn"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex lg:hidden items-center gap-1">
            <button
              onClick={onPanic}
              className="p-1 rounded-xs bg-red-950/50 text-red-400 border border-red-800/50 text-xs"
              title="Panic Redirect"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 rounded-xs bg-[#161a22] text-[#8592a8] border border-[#262c3a]"
              id="mobile-nav-toggle"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>

      {/* Clean Collapsible Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#222733] bg-[#0f1117] p-2 space-y-1.5">
          <div className="grid grid-cols-2 gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-2.5 py-1.5 rounded-xs font-bold text-left ${
                  activeTab === item.id
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-[#151821] text-[#8592a8] border border-[#222733]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 pt-1.5 border-t border-[#1e2330]">
            <button
              onClick={() => {
                onOpenAddGame();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-1.5 rounded-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add Game URL</span>
            </button>
            <button
              onClick={() => {
                onOpenSettings();
                setMobileMenuOpen(false);
              }}
              className="p-1.5 rounded-xs bg-[#161a22] text-[#8592a8] border border-[#262c3a]"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
