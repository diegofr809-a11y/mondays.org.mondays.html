import React, { useState, useMemo } from 'react';
import { CATEGORIES } from '../data/initialData';
import { CategoryIcon } from './CategoryIcon';
import {
  Search,
  Plus,
  Star,
  Play,
  ExternalLink,
  Trash2,
  Gamepad2,
  Dices,
  Info,
  AlertTriangle,
} from 'lucide-react';
import { openAboutBlankCloaked } from '../utils/cloak';

export const LucideGamesView = ({
  games = [],
  onPlayGame,
  onOpenAddGame,
  onToggleFavorite,
  onDeleteGame,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(72);
  const [failedImages, setFailedImages] = useState({});
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  // Filter games based on category, search, and favorites
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchesCat =
        selectedCategory === 'all'
          ? true
          : selectedCategory === 'favorites'
          ? game.isFavorite
          : game.category === selectedCategory;
      const matchesFav = !showFavoritesOnly || game.isFavorite;
      const matchesSearch =
        !searchQuery.trim() ||
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (game.category && game.category.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesFav && matchesSearch;
    });
  }, [games, selectedCategory, showFavoritesOnly, searchQuery]);

  const visibleGames = filteredGames.slice(0, displayLimit);

  const handleRandomPlay = () => {
    if (filteredGames.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredGames.length);
      onPlayGame(filteredGames[randomIndex]);
    }
  };

  const handleGameClick = (game) => {
    onPlayGame(game);
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto px-4 sm:px-6 py-6 lucide-bg select-none">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center text-[var(--accent-color)] shadow-md">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[var(--text-main)] tracking-tight">
                  Games Library
                </h2>
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-color)] text-[11px] font-semibold">
                  <span>{games.length} Games Unlocked</span>
                </span>
              </div>
              <p className="text-xs text-[var(--text-dim)]">
                Full access to all unblocked games and arcade titles.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRandomPlay}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-main)] transition-all cursor-pointer"
              title="Pick a random game"
            >
              <Dices className="w-4 h-4 text-[var(--accent-color)]" />
              <span>Random</span>
            </button>

            <button
              onClick={onOpenAddGame}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent-color)] hover:opacity-90 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Game</span>
            </button>
          </div>
        </div>

        {/* Game Compatibility Disclaimer Banner */}
        {showDisclaimer && (
          <div
            id="games-compatibility-disclaimer"
            className="flex items-start sm:items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-200/90 text-xs transition-all shadow-xs"
          >
            <div className="flex items-start sm:items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
              <div className="leading-snug">
                <span className="font-semibold text-amber-300">Disclaimer: </span>
                <span>
                  Some games might not work or may be blocked depending on your school/network firewall or browser settings. If a title fails to load, use the <strong>Cloak Popout</strong> button or try another unblocked mirror.
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowDisclaimer(false)}
              className="text-amber-400/70 hover:text-amber-300 text-[11px] font-medium shrink-0 px-1.5 py-0.5 rounded hover:bg-amber-500/15 transition-colors cursor-pointer"
              title="Dismiss note"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-dim)] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search games by name or category..."
              className="w-full h-9 pl-9 pr-3 bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] focus:bg-[var(--bg-hover)] border border-[var(--border-color)] focus:border-[var(--accent-color)] rounded-lg text-xs text-[var(--text-main)] placeholder-[var(--text-dim)] outline-none transition-all"
            />
          </div>

          {/* Favorites toggle */}
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-1.5 px-3 h-9 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
              showFavoritesOnly
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] border-[var(--border-color)]'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>Favorites</span>
          </button>
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id && !showFavoritesOnly;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setShowFavoritesOnly(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--accent-color)] text-white shadow-xs'
                    : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)]'
                }`}
              >
                <CategoryIcon name={cat.icon} className="w-3.5 h-3.5" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Games Grid */}
        <div className="pt-2">
          {visibleGames.length === 0 ? (
            <div className="text-center py-16 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2">
              <Gamepad2 className="w-10 h-10 text-[var(--text-dim)] mx-auto" />
              <h3 className="text-sm font-semibold text-[var(--text-main)]">
                No games found
              </h3>
              <p className="text-xs text-[var(--text-dim)]">
                Try searching for another game title or clear your filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {visibleGames.map((game) => (
                <div
                  key={game.id}
                  className="group bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-color)] rounded-xl p-2 flex flex-col transition-all duration-200 shadow-sm hover:shadow-lg relative overflow-hidden"
                >
                  {/* Thumbnail area */}
                  <div
                    onClick={() => handleGameClick(game)}
                    className="w-full aspect-video rounded-lg bg-black/40 border border-[var(--border-color)] relative flex items-center justify-center cursor-pointer overflow-hidden"
                  >
                    {game.thumbnailUrl && !failedImages[game.id] ? (
                      <img
                        src={game.thumbnailUrl}
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={() => {
                          setFailedImages((prev) => ({ ...prev, [game.id]: true }));
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1b202c] to-[#10131a] p-2 text-center select-none">
                        <Gamepad2 className="w-6 h-6 text-[var(--accent-color)] opacity-75 mb-1" />
                        <span className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-wider line-clamp-1 max-w-[90%]">
                          {game.title}
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <div className="w-8 h-8 rounded-full bg-[var(--accent-color)] text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Info & Actions */}
                  <div className="mt-2 flex-1 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-1">
                      <h4
                        className="text-xs font-semibold truncate text-[var(--text-main)] group-hover:text-[var(--accent-color)] transition-colors cursor-pointer"
                        onClick={() => handleGameClick(game)}
                        title={game.title}
                      >
                        {game.title}
                      </h4>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(game.id);
                        }}
                        className="text-[var(--text-dim)] hover:text-amber-400 p-0.5 cursor-pointer"
                        title="Favorite"
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            game.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                          }`}
                        />
                      </button>
                    </div>

                    {/* Bottom status/actions bar */}
                    <div className="flex items-center justify-between text-[10px] text-[var(--text-dim)] mt-1.5 pt-1.5 border-t border-[var(--border-color)]">
                      <span className="capitalize">{game.category || 'Game'}</span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openAboutBlankCloaked(game.url, game.title);
                          }}
                          className="text-[var(--text-dim)] hover:text-[var(--text-main)] p-0.5 cursor-pointer"
                          title="Open Popout"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </button>
                        {game.isCustom && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteGame(game.id);
                            }}
                            className="text-[var(--text-dim)] hover:text-red-400 p-0.5 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {filteredGames.length > displayLimit && (
            <div className="flex justify-center py-6">
              <button
                onClick={() => setDisplayLimit((prev) => prev + 72)}
                className="px-5 py-2 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-main)] shadow-sm transition-all cursor-pointer"
              >
                Load More Games (Showing {displayLimit} of {filteredGames.length})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
