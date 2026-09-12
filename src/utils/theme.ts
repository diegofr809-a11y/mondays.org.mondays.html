import { ThemeId } from '../types';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  colors: {
    bgBase: string;
    bgSurface: string;
    bgCard: string;
    bgHover: string;
    border: string;
    borderHover: string;
    accent: string;
    accentHover: string;
    accentGlow: string;
    textMain: string;
    textMuted: string;
    textDim: string;
    badgeBg: string;
  };
  previewColors: [string, string, string]; // Preview swatch dots
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  midnight: {
    id: 'midnight',
    name: 'Midnight Dark',
    description: 'Default dark background with purple accents',
    colors: {
      bgBase: '#07050d',
      bgSurface: '#0b0816',
      bgCard: '#100b21',
      bgHover: '#181131',
      border: '#231845',
      borderHover: '#3c2975',
      accent: '#9333ea',
      accentHover: '#a855f7',
      accentGlow: 'rgba(147, 51, 234, 0.35)',
      textMain: '#ffffff',
      textMuted: '#9d93be',
      textDim: '#635a82',
      badgeBg: 'rgba(147, 51, 234, 0.15)',
    },
    previewColors: ['#07050d', '#9333ea', '#100b21'],
  },
  oled: {
    id: 'oled',
    name: 'OLED Black',
    description: 'True black with sharp white contrast',
    colors: {
      bgBase: '#000000',
      bgSurface: '#080808',
      bgCard: '#111111',
      bgHover: '#1c1c1c',
      border: '#262626',
      borderHover: '#404040',
      accent: '#f4f4f5',
      accentHover: '#ffffff',
      accentGlow: 'rgba(255, 255, 255, 0.25)',
      textMain: '#ffffff',
      textMuted: '#a1a1aa',
      textDim: '#71717a',
      badgeBg: 'rgba(255, 255, 255, 0.12)',
    },
    previewColors: ['#000000', '#ffffff', '#1a1a1a'],
  },
  light: {
    id: 'light',
    name: 'Light Minimal',
    description: 'Clean light gray background with slate accents',
    colors: {
      bgBase: '#f4f5f8',
      bgSurface: '#eaecf1',
      bgCard: '#ffffff',
      bgHover: '#f1f3f7',
      border: '#dbe0ea',
      borderHover: '#cbd5e1',
      accent: '#3b82f6',
      accentHover: '#2563eb',
      accentGlow: 'rgba(59, 130, 246, 0.25)',
      textMain: '#0f172a',
      textMuted: '#475569',
      textDim: '#64748b',
      badgeBg: 'rgba(59, 130, 246, 0.12)',
    },
    previewColors: ['#f4f5f8', '#3b82f6', '#ffffff'],
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Neon yellow and cyan accents on dark grid',
    colors: {
      bgBase: '#080811',
      bgSurface: '#0f0e1f',
      bgCard: '#16142e',
      bgHover: '#211e45',
      border: '#322c60',
      borderHover: '#facc15',
      accent: '#facc15',
      accentHover: '#fde047',
      accentGlow: 'rgba(250, 204, 21, 0.4)',
      textMain: '#fef08a',
      textMuted: '#38bdf8',
      textDim: '#60a5fa',
      badgeBg: 'rgba(250, 204, 21, 0.18)',
    },
    previewColors: ['#080811', '#facc15', '#38bdf8'],
  },
  dracula: {
    id: 'dracula',
    name: 'Dracula',
    description: 'Dark slate with violet and pink accents',
    colors: {
      bgBase: '#191a24',
      bgSurface: '#21222e',
      bgCard: '#282a36',
      bgHover: '#343746',
      border: '#44475a',
      borderHover: '#6272a4',
      accent: '#ff79c6',
      accentHover: '#bd93f9',
      accentGlow: 'rgba(255, 121, 198, 0.35)',
      textMain: '#f8f8f2',
      textMuted: '#bd93f9',
      textDim: '#6272a4',
      badgeBg: 'rgba(255, 121, 198, 0.16)',
    },
    previewColors: ['#191a24', '#ff79c6', '#bd93f9'],
  },
  nord: {
    id: 'nord',
    name: 'Nord',
    description: 'Cool icy blue and slate grey tones',
    colors: {
      bgBase: '#1a1e26',
      bgSurface: '#222733',
      bgCard: '#2e3440',
      bgHover: '#3b4252',
      border: '#434c5e',
      borderHover: '#88c0d0',
      accent: '#88c0d0',
      accentHover: '#81a1c1',
      accentGlow: 'rgba(136, 192, 208, 0.35)',
      textMain: '#eceff4',
      textMuted: '#d8dee9',
      textDim: '#e5e9f0',
      badgeBg: 'rgba(136, 192, 208, 0.15)',
    },
    previewColors: ['#1a1e26', '#88c0d0', '#4c566a'],
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Green',
    description: 'Deep dark background with emerald accents',
    colors: {
      bgBase: '#04130c',
      bgSurface: '#071f14',
      bgCard: '#0d2d1e',
      bgHover: '#13402c',
      border: '#1b563c',
      borderHover: '#10b981',
      accent: '#10b981',
      accentHover: '#34d399',
      accentGlow: 'rgba(16, 185, 129, 0.35)',
      textMain: '#ecfdf5',
      textMuted: '#6ee7b7',
      textDim: '#34d399',
      badgeBg: 'rgba(16, 185, 129, 0.16)',
    },
    previewColors: ['#04130c', '#10b981', '#0d2d1e'],
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Orange',
    description: 'Warm gradient dark with coral/amber accents',
    colors: {
      bgBase: '#140a08',
      bgSurface: '#1f100c',
      bgCard: '#2b1611',
      bgHover: '#3d2019',
      border: '#532c22',
      borderHover: '#f97316',
      accent: '#f97316',
      accentHover: '#fb923c',
      accentGlow: 'rgba(249, 115, 22, 0.35)',
      textMain: '#fff7ed',
      textMuted: '#fdba74',
      textDim: '#fb923c',
      badgeBg: 'rgba(249, 115, 22, 0.16)',
    },
    previewColors: ['#140a08', '#f97316', '#2b1611'],
  },
  synthwave: {
    id: 'synthwave',
    name: 'Synthwave',
    description: 'Deep purple with hot pink and magenta glow',
    colors: {
      bgBase: '#12071e',
      bgSurface: '#1c0c2e',
      bgCard: '#271140',
      bgHover: '#361858',
      border: '#512282',
      borderHover: '#ec4899',
      accent: '#ec4899',
      accentHover: '#f43f5e',
      accentGlow: 'rgba(236, 72, 153, 0.4)',
      textMain: '#fdf2f8',
      textMuted: '#f472b6',
      textDim: '#fb7185',
      badgeBg: 'rgba(236, 72, 153, 0.18)',
    },
    previewColors: ['#12071e', '#ec4899', '#271140'],
  },
  oceanic: {
    id: 'oceanic',
    name: 'Oceanic',
    description: 'Deep navy blue with cyan and teal highlights',
    colors: {
      bgBase: '#040f1a',
      bgSurface: '#071828',
      bgCard: '#0d233a',
      bgHover: '#133252',
      border: '#1a446e',
      borderHover: '#06b6d4',
      accent: '#06b6d4',
      accentHover: '#22d3ee',
      accentGlow: 'rgba(6, 182, 212, 0.35)',
      textMain: '#ecfeff',
      textMuted: '#67e8f9',
      textDim: '#38bdf8',
      badgeBg: 'rgba(6, 182, 212, 0.16)',
    },
    previewColors: ['#040f1a', '#06b6d4', '#0d233a'],
  },
};

export function applyTheme(themeId: ThemeId) {
  const theme = THEMES[themeId] || THEMES.midnight;
  const root = document.documentElement;

  // Apply CSS custom properties
  root.style.setProperty('--bg-base', theme.colors.bgBase);
  root.style.setProperty('--bg-surface', theme.colors.bgSurface);
  root.style.setProperty('--bg-card', theme.colors.bgCard);
  root.style.setProperty('--bg-hover', theme.colors.bgHover);
  root.style.setProperty('--border-color', theme.colors.border);
  root.style.setProperty('--border-hover', theme.colors.borderHover);
  root.style.setProperty('--accent-color', theme.colors.accent);
  root.style.setProperty('--accent-hover', theme.colors.accentHover);
  root.style.setProperty('--accent-glow', theme.colors.accentGlow);
  root.style.setProperty('--text-main', theme.colors.textMain);
  root.style.setProperty('--text-muted', theme.colors.textMuted);
  root.style.setProperty('--text-dim', theme.colors.textDim);
  root.style.setProperty('--badge-bg', theme.colors.badgeBg);

  // Set data-theme attribute
  root.setAttribute('data-theme', themeId);
}
