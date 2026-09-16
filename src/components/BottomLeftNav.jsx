import React, { useState, useRef, useEffect } from 'react';
import {
  Home,
  Gamepad2,
  Settings,
  Sparkles,
  Crown,
  X,
  Menu,
} from 'lucide-react';

export const BottomLeftNav = ({
  activeView,
  onSelectView,
  gamesCount = 2468,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const leaveTimerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleMouseEnter = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    leaveTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 280);
  };

  const handleToggleClick = (e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleButtonClick = (view) => {
    onSelectView(view);
    setIsOpen(false);
  };

  return (
    <nav
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="fixed bottom-5 left-5 z-50 select-none flex flex-col items-start pointer-events-auto"
      aria-label="Bottom Left Navigation"
    >
      {/* Pop-up Navigation Buttons: Appear above and fly up towards top left */}
      <div
        className={`mb-3 flex flex-col items-start gap-2.5 transition-all duration-300 transform origin-bottom-left ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="p-2 rounded-2xl bg-[var(--bg-card)]/95 backdrop-blur-md border border-[var(--border-color)] shadow-2xl flex flex-col gap-1.5 min-w-[200px]">
          {/* Header pill */}
          <div className="px-3 py-1.5 flex items-center justify-between border-b border-[var(--border-color)]/70 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-dim)]">
              #grrmondays
            </span>
            <span className="text-[10px] font-semibold text-[var(--text-dim)]">
              {gamesCount} Unlocked
            </span>
          </div>

          {/* 1. Home / Main (#grrmondays) */}
          <button
            onClick={() => handleButtonClick('main')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer group ${
              activeView === 'main'
                ? 'bg-[var(--accent-color)] text-white shadow-md'
                : 'text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
                activeView === 'main'
                  ? 'bg-white/20 text-white'
                  : 'bg-[var(--bg-surface)] text-[var(--accent-color)] border border-[var(--border-color)]'
              }`}
            >
              <Home className="w-4 h-4" />
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
                Home & Sound
              </div>
            </div>
          </button>

          {/* 2. Games Library */}
          <button
            onClick={() => handleButtonClick('games')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer group ${
              activeView === 'games'
                ? 'bg-[var(--accent-color)] text-white shadow-md'
                : 'text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
                activeView === 'games'
                  ? 'bg-white/20 text-white'
                  : 'bg-[var(--bg-surface)] text-[var(--accent-color)] border border-[var(--border-color)]'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
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
                {gamesCount} Games Unlocked
              </div>
            </div>
          </button>

          {/* 3. Settings (Themes & VIP inside) */}
          <button
            onClick={() => handleButtonClick('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer group ${
              activeView === 'settings'
                ? 'bg-[var(--accent-color)] text-white shadow-md'
                : 'text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
                activeView === 'settings'
                  ? 'bg-white/20 text-white'
                  : 'bg-[var(--bg-surface)] text-[var(--accent-color)] border border-[var(--border-color)]'
              }`}
            >
              <Settings className="w-4 h-4" />
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
                VIP, Themes & Cloak
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Primary Home Button on the Bottom Left */}
      <button
        onClick={handleToggleClick}
        aria-expanded={isOpen}
        title="Home & Menu (Hover or Click)"
        className={`w-13 h-13 rounded-2xl flex items-center justify-center shadow-xl border transition-all duration-200 cursor-pointer group relative ${
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

        {/* Subtle indicator ring when collapsed */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[var(--accent-color)] border-2 border-[var(--bg-base)]" />
        )}
      </button>
    </nav>
  );
};
