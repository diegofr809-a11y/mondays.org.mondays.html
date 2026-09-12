import React from 'react';
import { ShortcutItem } from '../types';
import {
  Flame,
  Plus,
  Sparkles,
  Gamepad2,
  User,
  Settings,
  GraduationCap,
  Globe,
} from 'lucide-react';
import { LucideView } from '../App';

interface LucideSidebarProps {
  activeView: LucideView;
  onSelectView: (view: LucideView) => void;
  shortcuts?: ShortcutItem[];
  onShortcutClick: (shortcut: ShortcutItem) => void;
  onOpenAddShortcut: () => void;
  onOpenAccount: () => void;
  onOpenSettings: () => void;
}

export const LucideSidebar: React.FC<LucideSidebarProps> = ({
  activeView,
  onSelectView,
  shortcuts = [],
  onShortcutClick,
  onOpenAddShortcut,
  onOpenAccount,
  onOpenSettings,
}) => {
  // Render icon based on shortcut iconType
  const renderShortcutIcon = (item: ShortcutItem) => {
    switch (item.iconType) {
      case 'tiktok':
        return (
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298 0 .59.05.86.14V9.42a6.34 6.34 0 0 0-.86-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.28 8.28 0 0 0 4.77 1.5v-3.44a4.85 4.85 0 0 1-1-.12z" />
          </svg>
        );
      case 'youtube':
        return (
          <svg className="w-4 h-4 text-[#ff0000]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        );
      case 'discord':
        return (
          <svg className="w-4 h-4 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
          </svg>
        );
      case 'spotify':
        return (
          <svg className="w-4 h-4 text-[#1ed760]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.306c-.215.353-.676.467-1.029.252-2.82-1.722-6.368-2.112-10.55-1.157-.403.092-.807-.16-.9-.562-.092-.403.16-.807.563-.9 4.582-1.047 8.509-.604 11.664 1.328.353.215.467.676.252 1.029zm1.467-3.262c-.27.44-.848.58-1.288.31-3.228-1.984-8.15-2.558-11.968-1.401-.497.151-1.024-.134-1.175-.63-.151-.498.134-1.024.63-1.175 4.368-1.326 9.79-.691 13.491 1.588.44.27.58.848.31 1.288zm.126-3.41c-3.87-2.298-10.256-2.51-13.97-1.381-.595.18-1.226-.156-1.406-.75-.18-.595.156-1.226.75-1.406 4.267-1.296 11.314-1.047 15.77 1.6c.534.317.708 1.01.391 1.545-.317.535-1.01.708-1.545.391z" />
          </svg>
        );
      case 'classroom':
        return <GraduationCap className="w-4 h-4 text-[#22c55e]" />;
      case 'roblox':
        return (
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5.166 0L0 18.834 18.834 24 24 5.166 5.166 0zm9.052 13.916l-4.134-1.108 1.108-4.134 4.134 1.108-1.108 4.134z" />
          </svg>
        );
      case 'twitch':
        return (
          <svg className="w-4 h-4 text-[#a970ff]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.149 0l-1.612 4.119v16.8h5.908v3.081h3.224l3.225-3.081h4.836l6.27-6.271V0H2.149zm19.344 13.088l-3.76 3.76h-4.836l-3.225 3.081v-3.081H5.909V2.149h15.584v10.939zM16.12 5.373h-2.15v6.448h2.15V5.373zm-5.374 0H8.596v6.448h2.15V5.373z" />
          </svg>
        );
      case 'reddit':
        return (
          <svg className="w-4 h-4 text-[#ff4500]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.56 12 8 12.56 8 13.25c0 .688.56 1.25 1.25 1.25.688 0 1.25-.562 1.25-1.25 0-.69-.562-1.25-1.25-1.25zm5.5 0c-.688 0-1.25.56-1.25 1.25 0 .688.562 1.25 1.25 1.25.69 0 1.25-.562 1.25-1.25 0-.69-.56-1.25-1.25-1.25zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.197-2.512-.73a.326.326 0 0 0-.232-.095z" />
          </svg>
        );
      case 'twitter':
        return (
          <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        );
      default:
        return <Globe className="w-4 h-4 text-purple-300" />;
    }
  };

  return (
    <aside className="w-14 shrink-0 h-screen bg-[var(--bg-surface)] border-r border-[var(--border-color)] flex flex-col items-center justify-between py-3 select-none z-30">
      {/* Top Section: Brand Logo + Pinned Shortcut Icons */}
      <div className="flex flex-col items-center w-full space-y-2.5">
        {/* Brand Flame Button (Takes home) */}
        <button
          onClick={() => onSelectView('home')}
          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
            activeView === 'home'
              ? 'bg-[var(--bg-hover)] border border-[var(--accent-color)] text-[var(--accent-color)] shadow-md shadow-black/40'
              : 'hover:bg-[var(--bg-hover)] text-[var(--accent-color)]'
          }`}
          title="grrmondays Home"
        >
          <Flame className="w-5 h-5 fill-current opacity-80" />
        </button>

        {/* Subtle Divider */}
        <div className="w-7 h-px bg-[var(--border-color)]" />

        {/* Pinned App Icons Vertical Stack */}
        <div className="flex flex-col items-center space-y-1.5 w-full px-2 max-h-[46vh] overflow-y-auto scrollbar-none">
          {shortcuts.map((item) => (
            <button
              key={item.id}
              onClick={() => onShortcutClick(item)}
              className="w-9 h-9 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] hover:border-[var(--border-hover)] flex items-center justify-center transition-all group shrink-0"
              title={item.name}
            >
              <div className="group-hover:scale-110 transition-transform">
                {renderShortcutIcon(item)}
              </div>
            </button>
          ))}

          {/* Add Shortcut '+' Button */}
          <button
            onClick={onOpenAddShortcut}
            className="w-9 h-9 rounded-lg bg-[var(--bg-base)] hover:bg-[var(--bg-hover)] border border-dashed border-[var(--border-color)] hover:border-[var(--accent-color)] flex items-center justify-center text-[var(--text-dim)] hover:text-[var(--text-main)] transition-all shrink-0"
            title="Add shortcut"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Section: Navigation Cluster (AI, Games, Account, Settings) */}
      <div className="flex flex-col items-center w-full space-y-1.5 pt-2 border-t border-[var(--border-color)]">
        {/* AI */}
        <button
          onClick={() => onSelectView('ai')}
          className={`w-11 py-1.5 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all ${
            activeView === 'ai'
              ? 'text-[var(--accent-color)] bg-[var(--bg-hover)] border border-[var(--border-color)]'
              : 'text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
          }`}
          title="grrmondays AI"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-[9px] font-medium leading-none">AI</span>
        </button>

        {/* Games */}
        <button
          onClick={() => onSelectView('games')}
          className={`w-11 py-1.5 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all ${
            activeView === 'games'
              ? 'text-[var(--accent-color)] bg-[var(--bg-hover)] border border-[var(--border-color)]'
              : 'text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
          }`}
          title="Games Library"
        >
          <Gamepad2 className="w-4 h-4" />
          <span className="text-[9px] font-medium leading-none">Games</span>
        </button>

        {/* Account */}
        <button
          onClick={onOpenAccount}
          className="w-11 py-1.5 rounded-lg flex flex-col items-center justify-center gap-0.5 text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)] transition-all"
          title="Account Profile"
        >
          <User className="w-4 h-4" />
          <span className="text-[9px] font-medium leading-none">Account</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => onSelectView('settings')}
          className={`w-11 py-1.5 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all ${
            activeView === 'settings'
              ? 'text-[var(--accent-color)] bg-[var(--bg-hover)] border border-[var(--border-color)]'
              : 'text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
          }`}
          title="Settings & Themes"
        >
          <Settings className="w-4 h-4" />
          <span className="text-[9px] font-medium leading-none">Settings</span>
        </button>
      </div>
    </aside>
  );
};
