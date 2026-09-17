import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  X,
  Gamepad2,
  Globe,
  Image as ImageIcon,
  Settings,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { DEFAULT_SHORTCUTS } from '../data/initialData';
import { WALLPAPERS } from '../utils/theme';
import { sounds } from '../utils/sound';

export const UniversalSearchModal = ({
  isOpen,
  onClose,
  games = [],
  onSelectGame,
  onSelectApp,
  onSelectWallpaper,
  onOpenSettingsTab,
  soundEffectsEnabled = true,
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'games' | 'apps' | 'wallpapers' | 'settings'
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const settingsItems = useMemo(
    () => [
      { id: 'set-appearance', title: 'Theme & Accent Colors', category: 'settings', tab: 'appearance', desc: 'Pick color themes and custom accents' },
      { id: 'set-wallpapers', title: 'Wallpaper Backgrounds', category: 'settings', tab: 'wallpapers', desc: 'Change background patterns and art' },
      { id: 'set-clock', title: 'Clock & Widgets Settings', category: 'settings', tab: 'clock', desc: 'Toggle top clock, 12h/24h, and weather' },
      { id: 'set-stealth', title: 'Stealth Tab Cloak & Panic Key', category: 'settings', tab: 'stealth', desc: 'Disguise tab as Google Classroom' },
      { id: 'set-audio', title: 'Sound Effects & Custom Cursors', category: 'settings', tab: 'audio', desc: 'Toggle audio clicks and retro gaming cursors' },
      { id: 'set-account', title: 'Player Profile & Account', category: 'settings', tab: 'account', desc: 'Customize avatar, gamer tag, and bio' },
      { id: 'set-changelog', title: 'Changelog & Updates', category: 'settings', tab: 'changelog', desc: 'View v4 release notes and history' },
    ],
    []
  );

  // Filtered and aggregated search results
  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      // If empty, show top popular games, trending apps, and quick settings
      const topGames = games.slice(0, 6).map((g) => ({ ...g, itemType: 'game' }));
      const topApps = DEFAULT_SHORTCUTS.slice(0, 4).map((a) => ({ ...a, itemType: 'app' }));
      const topSettings = settingsItems.slice(0, 3).map((s) => ({ ...s, itemType: 'settings' }));
      return [...topGames, ...topApps, ...topSettings];
    }

    const matched = [];

    // 1. Games match
    if (filterType === 'all' || filterType === 'games') {
      const gMatches = games
        .filter(
          (g) =>
            g.title.toLowerCase().includes(q) ||
            g.category?.toLowerCase().includes(q)
        )
        .slice(0, 20)
        .map((g) => ({ ...g, itemType: 'game' }));
      matched.push(...gMatches);
    }

    // 2. Apps match
    if (filterType === 'all' || filterType === 'apps') {
      const aMatches = DEFAULT_SHORTCUTS.filter((a) =>
        a.name.toLowerCase().includes(q)
      ).map((a) => ({ ...a, itemType: 'app' }));
      matched.push(...aMatches);
    }

    // 3. Wallpapers match
    if (filterType === 'all' || filterType === 'wallpapers') {
      const wMatches = WALLPAPERS.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.description?.toLowerCase().includes(q) ||
          w.category?.toLowerCase().includes(q)
      ).map((w) => ({ ...w, itemType: 'wallpaper' }));
      matched.push(...wMatches);
    }

    // 4. Settings match
    if (filterType === 'all' || filterType === 'settings') {
      const sMatches = settingsItems
        .filter(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.desc.toLowerCase().includes(q)
        )
        .map((s) => ({ ...s, itemType: 'settings' }));
      matched.push(...sMatches);
    }

    return matched;
  }, [query, filterType, games, settingsItems]);

  const handleSelect = (item) => {
    sounds.playLaunch(soundEffectsEnabled);
    if (item.itemType === 'game') {
      onSelectGame(item);
    } else if (item.itemType === 'app') {
      onSelectApp(item.url);
    } else if (item.itemType === 'wallpaper') {
      onSelectWallpaper(item.id);
    } else if (item.itemType === 'settings') {
      onOpenSettingsTab(item.tab);
    }
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-md animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col text-[var(--text-main)] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[var(--border-color)] gap-3 bg-[var(--bg-surface)]">
          <Search className="w-5 h-5 text-[var(--accent-color)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search apps, 1,900+ games, wallpapers, settings..."
            className="flex-1 bg-transparent border-none outline-none text-sm sm:text-base text-[var(--text-main)] placeholder-[var(--text-dim)]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md hover:bg-[var(--bg-hover)] text-[var(--text-dim)] hover:text-[var(--text-main)]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono rounded bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-dim)]">
            ESC
          </kbd>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-[var(--border-color)]/60 bg-[var(--bg-surface)]/50 overflow-x-auto scrollbar-none text-xs">
          {[
            { id: 'all', label: 'All Results' },
            { id: 'games', label: 'Games' },
            { id: 'apps', label: 'Apps & Web' },
            { id: 'wallpapers', label: 'Wallpapers' },
            { id: 'settings', label: 'Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setFilterType(tab.id);
                setSelectedIndex(0);
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterType === tab.id
                  ? 'bg-[var(--accent-color)] text-white shadow-sm'
                  : 'text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-[var(--border-color)]/30">
          {results.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--text-dim)]">
              No results found for &ldquo;{query}&rdquo;. Try another title or keyword.
            </div>
          ) : (
            results.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id || item.name || idx}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer group ${
                    isSelected
                      ? 'bg-[var(--bg-hover)] border-l-4 border-l-[var(--accent-color)]'
                      : 'hover:bg-[var(--bg-hover)]/70'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Item Type Icon */}
                    <div className="w-9 h-9 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center shrink-0 group-hover:border-[var(--accent-color)]/50">
                      {item.itemType === 'game' && (
                        <Gamepad2 className="w-4 h-4 text-purple-400" />
                      )}
                      {item.itemType === 'app' && (
                        <Globe className="w-4 h-4 text-sky-400" />
                      )}
                      {item.itemType === 'wallpaper' && (
                        <ImageIcon className="w-4 h-4 text-emerald-400" />
                      )}
                      {item.itemType === 'settings' && (
                        <Settings className="w-4 h-4 text-amber-400" />
                      )}
                    </div>

                    <div className="truncate">
                      <div className="text-xs sm:text-sm font-bold text-[var(--text-main)] truncate flex items-center gap-2">
                        <span>{item.title || item.name}</span>
                        {item.category && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--badge-bg)] text-[var(--accent-color)] font-normal uppercase tracking-wider">
                            {item.category}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[var(--text-dim)] truncate mt-0.5">
                        {item.itemType === 'game' && 'Instant Play Game'}
                        {item.itemType === 'app' && `Web Application (${item.url})`}
                        {item.itemType === 'wallpaper' && (item.description || 'Theme background')}
                        {item.itemType === 'settings' && item.desc}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-dim)] shrink-0 pl-3">
                    <span className="hidden sm:inline text-[11px] font-medium opacity-70">
                      {item.itemType === 'game' && 'Play'}
                      {item.itemType === 'app' && 'Launch'}
                      {item.itemType === 'wallpaper' && 'Apply'}
                      {item.itemType === 'settings' && 'Open'}
                    </span>
                    <ChevronRight className="w-4 h-4 text-[var(--accent-color)]" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="flex items-center justify-between px-4 py-2 bg-[var(--bg-surface)] border-t border-[var(--border-color)] text-[10px] text-[var(--text-dim)]">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span>Showing {results.length} items</span>
        </div>
      </div>
    </div>
  );
};
