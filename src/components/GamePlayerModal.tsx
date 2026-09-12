import React, { useState, useEffect, useRef } from 'react';
import { Game } from '../types';
import {
  X,
  Maximize2,
  Minimize2,
  RotateCw,
  ExternalLink,
  Star,
  Gamepad2,
  Clock,
} from 'lucide-react';
import { openAboutBlankCloaked } from '../utils/cloak';

interface GamePlayerModalProps {
  game: Game | null;
  onClose: () => void;
  onToggleFavorite: (gameId: string) => void;
  onRecordPlay: (gameId: string) => void;
}

export const GamePlayerModal: React.FC<GamePlayerModalProps> = ({
  game,
  onClose,
  onToggleFavorite,
  onRecordPlay,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playSeconds, setPlaySeconds] = useState(0);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (game) {
      onRecordPlay(game.id);
      setPlaySeconds(0);
    }
  }, [game]);

  useEffect(() => {
    let interval: any;
    if (game) {
      interval = setInterval(() => {
        setPlaySeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [game]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isFullscreen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, onClose]);

  if (!game) return null;

  const handleReload = () => {
    if (frameRef.current) {
      frameRef.current.src = game.url;
    }
  };

  const handleCloakedPopout = () => {
    openAboutBlankCloaked(game.url, game.title);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xs select-none">
      <div
        ref={containerRef}
        className={`bg-[#0e0b1c] border border-[#251f3b] rounded-xl overflow-hidden shadow-2xl flex flex-col transition-all ${
          isFullscreen
            ? 'fixed inset-0 z-50 rounded-none border-none h-screen'
            : 'w-full max-w-5xl h-[85vh] max-h-[800px]'
        }`}
      >
        {/* Game Titlebar & Controls */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#120e24] border-b border-[#231c3a] text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-[#1e1738] border border-[#302559] flex items-center justify-center text-purple-400 shrink-0">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-xs truncate">{game.title}</h3>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#1e1738] text-purple-300 border border-[#302559]">
                  {game.category}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-[#6d668b]">
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-2.5 h-2.5 text-purple-400" />
                  {formatTime(playSeconds)}
                </span>
                <span>•</span>
                <span>Sandboxed Player</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onToggleFavorite(game.id)}
              className={`p-1.5 rounded-md border transition-colors ${
                game.isFavorite
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  : 'bg-[#17122c] text-[#867fa2] hover:text-white border-[#282044]'
              }`}
              title="Favorite game"
            >
              <Star className={`w-3.5 h-3.5 ${game.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>

            <button
              onClick={handleReload}
              className="p-1.5 rounded-md bg-[#17122c] text-[#867fa2] hover:text-white border border-[#282044] transition-colors"
              title="Reload frame"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleCloakedPopout}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md transition-colors"
              title="Open inside an unblocked stealth tab"
            >
              <ExternalLink className="w-3 h-3" />
              <span className="hidden sm:inline">Cloak Popout</span>
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-md bg-[#17122c] text-[#867fa2] hover:text-white border border-[#282044] transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-md bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 transition-colors ml-1"
              title="Close game"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Embedded Game Iframe */}
        <div className="flex-1 w-full bg-black relative">
          <iframe
            ref={frameRef}
            src={game.url}
            title={game.title}
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock"
            allow="fullscreen; autoplay; gamepad"
          />
        </div>
      </div>
    </div>
  );
};
