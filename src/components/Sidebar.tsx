import React from 'react';
import { GameCategoryType } from '../types';
import { CATEGORIES } from '../data/initialData';
import { CategoryIcon } from './CategoryIcon';
import {
  Star,
  Plus,
  MessageSquarePlus,
  Globe,
} from 'lucide-react';

interface SidebarProps {
  selectedCategory: GameCategoryType;
  onSelectCategory: (cat: GameCategoryType) => void;
  favoritesCount: number;
  showFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  onOpenAddGame: () => void;
  onOpenRequests: () => void;
  onNavigateToProxy: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedCategory,
  onSelectCategory,
  favoritesCount,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  onOpenAddGame,
  onOpenRequests,
  onNavigateToProxy,
}) => {
  return (
    <aside className="w-44 shrink-0 hidden md:block select-none text-xs" id="games-sidebar">
      <div className="sticky top-14 space-y-2">
        
        {/* Category List */}
        <div className="bg-[#111319] border border-[#222733] rounded-xs p-1.5">
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#556075]">
            Categories
          </div>
          <nav className="space-y-0.5 mt-0.5">
            {CATEGORIES.map((cat) => {
              const isActive = !showFavoritesOnly && selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    if (showFavoritesOnly) onToggleFavoritesOnly();
                    onSelectCategory(cat.id);
                  }}
                  className={`w-full flex items-center gap-2 px-2 py-1 rounded-xs font-semibold text-xs transition-colors text-left ${
                    isActive
                      ? 'bg-[#1c212c] text-emerald-400 border border-emerald-500/30'
                      : 'text-[#8592a8] hover:text-white hover:bg-[#151922] border border-transparent'
                  }`}
                  id={`sidebar-cat-${cat.id}`}
                >
                  <CategoryIcon
                    name={cat.icon}
                    className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-[#556075]'}`}
                  />
                  <span>{cat.name}</span>
                </button>
              );
            })}

            {/* Favorites filter */}
            <button
              onClick={onToggleFavoritesOnly}
              className={`w-full flex items-center gap-2 px-2 py-1 rounded-xs font-semibold text-xs transition-colors text-left ${
                showFavoritesOnly
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'text-[#8592a8] hover:text-white hover:bg-[#151922] border border-transparent'
              }`}
            >
              <Star
                className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'text-amber-400 fill-amber-400' : 'text-[#556075]'}`}
              />
              <span className="flex-1">Favorites</span>
              {favoritesCount > 0 && (
                <span className="text-[10px] font-mono px-1 rounded-xs bg-[#1a1f2c] text-amber-300">
                  {favoritesCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#111319] border border-[#222733] rounded-xs p-1.5 space-y-1">
          <div className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#556075]">
            Quick Links
          </div>
          <button
            onClick={onOpenAddGame}
            className="w-full flex items-center gap-1.5 px-2 py-1 rounded-xs bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Game URL</span>
          </button>
          <button
            onClick={onNavigateToProxy}
            className="w-full flex items-center gap-1.5 px-2 py-1 rounded-xs bg-[#151922] hover:bg-[#1c212c] text-[#8592a8] hover:text-white border border-[#222733] text-xs font-semibold transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Web Proxy</span>
          </button>
          <button
            onClick={onOpenRequests}
            className="w-full flex items-center gap-1.5 px-2 py-1 rounded-xs bg-[#151922] hover:bg-[#1c212c] text-[#8592a8] hover:text-white border border-[#222733] text-xs font-semibold transition-colors"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>Request Game</span>
          </button>
        </div>

      </div>
    </aside>
  );
};
