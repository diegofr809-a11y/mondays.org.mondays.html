import React, { useState, useEffect } from 'react';
import {
  getStoredGames,
  saveStoredGames,
  getStoredSettings,
  saveStoredSettings,
  saveFavoriteIds,
} from './utils/storage';
import { applyTabCloak, triggerPanic } from './utils/cloak';
import { applyTheme } from './utils/theme';
import { INITIAL_GAMES } from './data/initialData';
import { LucideSidebar } from './components/LucideSidebar';
import { LucideMainView } from './components/LucideMainView';
import { LucideHomeView } from './components/LucideHomeView';
import { LucideGamesView } from './components/LucideGamesView';
import { LucideSettingsView } from './components/LucideSettingsView';
import { ProxyBrowser } from './components/ProxyBrowser';
import { GamePlayerModal } from './components/GamePlayerModal';
import { AddGameModal } from './components/AddGameModal';
import { CheckCircle2, X } from 'lucide-react';

export default function App() {
  // Navigation View State: 'main' | 'home' | 'proxy' | 'games' | 'ai' | 'settings'
  const [activeView, setActiveView] = useState('main');
  const [browserInitialUrl, setBrowserInitialUrl] = useState('');

  // Persistent storage state
  const [games, setGames] = useState(getStoredGames);
  const [settings, setSettings] = useState(getStoredSettings);

  // Modals state
  const [isAddGameModalOpen, setIsAddGameModalOpen] = useState(false);
  const [activeGameToPlay, setActiveGameToPlay] = useState(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Apply theme dynamically to CSS variables whenever setting changes
  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

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

  // Global keydown listener for Panic hotkey
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
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.panicKey, settings.panicUrl]);

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
    setBrowserInitialUrl(queryOrUrl);
    setActiveView('proxy');
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

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[var(--bg-base)] text-[var(--text-main)] font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-main)] shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[var(--accent-color)] shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-[var(--text-dim)] hover:text-[var(--text-main)] p-0.5 ml-1"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Left Sidebar */}
      <LucideSidebar
        activeView={activeView}
        onSelectView={(v) => {
          if (v === 'main' || v === 'home') {
            setBrowserInitialUrl('');
          }
          setActiveView(v);
        }}
        onOpenSettings={() => setActiveView('settings')}
      />

      {/* Center Main Stage View */}
      <div className="flex-1 h-screen overflow-hidden flex flex-col relative min-w-0">
        {/* 0. Main View (Ted Bear & Quick Access) */}
        {activeView === 'main' && (
          <LucideMainView
            onSelectView={setActiveView}
            gamesCount={games.length}
          />
        )}

        {/* 1. Home View */}
        {activeView === 'home' && (
          <LucideHomeView onSearchOrNavigate={handleHomeSearchOrNavigate} />
        )}

        {/* 2. Web Proxy & Browser View */}
        {activeView === 'proxy' && (
          <ProxyBrowser
            initialUrl={browserInitialUrl}
            searchEngine={settings.defaultSearchEngine}
            onClose={() => {
              setActiveView('home');
              setBrowserInitialUrl('');
            }}
          />
        )}

        {/* 3. Games Library View (2468 Games) */}
        {activeView === 'games' && (
          <LucideGamesView
            games={games}
            onPlayGame={(g) => setActiveGameToPlay(g)}
            onOpenAddGame={() => setIsAddGameModalOpen(true)}
            onToggleFavorite={handleToggleFavorite}
            onDeleteGame={handleDeleteGame}
          />
        )}

        {/* 4. Settings Page */}
        {activeView === 'settings' && (
          <LucideSettingsView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            games={games}
            onImportGames={handleImportGames}
            onClearGames={handleClearGames}
            onResetLibraryDefaults={handleResetLibraryDefaults}
          />
        )}
      </div>

      {/* Modals */}
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
    </div>
  );
}
