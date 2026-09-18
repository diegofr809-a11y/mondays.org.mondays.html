import React, { useState } from 'react';
import {
  Gamepad2,
  Home,
  Heart,
  Settings,
  Search,
  Plus,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Sliders,
  Folder,
} from 'lucide-react';
import { sounds } from '../../utils/sound';

export const WindowsDesktop = ({
  games = [],
  favoriteGames = [],
  shortcuts = [],
  onOpenWindow,
  onPlayGame,
  onOpenSearch,
  onOpenAddGame,
  onOpenSettingsTab,
  settings = {},
  activeWindowId,
  isAnyWindowOpen,
  onEasterEggClick,
  wallpaperStyle = {},
}) => {
  const [selectedIconId, setSelectedIconId] = useState(null);

  // Core system desktop apps (clean, understated Windows 11 style)
  const systemShortcuts = [
    {
      id: 'win-games',
      title: 'Games Library',
      type: 'window',
      windowId: 'games',
      iconBg: 'bg-[#202128] text-indigo-400 border border-white/10',
      icon: Gamepad2,
    },
    {
      id: 'win-favorites',
      title: 'Favorites',
      type: 'window',
      windowId: 'favorites',
      iconBg: 'bg-[#202128] text-rose-400 border border-white/10',
      icon: Heart,
    },
    {
      id: 'win-search',
      title: 'Search',
      type: 'action',
      action: 'search',
      iconBg: 'bg-[#202128] text-sky-400 border border-white/10',
      icon: Search,
    },
    {
      id: 'win-settings',
      title: 'Settings',
      type: 'window',
      windowId: 'settings',
      iconBg: 'bg-[#202128] text-zinc-300 border border-white/10',
      icon: Settings,
    },
    {
      id: 'win-add-game',
      title: 'Add Game',
      type: 'action',
      action: 'add-game',
      iconBg: 'bg-[#202128] text-amber-400 border border-white/10',
      icon: Plus,
    },
  ];

  const handleIconClick = (e, item) => {
    e.stopPropagation();
    sounds.playClick(settings.soundEffectsEnabled);
    setSelectedIconId(item.id);
  };

  const handleIconDoubleClick = (e, item) => {
    e.stopPropagation();
    sounds.playLaunch(settings.soundEffectsEnabled);
    launchItem(item);
  };

  const launchItem = (item) => {
    if (item.type === 'window') {
      onOpenWindow(item.windowId);
    } else if (item.type === 'action') {
      if (item.action === 'search') onOpenSearch();
      if (item.action === 'add-game') onOpenAddGame();
    }
  };

  return (
    <div
      id="windows-desktop-canvas"
      onClick={() => setSelectedIconId(null)}
      style={wallpaperStyle}
      className="absolute inset-0 bottom-12 overflow-hidden select-none bg-black"
    >
      {/* Subtle Windows 11 Dark Ambient Light */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-40 bg-[radial-gradient(circle_at_50%_40%,rgba(0,120,212,0.06)_0%,transparent_70%)]" />

      {/* Desktop Background Watermark / Logo (#grrmondays clickable sound) */}
      <div className="absolute right-8 top-8 sm:right-12 sm:top-12 z-0 opacity-40 hover:opacity-90 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEasterEggClick?.();
          }}
          className="text-right cursor-pointer group focus:outline-none"
          title="Click to play sound"
        >
          <div className="text-2xl sm:text-3xl font-black tracking-tight text-white/80 group-hover:text-[var(--accent-color)] transition-colors">
            #grrmondays
          </div>
          <div className="text-[10px] text-white/40 tracking-wider font-mono uppercase">
            Windows 11 Edition
          </div>
        </button>
      </div>

      {/* Clean Single Column of Desktop Icons */}
      <div className="relative z-10 h-full p-4 flex flex-col items-start gap-2 max-w-full overflow-y-auto">
        {systemShortcuts.map((item) => {
          const IconComponent = item.icon;
          const isSelected = selectedIconId === item.id;
          return (
            <div
              key={item.id}
              onClick={(e) => handleIconClick(e, item)}
              onDoubleClick={(e) => handleIconDoubleClick(e, item)}
              onTouchEnd={(e) => {
                if (selectedIconId === item.id) {
                  handleIconDoubleClick(e, item);
                } else {
                  handleIconClick(e, item);
                }
              }}
              className={`w-[78px] p-2 flex flex-col items-center gap-1.5 rounded-lg transition-all duration-100 cursor-pointer group ${
                isSelected
                  ? 'bg-sky-500/20 border border-sky-400/40 shadow-sm'
                  : 'hover:bg-white/10 hover:border hover:border-white/15 border border-transparent'
              }`}
            >
              <div className="relative w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-150 group-hover:scale-105 group-active:scale-95">
                <div className={`w-full h-full rounded-xl flex items-center justify-center ${item.iconBg} shadow-sm group-hover:border-white/20 transition-colors`}>
                  <IconComponent className="w-5 h-5 stroke-[1.8]" />
                </div>

                {/* Windows 11 Shortcut Arrow Overlay */}
                <div className="absolute -bottom-0.5 -left-0.5 w-3 h-3 bg-white/90 rounded-[2px] shadow flex items-center justify-center pointer-events-none">
                  <svg className="w-2 h-2 text-[#0078d4]" viewBox="0 0 10 10" fill="currentColor">
                    <path d="M2 2h4v1H3.7l3.65 3.65-.7.7L3 3.7V6H2V2z" />
                  </svg>
                </div>
              </div>

              <span className="text-[11px] font-medium text-white text-center leading-tight line-clamp-2 px-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                {item.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
