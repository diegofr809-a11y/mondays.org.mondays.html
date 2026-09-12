import React, { useState } from 'react';
import { Plus, X, Globe } from 'lucide-react';
import { ShortcutItem } from '../types';

interface LucideAddShortcutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddShortcut: (shortcut: ShortcutItem) => void;
}

export const LucideAddShortcutModal: React.FC<LucideAddShortcutModalProps> = ({
  isOpen,
  onClose,
  onAddShortcut,
}) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = `https://${finalUrl}`;
    }

    const newShortcut: ShortcutItem = {
      id: Date.now().toString(),
      name: name.trim(),
      url: finalUrl,
      iconType: 'custom',
    };

    onAddShortcut(newShortcut);
    setName('');
    setUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="bg-[#100d1e] border border-[#251f3b] rounded-xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-2.5 border-b border-[#1c172f]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#1e1738] border border-[#302559] flex items-center justify-center text-purple-400">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Add Sidebar Shortcut</h3>
          </div>
          <button onClick={onClose} className="text-[#645d7d] hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-[#8b84a6] uppercase tracking-wider mb-1">
              Shortcut Name
            </label>
            <input
              type="text"
              placeholder="e.g. YouTube, Discord, CoolMath"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full h-9 px-3 bg-[#0d0a18] border border-[#231d3b] focus:border-purple-500/60 rounded-md text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#8b84a6] uppercase tracking-wider mb-1">
              Website URL
            </label>
            <input
              type="text"
              placeholder="e.g. youtube.com or https://scratch.mit.edu"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="w-full h-9 px-3 bg-[#0d0a18] border border-[#231d3b] focus:border-purple-500/60 rounded-md text-xs text-white outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-[#716a8d] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-md shadow-md transition-colors"
            >
              Add Shortcut
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
