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
  Lock,
  Crown,
} from 'lucide-react';
import { openAboutBlankCloaked } from '../utils/cloak';

export const LucideGamesView = ({
  games = [],
  onPlayGame,
  onOpenAddGame,
  onToggleFavorite,
  onDeleteGame,
  isPremium = false,
  onOpenPremium,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(72);

  // Map each game to its original index to reliably know if it's within the 500 free tier
  const gamesWithLockStatus = useMemo(() => {
    return games.map((game, index) => {
      const isLocked = !isPremium && index >= 500;
      return {
        ...game,
        originalIndex: index,
        isLocked,
      };
    });
  }, [games, isPremium]);

  // Filter games based on category, search, and favorites
  const filteredGames = useMemo(() => {
    return gamesWithLockStatus.filter((game) => {
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
  }, [gamesWithLockStatus, selectedCategory, showFavoritesOnly, searchQuery]);

  const visibleGames = filteredGames.slice(0, displayLimit);

  const handleRandomPlay = () => {
    // Only pick from unlocked games if not premium
    const playableGames = filteredGames.filter((g) => !g.isLocked);
    if (playableGames.length > 0) {
      const randomIndex = Math.floor(Math.random() * playableGames.length);
      onPlayGame(playableGames[randomIndex]);
    } else if (filteredGames.length > 0) {
      onOpenPremium();
    }
  };

  const handleGameClick = (game) => {
    if (game.isLocked) {
      onOpenPremium();
    } else {
      onPlayGame(game);
    }
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
                {isPremium ? (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold">
                    <Crown className="w-3 h-3" />
                    <span>All {games.length} Unlocked</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-color)] text-[11px] font-semibold">
                    <span>500 Unlocked / {games.length} Total</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--text-dim)]">
                {isPremium
                  ? 'Full VIP access unlocked. Enjoy all games!'
                  : 'Free access: 500 games. Unlock 2,000+ more with Premium!'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isPremium && (
              <button
                onClick={onOpenPremium}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                <Crown className="w-4 h-4" />
                <span>Unlock All (Premium)</span>
              </button>
            )}

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
              {visibleGames.map((game) => {
                const isLocked = game.isLocked;

                return (
                  <div
                    key={game.id}
                    onClick={() => isLocked && onOpenPremium()}
                    className={`group bg-[var(--bg-card)] border rounded-xl p-2 flex flex-col transition-all duration-200 shadow-sm relative overflow-hidden ${
                      isLocked
                        ? 'border-amber-500/30 hover:border-amber-400 bg-amber-950/10 cursor-pointer'
                        : 'border-[var(--border-color)] hover:border-[var(--accent-color)] hover:bg-[var(--bg-hover)] hover:shadow-lg'
                    }`}
                  >
                    {/* Thumbnail area */}
                    <div
                      onClick={() => handleGameClick(game)}
                      className="w-full aspect-video rounded-lg bg-black/40 border border-[var(--border-color)] relative flex items-center justify-center cursor-pointer overflow-hidden"
                    >
                      {game.thumbnailUrl ? (
                        <img
                          src={game.thumbnailUrl}
                          alt={game.title}
                          className={`w-full h-full object-cover transition-transform duration-300 ${
                            isLocked ? 'filter grayscale brightness-50' : 'group-hover:scale-105'
                          }`}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <Gamepad2 className="w-6 h-6 text-[var(--text-dim)]" />
                      )}

                      {/* Locked Overlay Badge or Normal Play Overlay */}
                      {isLocked ? (
                        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-2 text-center transition-all">
                          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400 text-amber-400 flex items-center justify-center mb-1 shadow-lg">
                            <Lock className="w-4 h-4" />
                          </div>
                          <span className="text-[9px] font-black text-amber-300 leading-tight uppercase tracking-tight">
                            LOCKED BUY PREMIUM TO GET ACCESS TO 2000+ GAMES
                          </span>
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <div className="w-8 h-8 rounded-full bg-[var(--accent-color)] text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                            <Play className="w-4 h-4 fill-white ml-0.5" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Info & Actions */}
                    <div className="mt-2 flex-1 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-1">
                        <h4
                          className={`text-xs font-semibold truncate transition-colors cursor-pointer ${
                            isLocked
                              ? 'text-amber-200/90 hover:text-amber-300'
                              : 'text-[var(--text-main)] group-hover:text-[var(--accent-color)]'
                          }`}
                          onClick={() => handleGameClick(game)}
                          title={game.title}
                        >
                          {game.title}
                        </h4>

                        {!isLocked && (
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
                        )}
                      </div>

                      {/* Bottom status/actions bar */}
                      <div className="flex items-center justify-between text-[10px] text-[var(--text-dim)] mt-1.5 pt-1.5 border-t border-[var(--border-color)]">
                        {isLocked ? (
                          <span className="text-amber-400 font-bold text-[9px] flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            <span>VIP Game</span>
                          </span>
                        ) : (
                          <span className="capitalize">{game.category || 'Game'}</span>
                        )}

                        <div className="flex items-center gap-1.5">
                          {isLocked ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenPremium();
                              }}
                              className="text-[10px] text-amber-400 font-bold hover:underline cursor-pointer"
                            >
                              Unlock
                            </button>
                          ) : (
                            <>
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
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
