import { Game, AppSettings, GameRequest, ShortcutItem } from '../types';
import { DEFAULT_SETTINGS, INITIAL_REQUESTS, DEFAULT_SHORTCUTS, INITIAL_GAMES } from '../data/initialData';

const STORAGE_KEYS = {
  GAMES: 'grrmondays_games_library_v2',
  SETTINGS: 'grrmondays_app_settings_v2',
  REQUESTS: 'grrmondays_game_requests_v2',
  SHORTCUTS: 'grrmondays_shortcuts_v2',
  FAVORITES: 'grrmondays_favorite_ids_v2',
};

export const getStoredShortcuts = (): ShortcutItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SHORTCUTS);
    if (!raw) return DEFAULT_SHORTCUTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_SHORTCUTS;
  } catch (err) {
    return DEFAULT_SHORTCUTS;
  }
};

export const saveStoredShortcuts = (shortcuts: ShortcutItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SHORTCUTS, JSON.stringify(shortcuts));
  } catch (err) {
    console.error('Failed to save shortcuts', err);
  }
};

export const getStoredGames = (): Game[] => {
  try {
    const favsRaw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    const favSet = new Set(favsRaw ? JSON.parse(favsRaw) : []);

    const raw = localStorage.getItem(STORAGE_KEYS.GAMES);
    if (!raw) {
      // Initialize with full 559 games
      const seeded = INITIAL_GAMES.map((g) => ({
        ...g,
        isFavorite: favSet.has(g.id),
      }));
      saveStoredGames(seeded);
      return seeded;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length >= 50) {
      return parsed.map((g) => ({
        ...g,
        isFavorite: favSet.has(g.id) || g.isFavorite,
      }));
    }
    // If older smaller list, upgrade to full 559 games
    const upgraded = INITIAL_GAMES.map((g) => ({
      ...g,
      isFavorite: favSet.has(g.id),
    }));
    saveStoredGames(upgraded);
    return upgraded;
  } catch (err) {
    console.error('Failed to load games from localStorage', err);
    return INITIAL_GAMES;
  }
};

export const saveStoredGames = (games: Game[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(games));
  } catch (err) {
    console.error('Failed to save games to localStorage', err);
  }
};

export const saveFavoriteIds = (ids: string[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(ids));
  } catch (err) {
    console.error('Failed to save favorites', err);
  }
};

export const getStoredSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch (err) {
    return DEFAULT_SETTINGS;
  }
};

export const saveStoredSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings', err);
  }
};

export const clearAllData = (): void => {
  try {
    localStorage.clear();
  } catch (err) {
    console.error('Failed to clear localStorage', err);
  }
};

export const getStoredRequests = (): GameRequest[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    return raw ? JSON.parse(raw) : INITIAL_REQUESTS;
  } catch (err) {
    return INITIAL_REQUESTS;
  }
};

export const saveStoredRequests = (requests: GameRequest[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  } catch (err) {
    console.error('Failed to save requests', err);
  }
};
