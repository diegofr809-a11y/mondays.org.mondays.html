import { CategoryItem, AppSettings, GameRequest, Game } from '../types';
import gamesData from './games.json';

export const CATEGORIES: CategoryItem[] = [
  { id: 'all', name: 'All Games', icon: 'Gamepad2' },
  { id: 'favorites', name: 'Favorites', icon: 'Heart' },
  { id: 'action', name: 'Action', icon: 'Zap' },
  { id: 'arcade', name: 'Arcade', icon: 'Flame' },
  { id: 'classic', name: 'Classic / Retro', icon: 'Crown' },
  { id: 'puzzle', name: 'Puzzle & Logic', icon: 'Puzzle' },
  { id: 'multiplayer', name: 'Multiplayer', icon: 'Users' },
  { id: 'racing', name: 'Racing', icon: 'Car' },
  { id: 'sports', name: 'Sports', icon: 'Trophy' },
  { id: 'casual', name: 'Casual', icon: 'Boxes' },
];

export const CLOAK_PRESETS = [
  {
    id: 'none',
    name: 'Default (grrmondays)',
    title: 'grrmondays',
    favicon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%239333ea%22 stroke-width=%222%22><polygon points=%226 3 20 12 6 21 6 3%22/></svg>',
  },
  {
    id: 'classroom',
    name: 'Google Classroom',
    title: 'Classes',
    favicon: 'https://ssl.gstatic.com/classroom/favicon.png',
  },
  {
    id: 'canvas',
    name: 'Canvas LMS',
    title: 'Dashboard',
    favicon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico',
  },
  {
    id: 'docs',
    name: 'Google Docs',
    title: 'Google Docs',
    favicon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico',
  },
  {
    id: 'drive',
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    favicon: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png',
  },
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    title: 'Wikipedia, the free encyclopedia',
    favicon: 'https://en.wikipedia.org/static/favicon/wikipedia.ico',
  },
  {
    id: 'clever',
    name: 'Clever Portal',
    title: 'Clever | Portal',
    favicon: 'https://assets.clever.com/launchpad/1.7.0/favicon.ico',
  },
];

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'midnight',
  activeCloak: 'none',
  customCloakTitle: '',
  customCloakFavicon: '',
  panicKey: ']',
  panicUrl: 'https://classroom.google.com',
  defaultSearchEngine: 'duckduckgo',
  proxyEngineMode: 'direct',
  aiTemperature: 0.7,
  aiSystemInstructions: 'You are grrmondays AI, a sharp, helpful, concise assistant.',
  aiCustomApiKey: '',
};

export const INITIAL_GAMES: Game[] = gamesData as Game[];

export const INITIAL_REQUESTS: GameRequest[] = [
  {
    id: 'req-1',
    title: '1v1.LOL',
    category: 'Action',
    votes: 84,
    requestedAt: '2026-09-09',
    status: 'planned',
  },
  {
    id: 'req-2',
    title: 'Slope',
    category: 'Arcade',
    votes: 72,
    requestedAt: '2026-09-10',
    status: 'planned',
  },
  {
    id: 'req-3',
    title: 'Retro Bowl',
    category: 'Sports',
    votes: 59,
    requestedAt: '2026-09-10',
    status: 'in-review',
  },
];

export const DEFAULT_PROXIES = [
  { name: 'DuckDuckGo Web', url: 'https://html.duckduckgo.com/html/' },
  { name: 'Wikipedia', url: 'https://en.wikipedia.org' },
  { name: 'Desmos Math', url: 'https://www.desmos.com/calculator' },
  { name: 'Scratch Studio', url: 'https://scratch.mit.edu' },
  { name: 'W3Schools', url: 'https://www.w3schools.com' },
];

export const DEFAULT_SHORTCUTS = [
  {
    id: 'tiktok',
    name: 'TikTok',
    url: 'https://www.tiktok.com',
    iconType: 'tiktok' as const,
  },
  {
    id: 'youtube',
    name: 'YouTube',
    url: 'https://www.youtube.com',
    iconType: 'youtube' as const,
  },
  {
    id: 'discord',
    name: 'Discord',
    url: 'https://discord.com',
    iconType: 'discord' as const,
  },
  {
    id: 'spotify',
    name: 'Spotify',
    url: 'https://open.spotify.com',
    iconType: 'spotify' as const,
  },
  {
    id: 'classroom',
    name: 'Google Classroom',
    url: 'https://classroom.google.com',
    iconType: 'classroom' as const,
  },
  {
    id: 'roblox',
    name: 'Roblox',
    url: 'https://nowgg.fun/apps/a/19900/b.html',
    iconType: 'roblox' as const,
  },
  {
    id: 'twitch',
    name: 'Twitch',
    url: 'https://www.twitch.tv',
    iconType: 'twitch' as const,
  },
  {
    id: 'reddit',
    name: 'Reddit',
    url: 'https://www.reddit.com',
    iconType: 'reddit' as const,
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    url: 'https://x.com',
    iconType: 'twitter' as const,
  },
];
