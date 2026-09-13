import React, { useState, useRef, useEffect } from 'react';
import { Gamepad2, Sparkles, Volume2 } from 'lucide-react';

export const LucideMainView = ({ onSelectView, gamesCount = 559 }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const timerRef = useRef(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Play YouTube sound for exactly 3 seconds on user click
  const handleBearClick = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setIsPlaying(true);
    setPlayCount((prev) => prev + 1);

    // Stop playback after exactly 3 seconds (3000ms)
    timerRef.current = setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };

  return (
    <main className="flex-1 h-full overflow-y-auto flex flex-col items-center justify-center p-6 select-none relative bg-[var(--bg-base)]">
      {/* Background ambient decorative glow */}
      <div className="absolute w-96 h-96 rounded-full bg-[var(--accent-color)]/5 blur-3xl pointer-events-none -top-10" />

      {/* Hidden YouTube audio player (plays pCNWg9l_sHk for 3 seconds on click) */}
      {isPlaying && (
        <div className="sr-only pointer-events-none" aria-hidden="true">
          <iframe
            key={playCount}
            src={`https://www.youtube-nocookie.com/embed/pCNWg9l_sHk?autoplay=1&start=0&controls=0&disablekb=1&fs=0&modestbranding=1&rel=0&iv_load_policy=3&enablejsapi=1`}
            allow="autoplay; encrypted-media"
            title="Grrr Mondays Audio"
            className="w-1 h-1 opacity-0 pointer-events-none fixed -top-[9999px] -left-[9999px]"
          />
        </div>
      )}

      {/* Main Content Card Container */}
      <div className="flex flex-col items-center max-w-lg w-full z-10">
        {/* Brand Header without flame symbol */}
        <div className="flex items-center justify-center mb-5">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)]">
            grrmondays
          </h1>
        </div>

        {/* Ted Bear Picture with Speech Bubble */}
        <div className="relative flex flex-col items-center mb-6">
          {/* Animated Comic Speech Bubble (shows when clicked / playing) */}
          <div
            className={`transition-all duration-300 transform mb-3 ${
              isPlaying
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-90 translate-y-2 pointer-events-none'
            }`}
          >
            <div className="relative bg-[var(--bg-card)] border-2 border-[var(--accent-color)] text-[var(--text-main)] px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2.5">
              <Volume2 className="w-4 h-4 text-[var(--accent-color)] animate-pulse" />
              <span className="font-extrabold text-sm tracking-wide text-[var(--accent-color)]">
                #Grrr... Mondays!
              </span>
              <div className="flex gap-0.5 items-center">
                <span className="w-1 h-3 bg-[var(--accent-color)] rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1 h-4 bg-[var(--accent-color)] rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1 h-3 bg-[var(--accent-color)] rounded-full animate-bounce" />
              </div>
              {/* Bubble pointer triangle */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-[var(--bg-card)] border-r-2 border-b-2 border-[var(--accent-color)] transform rotate-45" />
            </div>
          </div>

          {/* Bear Image Button Container - No shake, no outline */}
          <button
            onClick={handleBearClick}
            className="relative p-1 outline-none cursor-pointer border-none bg-transparent transition-transform active:scale-98"
            title="Ted"
          >
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 bg-transparent flex items-center justify-center">
              <img
                src={`${import.meta.env.BASE_URL}image-removebg-preview.png`}
                alt="Ted"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain filter drop-shadow-2xl select-none pointer-events-none"
              />
            </div>
          </button>
        </div>

        {/* Navigation Buttons directly below the bear: Games and AI */}
        <div className="grid grid-cols-2 gap-3.5 w-full max-w-sm">
          {/* Games Button */}
          <button
            onClick={() => onSelectView('games')}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] hover:border-[var(--accent-color)]/50 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer group text-center"
          >
            <div className="w-10 h-10 rounded-lg bg-[var(--bg-base)] border border-[var(--border-color)] flex items-center justify-center text-[var(--accent-color)] group-hover:scale-110 transition-transform">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-sm text-[var(--text-main)] group-hover:text-[var(--accent-color)] transition-colors">
                Games
              </div>
              <div className="text-[11px] text-[var(--text-dim)]">
                {gamesCount} Games
              </div>
            </div>
          </button>

          {/* AI Button */}
          <button
            onClick={() => onSelectView('ai')}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] hover:border-[var(--accent-color)]/50 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer group text-center"
          >
            <div className="w-10 h-10 rounded-lg bg-[var(--bg-base)] border border-[var(--border-color)] flex items-center justify-center text-[var(--accent-color)] group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-sm text-[var(--text-main)] group-hover:text-[var(--accent-color)] transition-colors">
                grrmondays AI
              </div>
              <div className="text-[11px] text-[var(--text-dim)]">
                AI Assistant
              </div>
            </div>
          </button>
        </div>
      </div>
    </main>
  );
};
