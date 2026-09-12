import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface LucideHomeViewProps {
  onSearchOrNavigate: (queryOrUrl: string) => void;
}

export const LucideHomeView: React.FC<LucideHomeViewProps> = ({
  onSearchOrNavigate,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearchOrNavigate(query.trim());
  };

  return (
    <div className="relative flex-1 h-screen flex flex-col items-center justify-center px-4 select-none lucide-bg overflow-hidden">
      {/* Aurora nebula gradient glow layer matching screenshot */}
      <div 
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse 65% 55% at 35% 18%, var(--accent-glow) 0%, rgba(56, 12, 115, 0.18) 40%, rgba(6, 5, 11, 0) 75%)'
        }}
      />

      {/* Main Centered Content */}
      <div className="relative z-10 w-full max-w-xl flex flex-col items-center -mt-8">
        {/* 'grrmondays' Logo Title with underline */}
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-[var(--text-main)] select-none">
            grrmondays
          </h1>
          <div 
            className="h-[2px] w-36 mt-2 rounded-full" 
            style={{ backgroundColor: 'var(--accent-color)' }}
          />
        </div>

        {/* Omnibar Search / Enter URL */}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-dim)] pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search or enter URL"
              autoFocus
              className="w-full h-11 pl-11 pr-4 bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] focus:bg-[var(--bg-hover)] border border-[var(--border-color)] focus:border-[var(--accent-color)] rounded-lg text-sm text-[var(--text-main)] placeholder-[var(--text-dim)] outline-none transition-all shadow-xl shadow-black/40"
            />
          </div>
        </form>
      </div>
    </div>
  );
};
