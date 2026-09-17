import React, { useState, useRef, useEffect } from 'react';
import {
  Home,
  LayoutDashboard,
  Gamepad2,
  Heart,
  Settings,
  X,
} from 'lucide-react';

export const BottomLeftNav = ({
  activeView,
  onSelectView,
  gamesCount = 1930,
  favoritesCount = 0,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const enterTimerRef = useRef(null);
  const leaveTimerRef = useRef(null);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    };
  }, []);

  // Open ONLY when cursor is actually right on the house button with a deliberate dwell
  const handleButtonMouseEnter = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
    }
    // Deliberate dwell delay (140ms) so accidental glancing passes near the button never open it
    enterTimerRef.current = setTimeout(() => {
      setIsOpen(true);
    }, 140);
  };

  const handleButtonMouseLeave = () => {
    if (enterTimerRef.current) {
      clearTimeout(enterTimerRef.current);
    }
  };

  // Keep open when cursor enters the popup menu
  const handleMenuMouseEnter = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
    }
  };

  // Close with slight grace period when cursor leaves the menu and button
  const handleNavMouseLeave = () => {
    if (enterTimerRef.current) {
      clearTimeout(enterTimerRef.current);
    }
    leaveTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 220);
  };

  const handleToggleClick = (e) => {
    e.stopPropagation();
    if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
    setIsOpen((prev) => !prev);
  };

  const handleButtonClick = (view) => {
    if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
    onSelectView(view);
    setIsOpen(false);
  };

  return (
    <nav
      id="bottom-left-nav"
      ref={containerRef}
      onMouseLeave={handleNavMouseLeave}
      className="fixed bottom-5 left-5 z-50 select-none pointer-events-auto"
      aria-label="Bottom Left Navigation"
    >
      {/* Pop-up Navigation Buttons: Positioned absolutely above the button */}
      <div
        id="bottom-left-nav-menu"
        onMouseEnter={handleMenuMouseEnter}
        className={`absolute bottom-full left-0 mb-3 before:content-[''] before:absolute before:-bottom-3 before:left-0 before:right-0 before:h-3 transition-all duration-200 transform origin-bottom-left ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto visible'
            : 'opacity-0 scale-90 translate-y-3 pointer-events-none invisible'
        }`}
      >
        <div className="p-2 rounded-2xl bg-[var(--bg-card)]/95 backdrop-blur-md border border-[var(--border-color)] shadow-2xl flex flex-col gap-1 min-w-[210px]">
          {/* Header pill */}
          <div className="px-3 py-1.5 flex items-center justify-between border-b border-[var(--border-color)]/70 mb-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-dim)]">
              #grrmondays
            </span>
            <span className="text-[10px] font-semibold text-[var(--accent-color)]">
              v4.0
            </span>
          </div>

          {/* 1. Main View (#grrmondays screen with top clock) */}
          <button
            onClick={() => handleButtonClick('main')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all cursor-pointer group ${
              activeView === 'main'
                ? 'bg-[var(--accent-color)] text-white shadow-md'
                : 'text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                activeView === 'main'
                  ? 'bg-white/20 text-white'
                  : 'bg-[var(--bg-surface)] text-[var(--accent-color)] border border-[var(--border-color)]'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold leading-tight truncate">
                #grrmondays
              </div>
              <div
                className={`text-[10px] truncate ${
                  activeView === 'main' ? 'text-white/80' : 'text-[var(--text-dim)]'
                }`}
              >
                Sound & Clock Screen
              </div>
            </div>
          </button>

          {/* 2. Home Dashboard */}
          <button
            onClick={() => handleButtonClick('home')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all cursor-pointer group ${
              activeView === 'home'
                ? 'bg-[var(--accent-color)] text-white shadow-md'
                : 'text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                activeView === 'home'
                  ? 'bg-white/20 text-white'
                  : 'bg-[var(--bg-surface)] text-sky-400 border border-[var(--border-color)]'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold leading-tight truncate">
                Dashboard
              </div>
              <div
                className={`text-[10px] truncate ${
                  activeView === 'home' ? 'text-white/80' : 'text-[var(--text-dim)]'
                }`}
              >
                Search & Recents
              </div>
            </div>
          </button>

          {/* 3. Games Library */}
          <button
            onClick={() => handleButtonClick('games')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all cursor-pointer group ${
              activeView === 'games'
                ? 'bg-[var(--accent-color)] text-white shadow-md'
                : 'text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                activeView === 'games'
                  ? 'bg-white/20 text-white'
                  : 'bg-[var(--bg-surface)] text-purple-400 border border-[var(--border-color)]'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold leading-tight truncate">
                Games Library
              </div>
              <div
                className={`text-[10px] truncate ${
                  activeView === 'games' ? 'text-white/80' : 'text-[var(--text-dim)]'
                }`}
              >
                {gamesCount} Verified Games
              </div>
            </div>
          </button>

          {/* 4. Favorites Tab */}
          <button
            onClick={() => handleButtonClick('favorites')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all cursor-pointer group ${
              activeView === 'favorites'
                ? 'bg-[var(--accent-color)] text-white shadow-md'
                : 'text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                activeView === 'favorites'
                  ? 'bg-white/20 text-white'
                  : 'bg-[var(--bg-surface)] text-rose-400 border border-[var(--border-color)]'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold leading-tight truncate">
                Favorites
              </div>
              <div
                className={`text-[10px] truncate ${
                  activeView === 'favorites' ? 'text-white/80' : 'text-[var(--text-dim)]'
                }`}
              >
                {favoritesCount} Starred Games
              </div>
            </div>
          </button>

          {/* 5. Settings */}
          <button
            onClick={() => handleButtonClick('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all cursor-pointer group ${
              activeView === 'settings'
                ? 'bg-[var(--accent-color)] text-white shadow-md'
                : 'text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                activeView === 'settings'
                  ? 'bg-white/20 text-white'
                  : 'bg-[var(--bg-surface)] text-amber-400 border border-[var(--border-color)]'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold leading-tight truncate">
                Settings
              </div>
              <div
                className={`text-[10px] truncate ${
                  activeView === 'settings'
                    ? 'text-white/80'
                    : 'text-[var(--text-dim)]'
                }`}
              >
                Themes, Clock & Audio
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Primary House Button: Only hover directly on this button triggers the dwell timer */}
      <button
        ref={buttonRef}
        id="bottom-left-home-btn"
        onClick={handleToggleClick}
        onMouseEnter={handleButtonMouseEnter}
        onMouseLeave={handleButtonMouseLeave}
        aria-expanded={isOpen}
        title="Menu (Hover house button or click)"
        className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl border transition-all duration-200 cursor-pointer group relative ${
          isOpen
            ? 'bg-[var(--accent-color)] text-white border-transparent shadow-[var(--accent-glow)] scale-105'
            : activeView === 'main'
            ? 'bg-[var(--bg-card)] text-[var(--accent-color)] border-[var(--accent-color)]/50 hover:scale-105 shadow-md'
            : 'bg-[var(--bg-card)] text-[var(--text-main)] border-[var(--border-color)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] hover:scale-105 shadow-md'
        }`}
      >
        {isOpen ? (
          <X className="w-5 h-5 transition-transform group-hover:rotate-90" />
        ) : (
          <Home className="w-5 h-5 transition-transform group-hover:scale-110" />
        )}

        {/* Subtle indicator dot */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[var(--accent-color)] border-2 border-[var(--bg-base)]" />
        )}
      </button>
    </nav>
  );
};
