export type GameCategoryType = 
  | 'all'
  | 'action'
  | 'arcade'
  | 'puzzle'
  | 'sports'
  | 'racing'
  | 'classic'
  | 'multiplayer'
  | 'casual'
  | 'favorites'
  | 'other';

export interface Game {
  id: string;
  title: string;
  category: GameCategoryType;
  description?: string;
  tags?: string[];
  url: string;
  thumbnailUrl?: string;
  type?: 'embed' | 'proxy';
  addedAt: string;
  plays: number;
  rating?: number;
  isFavorite?: boolean;
  isCustom?: boolean;
}

export interface CategoryItem {
  id: GameCategoryType;
  name: string;
  icon: string;
}

export interface GameRequest {
  id: string;
  title: string;
  category: string;
  votes: number;
  requestedAt: string;
  status: 'pending' | 'in-review' | 'planned';
}

export type ThemeId = 
  | 'midnight'
  | 'oled'
  | 'light'
  | 'cyberpunk'
  | 'dracula'
  | 'nord'
  | 'emerald'
  | 'sunset'
  | 'synthwave'
  | 'oceanic';

export type SearchEngineId = 'duckduckgo' | 'google' | 'bing' | 'brave';
export type ProxyEngineMode = 'direct' | 'ultraviolet' | 'wisp';

export interface AppSettings {
  // Theme & Appearance
  theme: ThemeId;
  
  // Tab Cloaking
  activeCloak: string;
  customCloakTitle?: string;
  customCloakFavicon?: string;
  panicKey: string;
  panicUrl: string;

  // Search & Navigation
  defaultSearchEngine: SearchEngineId;
  proxyEngineMode: ProxyEngineMode;

  // AI Configuration
  aiTemperature: number; // 0.2, 0.7, 1.0
  aiSystemInstructions: string;
  aiCustomApiKey?: string;
}

export interface BrowserTab {
  id: string;
  title: string;
  url: string;
  mode: 'new-tab' | 'browser' | 'games' | 'ai' | 'account' | 'settings';
  favicon?: string;
}

export interface ShortcutItem {
  id: string;
  name: string;
  url: string;
  iconType:
    | 'tiktok'
    | 'youtube'
    | 'discord'
    | 'spotify'
    | 'classroom'
    | 'roblox'
    | 'twitch'
    | 'reddit'
    | 'twitter'
    | 'custom'
    | string;
  iconUrl?: string;
  color?: string;
}
