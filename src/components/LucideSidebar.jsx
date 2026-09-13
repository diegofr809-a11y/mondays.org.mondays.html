import React from 'react';
import {
  Home,
  Sparkles,
  Gamepad2,
  Settings,
} from 'lucide-react';

export const LucideSidebar = ({
  activeView,
  onSelectView,
  onOpenSettings,
}) => {
  return (
    <aside className="w-14 shrink-0 h-screen bg-[var(--bg-surface)] border-r border-[var(--border-color)] flex flex-col items-center py-3 select-none z-30">
      {/* Top Section: Bear Image Brand Logo */}
      <div className="flex flex-col items-center w-full mb-3">
        <button
          onClick={() => onSelectView('main')}
          className={`w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center p-0.5 transition-all cursor-pointer ${
            activeView === 'main'
              ? 'bg-[var(--bg-hover)] ring-2 ring-[var(--accent-color)] shadow-md shadow-black/40'
              : 'hover:bg-[var(--bg-hover)]'
          }`}
          title="grrmondays Main"
        >
          <img
            src="/image-removebg-preview.png"
            alt="Ted Bear Logo"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain filter drop-shadow-xs"
          />
        </button>
      </div>

      {/* Navigation Tabs at the Top Left */}
      <div className="flex flex-col items-center w-full space-y-2 pt-2 border-t border-[var(--border-color)]">
        {/* Main Tab */}
        <button
          onClick={() => onSelectView('main')}
          className={`w-11 py-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            activeView === 'main'
              ? 'text-[var(--accent-color)] bg-[var(--bg-hover)] border border-[var(--border-color)] shadow-xs'
              : 'text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
          }`}
          title="Main"
        >
          <Home className="w-4 h-4" />
          <span className="text-[9px] font-medium leading-none">Main</span>
        </button>

        {/* Games */}
        <button
          onClick={() => onSelectView('games')}
          className={`w-11 py-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            activeView === 'games'
              ? 'text-[var(--accent-color)] bg-[var(--bg-hover)] border border-[var(--border-color)] shadow-xs'
              : 'text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
          }`}
          title="Games Library"
        >
          <Gamepad2 className="w-4 h-4" />
          <span className="text-[9px] font-medium leading-none">Games</span>
        </button>

        {/* AI */}
        <button
          onClick={() => onSelectView('ai')}
          className={`w-11 py-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            activeView === 'ai'
              ? 'text-[var(--accent-color)] bg-[var(--bg-hover)] border border-[var(--border-color)] shadow-xs'
              : 'text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
          }`}
          title="grrmondays AI"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-[9px] font-medium leading-none">AI</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => onSelectView('settings')}
          className={`w-11 py-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            activeView === 'settings'
              ? 'text-[var(--accent-color)] bg-[var(--bg-hover)] border border-[var(--border-color)] shadow-xs'
              : 'text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
          }`}
          title="Settings & Themes"
        >
          <Settings className="w-4 h-4" />
          <span className="text-[9px] font-medium leading-none">Settings</span>
        </button>
      </div>
    </aside>
  );
};
