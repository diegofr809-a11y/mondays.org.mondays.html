import React from 'react';
import { Gamepad2, Shield, AlertTriangle, MessageSquarePlus, Globe } from 'lucide-react';

export const Footer = ({
  onOpenRequests,
  onOpenSettings,
  onNavigateToProxy,
  onPanic,
  panicKey,
}) => {
  return (
    <footer className="w-full bg-[#0d1016] border-t border-[#1a1f2b] py-6 px-4 mt-auto text-xs text-[#55637a] select-none">
      <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand info */}
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Gamepad2 className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-white text-xs">UNBLOCKED GAMES</span>
          <span className="text-[10px] text-[#424d60]">• Fast & Unblocked Web Portal</span>
        </div>

        {/* Quick Footer Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
          <button
            onClick={onNavigateToProxy}
            className="hover:text-cyan-400 transition-colors flex items-center gap-1"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Web Proxy</span>
          </button>
          <button
            onClick={onOpenRequests}
            className="hover:text-emerald-400 transition-colors flex items-center gap-1"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>Request Game</span>
          </button>
          <button
            onClick={onOpenSettings}
            className="hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Tab Cloak</span>
          </button>
          <a
            href="https://discord.gg/QtCDfSyad3"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#5865F2] transition-colors flex items-center gap-1 cursor-pointer"
            title="Join the Discord server"
          >
            <span>Discord</span>
          </a>
          <button
            onClick={onPanic}
            className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Panic [{panicKey}]</span>
          </button>
        </div>

        {/* Legal & Compatibility note */}
        <div className="text-[10px] text-[#55637a] text-center sm:text-right flex flex-col sm:items-end">
          <span>Client-side sandbox • No copyrighted binaries hosted</span>
          <span className="text-[#455064] text-[9px] mt-0.5">Note: Some games might not work or may be restricted on certain school/work networks.</span>
        </div>
      </div>
    </footer>
  );
};
