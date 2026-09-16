import React, { useState, useRef, useEffect } from 'react';
import { Volume2 } from 'lucide-react';

export const LucideMainView = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Play audio clip for 3 seconds on user click
  const handleTextClick = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setIsPlaying(true);
    setPlayCount((prev) => prev + 1);

    timerRef.current = setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };

  return (
    <main className="flex-1 h-full overflow-y-auto flex flex-col items-center justify-center p-6 select-none relative bg-[var(--bg-base)]">
      {/* Ambient background glow */}
      <div className="absolute w-96 h-96 rounded-full bg-[var(--accent-color)]/5 blur-3xl pointer-events-none -top-10" />

      {/* Hidden audio player */}
      {isPlaying && (
        <div className="sr-only pointer-events-none" aria-hidden="true">
          <iframe
            key={playCount}
            src="https://www.youtube-nocookie.com/embed/pCNWg9l_sHk?autoplay=1&start=0&controls=0&disablekb=1&fs=0&modestbranding=1&rel=0&iv_load_policy=3&enablejsapi=1"
            allow="autoplay; encrypted-media"
            title="Grrr Mondays Audio"
            className="w-1 h-1 opacity-0 pointer-events-none fixed -top-[9999px] -left-[9999px]"
          />
        </div>
      )}

      <div className="flex flex-col items-center max-w-lg w-full z-10 space-y-6">
        {/* Animated Speech Bubble when clicked */}
        <div
          className={`transition-all duration-300 transform ${
            isPlaying
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-90 translate-y-2 pointer-events-none'
          }`}
        >
          <div className="relative bg-[var(--bg-card)] border-2 border-[var(--accent-color)] text-[var(--text-main)] px-5 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5">
            <Volume2 className="w-4 h-4 text-[var(--accent-color)] animate-pulse" />
            <span className="font-extrabold text-sm tracking-wide text-[var(--accent-color)]">
              #Grrr... Mondays!
            </span>
            <div className="flex gap-0.5 items-center">
              <span className="w-1 h-3 bg-[var(--accent-color)] rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1 h-4 bg-[var(--accent-color)] rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1 h-3 bg-[var(--accent-color)] rounded-full animate-bounce" />
            </div>
            {/* Pointer triangle */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-[var(--bg-card)] border-r-2 border-b-2 border-[var(--accent-color)] transform rotate-45" />
          </div>
        </div>

        {/* Big Clickable #grrmondays Text */}
        <button
          onClick={handleTextClick}
          className="group relative cursor-pointer outline-none border-none bg-transparent transition-transform active:scale-95 text-center"
          title="Click to play sound"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-[var(--text-main)] group-hover:text-[var(--accent-color)] transition-colors select-none">
            #grrmondays
          </h1>
          <p className="text-xs text-[var(--text-dim)] mt-2 font-medium">
            (click text to play sound)
          </p>
        </button>
      </div>
    </main>
  );
};
