import React, { useState, useRef, useEffect } from 'react';
import { ClockWeatherWidget } from './ClockWeatherWidget';
import { Settings as SettingsIcon, Sliders } from 'lucide-react';
import { sounds } from '../utils/sound';

export const LucideMainView = ({ settings = {}, onOpenSettings }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const timerRef = useRef(null);

  const showClock = settings.showMainClock !== false;

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Play audio clip for 3 seconds on user click without showing the speech bubble
  const handleTextClick = () => {
    sounds.playClick(settings.soundEffectsEnabled);

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
    <main
      className={`flex-1 h-full overflow-y-auto flex flex-col items-center p-6 select-none relative bg-transparent transition-all duration-300 ${
        showClock ? 'justify-start pt-12 sm:pt-16' : 'justify-center'
      }`}
    >
      {/* Ambient background glow */}
      <div className="absolute w-[32rem] h-[32rem] rounded-full bg-[var(--accent-color)]/5 blur-3xl pointer-events-none -top-10" />

      {/* Hidden audio player - plays on click */}
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

      {/* Main Container */}
      <div
        className={`flex flex-col items-center max-w-lg w-full z-10 transition-all duration-500 ${
          showClock ? 'space-y-8 mt-2' : 'space-y-4'
        }`}
      >
        {/* Clickable #grrmondays Text (No speech bubble popup) */}
        <button
          onClick={handleTextClick}
          className="group relative cursor-pointer outline-none border-none bg-transparent transition-transform active:scale-95 text-center"
          title="Click to play sound"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-[var(--text-main)] group-hover:text-[var(--accent-color)] transition-colors select-none">
            #grrmondays
          </h1>
          <div
            className={`h-1 w-24 mx-auto rounded-full mt-2 transition-all duration-300 ${
              isPlaying
                ? 'bg-[var(--accent-color)] w-36 shadow-lg shadow-[var(--accent-color)]/50'
                : 'bg-transparent group-hover:bg-[var(--accent-color)]/40 group-hover:w-28'
            }`}
          />
        </button>

        {/* Live Clock & Weather Widget (rendered only if showMainClock setting is enabled) */}
        {showClock && (
          <div className="w-full flex flex-col items-center animate-fade-in">
            <ClockWeatherWidget
              clockFormat={settings.clockFormat || '12h'}
              showSeconds={settings.showSeconds !== false}
              showWeather={settings.showWeather !== false}
              tempUnit={settings.tempUnit || 'F'}
              weatherLocation={settings.weatherLocation || 'Local City'}
            />

            {/* Subtle setting hint link */}
            {onOpenSettings && (
              <button
                onClick={() => onOpenSettings('clock')}
                className="mt-4 flex items-center gap-1.5 text-[11px] text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors cursor-pointer px-3 py-1 rounded-full hover:bg-[var(--bg-surface)]"
              >
                <Sliders className="w-3 h-3 text-[var(--accent-color)]" />
                <span>Clock & Display Settings</span>
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
};
