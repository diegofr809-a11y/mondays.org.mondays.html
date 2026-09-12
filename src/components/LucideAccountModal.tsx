import React, { useState } from 'react';
import { User, Shield, Gamepad2, Globe, Check, X } from 'lucide-react';
import { AppSettings } from '../types';

interface LucideAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  gamesCount: number;
}

export const LucideAccountModal: React.FC<LucideAccountModalProps> = ({
  isOpen,
  onClose,
  settings,
  gamesCount,
}) => {
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('lucide_username') || 'LucideExplorer';
  });
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem('lucide_username', username);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="bg-[#100d1e] border border-[#251f3b] rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1c172f]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1e1738] border border-[#302559] flex items-center justify-center text-purple-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Account Profile</h3>
              <p className="text-[11px] text-[#716a8d]">Local client session details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#645d7d] hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-3.5 rounded-lg bg-[#141026] border border-[#231d3b] flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white text-lg font-bold shadow-md">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white truncate">{username}</span>
              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                Online
              </span>
            </div>
            <p className="text-[11px] text-[#6f698a] mt-0.5">Anonymous Stealth Session</p>
          </div>
        </div>

        {/* Change Display Name */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-semibold text-[#8b84a6] uppercase tracking-wider">
            Display Nickname
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={20}
              className="flex-1 h-9 px-3 bg-[#0d0a18] border border-[#231d3b] focus:border-purple-500/60 rounded-md text-xs text-white outline-none"
            />
            <button
              onClick={handleSave}
              className="h-9 px-3 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-1"
            >
              {isSaved ? <Check className="w-3.5 h-3.5" /> : 'Save'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#1c172f]">
          <div className="p-2.5 rounded-lg bg-[#141026] border border-[#231d3b] text-center">
            <Gamepad2 className="w-4 h-4 mx-auto text-purple-400 mb-1" />
            <div className="text-xs font-bold text-white">{gamesCount}</div>
            <div className="text-[9px] text-[#6f698a]">Games in Lib</div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#141026] border border-[#231d3b] text-center">
            <Shield className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
            <div className="text-xs font-bold text-white capitalize">{settings.activeCloak}</div>
            <div className="text-[9px] text-[#6f698a]">Active Cloak</div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#141026] border border-[#231d3b] text-center">
            <Globe className="w-4 h-4 mx-auto text-cyan-400 mb-1" />
            <div className="text-xs font-bold text-white">{settings.panicKey}</div>
            <div className="text-[9px] text-[#6f698a]">Panic Key</div>
          </div>
        </div>

        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#17122b] hover:bg-[#1e1738] text-white text-xs font-medium rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
