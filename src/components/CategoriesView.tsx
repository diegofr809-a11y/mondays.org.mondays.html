import React from 'react';
import { GameCategoryType } from '../types';
import { CATEGORIES } from '../data/initialData';
import { CategoryIcon } from './CategoryIcon';
import { ArrowRight } from 'lucide-react';

interface CategoriesViewProps {
  onSelectCategory: (cat: GameCategoryType) => void;
  gamesCountByCategory: Record<string, number>;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  onSelectCategory,
  gamesCountByCategory,
}) => {
  const descriptions: Record<string, string> = {
    all: 'Browse all games across every genre in your library.',
    action: 'Fast-paced combat, platformers, and shooting games.',
    arcade: 'Classic retro titles, endless runners, and high-score chasers.',
    puzzle: 'Brain teasers, logic games, math puzzles, and strategy challenges.',
    sports: 'Football, basketball, soccer, and athletic competitions.',
    racing: 'Drifting, track racing, stunt driving, and speed tests.',
    other: 'Unique web experiments, simulation games, and sandbox tools.',
  };

  return (
    <div className="space-y-3 select-none text-xs" id="categories-view-page">
      <div className="pb-2 border-b border-[#222733] flex items-center justify-between">
        <div>
          <h2 className="text-sm font-extrabold text-white tracking-tight uppercase">
            Game Categories
          </h2>
          <p className="text-[11px] text-[#6b7994] mt-0.5">
            Select a genre to filter the games library
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {CATEGORIES.map((cat) => {
          const count = gamesCountByCategory[cat.id] || 0;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group bg-[#111319] hover:bg-[#151922] border border-[#202533] hover:border-emerald-500/50 rounded-xs p-3 cursor-pointer transition-colors flex flex-col justify-between"
              id={`category-card-${cat.id}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-7 h-7 rounded-xs bg-[#161a24] group-hover:bg-emerald-500/20 border border-[#222836] group-hover:border-emerald-500/40 flex items-center justify-center text-[#8592a8] group-hover:text-emerald-400 transition-colors">
                    <CategoryIcon name={cat.icon} className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-xs bg-[#161a24] text-emerald-400 border border-emerald-500/20">
                    {count} games
                  </span>
                </div>

                <h3 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-[#6b7994] mt-1 leading-normal">
                  {descriptions[cat.id] || 'Explore games in this genre.'}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#1a1f2c] flex items-center justify-between text-[10px] text-[#556075] group-hover:text-emerald-400 transition-colors">
                <span className="font-semibold">View library</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
