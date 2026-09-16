import React from 'react';
import { Image, Check, Sparkles } from 'lucide-react';
import { WALLPAPERS } from '../utils/theme';

export const WallpapersSettingsTab = ({ currentWallpaper, onWallpaperChange }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-color)]/15 text-[var(--accent-color)] flex items-center justify-center shrink-0 border border-[var(--accent-color)]/30">
            <Image className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--text-main)]">
              Background Wallpapers & Textures
            </h3>
            <p className="text-xs text-[var(--text-dim)]">
              Select a custom visual background pattern for your grrmondays hub.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {WALLPAPERS.map((wp) => {
            const isSelected = currentWallpaper === wp.id;
            return (
              <button
                key={wp.id}
                type="button"
                onClick={() => onWallpaperChange(wp.id)}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between gap-4 transition-all cursor-pointer group relative overflow-hidden ${
                  isSelected
                    ? 'border-[var(--accent-color)] bg-[var(--bg-hover)] shadow-lg ring-1 ring-[var(--accent-color)]'
                    : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] hover:border-[var(--border-hover)]'
                }`}
              >
                {/* Visual Preview Box */}
                <div
                  className="w-full h-24 rounded-lg border border-[var(--border-color)] relative overflow-hidden flex items-center justify-center"
                  style={{
                    backgroundColor: 'var(--bg-base)',
                    backgroundImage: wp.css !== 'none' ? wp.css : undefined,
                    backgroundSize: wp.size || 'auto',
                  }}
                >
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-3 py-1 rounded-full bg-[var(--accent-color)] text-white text-[10px] font-bold shadow-md">
                      Apply Wallpaper
                    </span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[var(--accent-color)] text-white flex items-center justify-center shadow-md">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                      {wp.name}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--accent-color)]/20 text-[var(--accent-color)]">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[var(--text-dim)] leading-relaxed">
                    {wp.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
