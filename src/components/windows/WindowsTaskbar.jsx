import React, { useState, useEffect } from 'react';
import {
  Search,
  Gamepad2,
  Home,
  Heart,
  Settings,
  Bell,
  Volume2,
  VolumeX,
  Wifi,
  ChevronUp,
  CloudSun,
  Shield,
  Clock,
} from 'lucide-react';
import { sounds } from '../../utils/sound';

export const WindowsTaskbar = ({
  isStartMenuOpen,
  onToggleStartMenu,
  windows = {},
  activeWindowId,
  onToggleWindow,
  onOpenSearch,
  onOpenNotifications,
  unreadNotifsCount = 0,
  activeGameToPlay,
  onFocusGamePlayer,
  settings = {},
  onUpdateSettings,
  onShowDesktop,
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [showTrayFlyout, setShowTrayFlyout] = useState(false);

  // Keep live system clock and date updated
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: settings.clockFormat !== '24h',
      });
      const dateStr = now.toLocaleDateString([], {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
      });
      setCurrentTime(timeStr);
      setCurrentDate(dateStr);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, [settings.clockFormat]);

  // App definitions on taskbar
  const taskbarApps = [
    {
      id: 'home',
      name: 'Home Dashboard',
      icon: Home,
      color: 'text-sky-400',
    },
    {
      id: 'games',
      name: 'Games Library',
      icon: Gamepad2,
      color: 'text-indigo-400',
    },
    {
      id: 'favorites',
      name: 'Favorites',
      icon: Heart,
      color: 'text-rose-400',
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: Settings,
      color: 'text-zinc-300',
    },
  ];

  const toggleSound = () => {
    const nextState = !settings.soundEffectsEnabled;
    onUpdateSettings({ ...settings, soundEffectsEnabled: nextState });
    if (nextState) sounds.playClick(true);
  };

  return (
    <footer
      id="windows-taskbar"
      className="fixed bottom-0 left-0 right-0 h-12 bg-[#121216]/90 backdrop-blur-2xl border-t border-white/10 z-50 flex items-center justify-between px-2 select-none"
    >
      {/* LEFT: Windows Widgets / Weather */}
      <div className="flex items-center gap-2 min-w-0 w-28 sm:w-44">
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md hover:bg-white/10 transition-colors text-xs text-zinc-300 cursor-pointer">
          <CloudSun className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="truncate">
            <span className="font-semibold text-white">72°F</span>
            <span className="text-[11px] text-zinc-400 ml-1.5 hidden md:inline">Sunny</span>
          </div>
        </div>
      </div>

      {/* CENTER: Windows 11 Center Dock */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {/* Windows 11 Start Button */}
        <button
          id="win-start-btn"
          onClick={() => {
            sounds.playClick(settings.soundEffectsEnabled);
            onToggleStartMenu();
          }}
          title="Start"
          aria-label="Start"
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150 group cursor-pointer ${
            isStartMenuOpen
              ? 'bg-white/15 scale-95'
              : 'hover:bg-white/10 active:scale-95'
          }`}
        >
          <svg
            className="w-5 h-5 transition-transform duration-200 group-hover:scale-105"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            {/* Windows 11 Cyan 4-Tile Logo */}
            <path
              className="text-[#0078d4]"
              d="M1.5 2.5h7.5v7H1.5v-7zm9 0h8v7h-8v-7zm-9 8.5h7.5v7H1.5v-7zm9 0h8v7h-8v-7z"
            />
          </svg>
        </button>

        {/* Windows Search Pill / Button */}
        <button
          onClick={() => {
            sounds.playClick(settings.soundEffectsEnabled);
            onOpenSearch();
          }}
          title="Search (Ctrl+K)"
          aria-label="Search"
          className="h-9 px-2.5 rounded-lg flex items-center gap-2 text-zinc-300 hover:text-white hover:bg-white/10 transition-all text-xs cursor-pointer group"
        >
          <Search className="w-4 h-4 text-zinc-400 group-hover:text-sky-400 transition-colors" />
          <span className="hidden md:inline text-zinc-400 group-hover:text-zinc-200">
            Search
          </span>
        </button>

        {/* Running / Pinned Apps */}
        {taskbarApps.map((app) => {
          const winState = windows[app.id];
          const isOpen = winState?.isOpen;
          const isFocused = isOpen && !winState?.isMinimized && activeWindowId === app.id;
          const isMinimized = winState?.isMinimized;
          const IconComp = app.icon;

          return (
            <button
              key={app.id}
              onClick={() => {
                sounds.playClick(settings.soundEffectsEnabled);
                onToggleWindow(app.id);
              }}
              title={app.name}
              aria-label={app.name}
              className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150 group cursor-pointer ${
                isFocused
                  ? 'bg-white/15'
                  : isOpen
                  ? 'bg-white/5 hover:bg-white/10'
                  : 'hover:bg-white/10'
              }`}
            >
              <div className={`${app.color} transition-transform duration-150 group-hover:scale-110 group-active:scale-95`}>
                <IconComp className="w-5 h-5" />
              </div>

              {/* Windows 11 Running Pill Indicator underneath icon */}
              {isOpen && (
                <div
                  className={`absolute bottom-0.5 rounded-full transition-all duration-200 ${
                    isFocused
                      ? 'w-4 h-1 bg-[var(--accent-color)] shadow-sm'
                      : isMinimized
                      ? 'w-1.5 h-1.5 bg-zinc-400'
                      : 'w-2 h-1 bg-white/60'
                  }`}
                />
              )}
            </button>
          );
        })}

        {/* If a game is currently playing, display active game in taskbar */}
        {activeGameToPlay && (
          <button
            onClick={() => {
              sounds.playClick(settings.soundEffectsEnabled);
              onFocusGamePlayer();
            }}
            title={`Playing: ${activeGameToPlay.title}`}
            className="relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150 bg-emerald-500/20 border border-emerald-500/30 hover:bg-emerald-500/30 group cursor-pointer"
          >
            {activeGameToPlay.thumbnail ? (
              <img
                src={activeGameToPlay.thumbnail}
                alt={activeGameToPlay.title}
                className="w-6 h-6 rounded object-cover shadow"
                referrerPolicy="no-referrer"
              />
            ) : (
              <Gamepad2 className="w-5 h-5 text-emerald-400" />
            )}

            {/* Active running pulse dot */}
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400" />

            {/* Active running indicator pill */}
            <div className="absolute bottom-0.5 w-4 h-1 rounded-full bg-emerald-400" />
          </button>
        )}
      </div>

      {/* RIGHT: Windows System Tray */}
      <div className="flex items-center gap-1 min-w-0">
        {/* Tray Overflow Arrow */}
        <div className="relative">
          <button
            onClick={() => setShowTrayFlyout(!showTrayFlyout)}
            title="Hidden icons & Panic Cloak"
            className="w-7 h-8 rounded flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>

          {/* Quick Tray Flyout */}
          {showTrayFlyout && (
            <div className="absolute right-0 bottom-10 w-48 rounded-xl bg-[#202026] border border-white/15 shadow-2xl p-2 z-50 text-xs text-white">
              <div className="font-semibold text-zinc-400 text-[10px] uppercase tracking-wider mb-1.5 px-2">
                System Status
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 text-zinc-300">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Panic: <kbd className="px-1 py-0.5 rounded bg-white/10 font-mono text-[10px]">{settings.panicKey || ']'}</kbd></span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 text-zinc-300">
                <Wifi className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Connected</span>
              </div>
            </div>
          )}
        </div>

        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          title={settings.soundEffectsEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
          aria-label={settings.soundEffectsEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
          className="w-7 h-8 rounded flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          {settings.soundEffectsEnabled ? (
            <Volume2 className="w-4 h-4 text-zinc-200" />
          ) : (
            <VolumeX className="w-4 h-4 text-rose-400" />
          )}
        </button>

        {/* Wifi status */}
        <div className="hidden sm:flex w-7 h-8 items-center justify-center text-zinc-400">
          <Wifi className="w-4 h-4" />
        </div>

        {/* Notification Bell with Badge */}
        <button
          onClick={() => {
            sounds.playClick(settings.soundEffectsEnabled);
            onOpenNotifications();
          }}
          title="Notification Center"
          aria-label="Notification Center"
          className="relative w-8 h-8 rounded flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#121216]" />
          )}
        </button>

        {/* Windows Live Clock & Date */}
        <button
          onClick={() => {
            sounds.playClick(settings.soundEffectsEnabled);
            onToggleWindow('home');
          }}
          title="Clock & Calendar"
          className="px-2 py-0.5 rounded hover:bg-white/10 transition-colors text-right flex flex-col justify-center leading-none"
        >
          <span className="text-[11px] sm:text-xs font-medium text-white">
            {currentTime || '5:46 PM'}
          </span>
          <span className="text-[10px] text-zinc-400 font-normal">
            {currentDate || '9/17/2026'}
          </span>
        </button>

        {/* Windows 11 "Show Desktop" line & trigger */}
        <div className="flex items-center pl-1 h-full">
          <div className="w-[1px] h-5 bg-white/10" />
          <button
            onClick={() => {
              sounds.playClick(settings.soundEffectsEnabled);
              onShowDesktop();
            }}
            title="Show Desktop"
            aria-label="Show Desktop"
            className="w-2.5 sm:w-3 h-full hover:bg-white/20 active:bg-white/30 transition-colors cursor-pointer"
          />
        </div>
      </div>
    </footer>
  );
};
