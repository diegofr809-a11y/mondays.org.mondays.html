import React, { useState, useEffect } from 'react';
import {
  getStoredGames,
  saveStoredGames,
  getStoredSettings,
  saveStoredSettings,
  saveFavoriteIds,
  addStoredRecentlyOpened,
  getStoredNotifications,
  saveStoredNotifications,
} from './utils/storage';
import { applyTabCloak, triggerPanic } from './utils/cloak';
import { applyTheme, applyCursor, WALLPAPERS } from './utils/theme';
import { INITIAL_GAMES, DEFAULT_SHORTCUTS } from './data/initialData';
import { BottomLeftNav } from './components/BottomLeftNav';
import { LucideMainView } from './components/LucideMainView';
import { LucideHomeView } from './components/LucideHomeView';
import { LucideGamesView } from './components/LucideGamesView';
import { LucideSettingsView } from './components/LucideSettingsView';
import { ProxyBrowser } from './components/ProxyBrowser';
import { GamePlayerModal } from './components/GamePlayerModal';
import { AddGameModal } from './components/AddGameModal';
import { UniversalSearchModal } from './components/UniversalSearchModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { CheckCircle2, X } from 'lucide-react';
import { sounds } from './utils/sound';

export default function App() {
  // Navigation View State: 'main' | 'home' | 'proxy' | 'games' | 'favorites' | 'settings'
  const [activeView, setActiveView] = useState('main');
  const [settingsInitialTab, setSettingsInitialTab] = useState('appearance');
  const [browserInitialUrl, setBrowserInitialUrl] = useState('');

  // Persistent storage state
  const [games, setGames] = useState(getStoredGames);
  const [settings, setSettings] = useState(getStoredSettings);
  const [notifications, setNotifications] = useState(getStoredNotifications);

  // Modals state
  const [isAddGameModalOpen, setIsAddGameModalOpen] = useState(false);
  const [activeGameToPlay, setActiveGameToPlay] = useState(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSelectView = (v, initialTab = 'appearance') => {
    sounds.playClick(settings.soundEffectsEnabled);
    if (v === 'main' || v === 'home') {
      setBrowserInitialUrl('');
    }
    if (v === 'settings') {
      setSettingsInitialTab(initialTab);
    }
    setActiveView(v);
  };

  // Apply theme dynamically to CSS variables whenever setting changes
  useEffect(() => {
    applyTheme(settings.theme, settings.customAccentColor, settings.customCursor);
  }, [settings.theme, settings.customAccentColor, settings.customCursor]);

  // Apply tab disguise whenever activeCloak or custom settings change
  useEffect(() => {
    applyTabCloak(
      settings.activeCloak,
      settings.customCloakTitle,
      settings.customCloakFavicon
    );
  }, [settings.activeCloak, settings.customCloakTitle, settings.customCloakFavicon]);

  // Ensure games library catalog is updated with the full dataset
  useEffect(() => {
    if (games.length < INITIAL_GAMES.length) {
      const fullLibrary = getStoredGames();
      setGames(fullLibrary);
    }
  }, [games.length]);

  // Global keydown listener for Panic hotkey and Search hotkey
  useEffect(() => {
    const handleKeyDown = (e) => {
      const target = e.target;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // Panic Key Trigger
      if (e.key === settings.panicKey && !isInput) {
        e.preventDefault();
        triggerPanic(settings.panicUrl);
        return;
      }

      // Universal Search Shortcuts: "/" or "Ctrl+K" / "Cmd+K"
      if (!isInput && (e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key === 'k'))) {
        e.preventDefault();
        sounds.playClick(settings.soundEffectsEnabled);
        setIsSearchModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.panicKey, settings.panicUrl, settings.soundEffectsEnabled]);

  // Anti-close safety confirmation listener
  useEffect(() => {
    if (!settings.confirmBeforeLeave) return;
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [settings.confirmBeforeLeave]);

  // Handle Search or URL navigation from Home Omnibar
  const handleHomeSearchOrNavigate = (queryOrUrl) => {
    sounds.playLaunch(settings.soundEffectsEnabled);
    setBrowserInitialUrl(queryOrUrl);
    setActiveView('proxy');
  };

  // Launch game handler
  const handlePlayGame = (game) => {
    sounds.playLaunch(settings.soundEffectsEnabled);
    addStoredRecentlyOpened(game);
    setActiveGameToPlay(game);
  };

  // Game management actions
  const handleAddGame = (newGame) => {
    const updated = [{ ...newGame, isCustom: true }, ...games];
    setGames(updated);
    saveStoredGames(updated);
    showToast(`Added "${newGame.title}" to library`);
  };

  const handleDeleteGame = (gameId) => {
    const target = games.find((g) => g.id === gameId);
    const updated = games.filter((g) => g.id !== gameId);
    setGames(updated);
    saveStoredGames(updated);
    showToast(`Removed "${target?.title || 'game'}"`);
  };

  const handleToggleFavorite = (gameId) => {
    sounds.playPop(settings.soundEffectsEnabled);
    const updated = games.map((g) =>
      g.id === gameId ? { ...g, isFavorite: !g.isFavorite } : g
    );
    setGames(updated);
    saveStoredGames(updated);
    const favIds = updated.filter((g) => g.isFavorite).map((g) => g.id);
    saveFavoriteIds(favIds);
  };

  const handleRecordPlay = (gameId) => {
    const updated = games.map((g) =>
      g.id === gameId ? { ...g, plays: (g.plays || 0) + 1 } : g
    );
    setGames(updated);
    saveStoredGames(updated);
  };

  const handleImportGames = (imported) => {
    const combined = [...imported, ...games];
    const unique = Array.from(new Map(combined.map((g) => [g.id, g])).values());
    setGames(unique);
    saveStoredGames(unique);
    showToast(`Imported ${imported.length} games`);
  };

  const handleClearGames = () => {
    setGames([]);
    saveStoredGames([]);
    showToast('Library cleared');
  };

  const handleResetLibraryDefaults = () => {
    setGames(INITIAL_GAMES);
    saveStoredGames(INITIAL_GAMES);
    showToast(`Reset library to ${INITIAL_GAMES.length} games`);
  };

  // Settings update
  const handleUpdateSettings = (newSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
    showToast('Settings saved');
  };

  // Notifications management
  const handleMarkAllNotifsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    saveStoredNotifications(updated);
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    saveStoredNotifications([]);
  };

  const handleNotificationAction = (action) => {
    if (action === 'changelog') {
      handleSelectView('settings', 'changelog');
    }
  };

  // Compute wallpaper style
  const activeWallpaper =
    settings.wallpaper === 'custom' && settings.customWallpaperUrl
      ? { id: 'custom', css: `url("${settings.customWallpaperUrl}")`, size: 'cover' }
      : WALLPAPERS.find((w) => w.id === (settings.wallpaper || 'none')) || WALLPAPERS[0];

  const favoriteGames = games.filter((g) => g.isFavorite);
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      className="h-screen w-screen overflow-hidden flex bg-[var(--bg-base)] text-[var(--text-main)] font-sans selection:bg-purple-500/30 selection:text-purple-200"
      style={{
        backgroundImage: activeWallpaper.css !== 'none' ? activeWallpaper.css : undefined,
        backgroundSize: activeWallpaper.size || 'auto',
      }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-18 right-5 z-50 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-main)] shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[var(--accent-color)] shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-[var(--text-dim)] hover:text-[var(--text-main)] p-0.5 ml-1 cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Discord Button (Bottom Right) */}
      <a
        id="discord-invite-btn"
        href="https://discord.gg/QtCDfSyad3"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Join Discord Server"
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-lg shadow-[#5865F2]/25 hover:shadow-[#5865F2]/40 transition-all duration-200 active:scale-95 select-none border border-white/10 group cursor-pointer"
      >
        <svg
          className="w-4 h-4 fill-current transition-transform duration-200 group-hover:scale-110 shrink-0"
          viewBox="0 0 127.14 96.36"
          aria-hidden="true"
        >
          <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,45.91,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,45.91,96.12,53,91.08,65.69,84.69,65.69Z" />
        </svg>
        <span className="text-xs font-semibold tracking-wide">Discord</span>
      </a>

      {/* Floating Bottom-Left Navigation: Home button that pops up navigation upwards */}
      <BottomLeftNav
        activeView={activeView}
        onSelectView={handleSelectView}
        gamesCount={games.length}
        favoritesCount={favoriteGames.length}
      />

      {/* Main Screen / Content Views */}
      <div className="flex-1 h-screen overflow-hidden flex flex-col relative min-w-0">
        {/* 0. Main View (#grrmondays screen with clock at top and center toggle setting) */}
        {activeView === 'main' && (
          <LucideMainView
            settings={settings}
            onOpenSettings={(tab) => handleSelectView('settings', tab)}
          />
        )}

        {/* 1. Home Dashboard View (Search, Recents, Favorites Shelf, Web Apps) */}
        {activeView === 'home' && (
          <LucideHomeView
            games={games}
            settings={settings}
            onSearchOrNavigate={handleHomeSearchOrNavigate}
            onPlayGame={handlePlayGame}
            onLaunchApp={(url) => {
              const shortcut = DEFAULT_SHORTCUTS.find((s) => s.url === url);
              if (shortcut) {
                addStoredRecentlyOpened({
                  id: shortcut.id,
                  title: shortcut.name,
                  url: shortcut.url,
                  category: 'Web App',
                });
              }
              handleHomeSearchOrNavigate(url);
            }}
            onOpenSearchModal={() => setIsSearchModalOpen(true)}
            onOpenNotifications={() => setIsNotifModalOpen(true)}
            unreadNotifsCount={unreadNotifsCount}
            onSelectView={handleSelectView}
          />
        )}

        {/* 2. Web Proxy & Browser View */}
        {activeView === 'proxy' && (
          <ProxyBrowser
            initialUrl={browserInitialUrl}
            searchEngine={settings.defaultSearchEngine}
            onClose={() => {
              setActiveView('main');
              setBrowserInitialUrl('');
            }}
          />
        )}

        {/* 3. Games Library View */}
        {activeView === 'games' && (
          <LucideGamesView
            games={games}
            onPlayGame={handlePlayGame}
            onOpenAddGame={() => setIsAddGameModalOpen(true)}
            onToggleFavorite={handleToggleFavorite}
            onDeleteGame={handleDeleteGame}
          />
        )}

        {/* 4. Dedicated Favorites Tab */}
        {activeView === 'favorites' && (
          <LucideGamesView
            games={favoriteGames}
            onPlayGame={handlePlayGame}
            onOpenAddGame={() => setIsAddGameModalOpen(true)}
            onToggleFavorite={handleToggleFavorite}
            onDeleteGame={handleDeleteGame}
            initialFilter="favorites"
          />
        )}

        {/* 5. Settings View */}
        {activeView === 'settings' && (
          <LucideSettingsView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            games={games}
            onImportGames={handleImportGames}
            onClearGames={handleClearGames}
            onResetLibraryDefaults={handleResetLibraryDefaults}
            initialTab={settingsInitialTab}
          />
        )}
      </div>

      {/* Modals & Dialogs */}
      <AddGameModal
        isOpen={isAddGameModalOpen}
        onClose={() => setIsAddGameModalOpen(false)}
        onAddGame={handleAddGame}
      />

      {activeGameToPlay && (
        <GamePlayerModal
          game={activeGameToPlay}
          onClose={() => setActiveGameToPlay(null)}
          onToggleFavorite={handleToggleFavorite}
          onRecordPlay={handleRecordPlay}
        />
      )}

      {/* Universal Search Modal */}
      <UniversalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        games={games}
        onSelectGame={handlePlayGame}
        onSelectApp={handleHomeSearchOrNavigate}
        onSelectWallpaper={(wpId) => {
          handleUpdateSettings({ ...settings, wallpaper: wpId });
          showToast('Wallpaper applied');
        }}
        onOpenSettingsTab={(tab) => handleSelectView('settings', tab)}
        soundEffectsEnabled={settings.soundEffectsEnabled}
      />

      {/* Notification Center Modal */}
      <NotificationCenterModal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotifsRead}
        onClearNotifications={handleClearNotifications}
        onOpenAction={handleNotificationAction}
        soundEffectsEnabled={settings.soundEffectsEnabled}
      />
    </div>
  );
}
