import React, { useState } from 'react';
import { CLOAK_PRESETS } from '../data/initialData';
import {
  X,
  Settings,
  Shield,
  AlertTriangle,
  Download,
  Upload,
  Trash2,
  Check,
} from 'lucide-react';

export const SettingsModal = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  games,
  onImportGames,
  onClearGames,
  onPanic,
}) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importError, setImportError] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings(localSettings);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleExportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(games, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `unblocked_games_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result);
        if (Array.isArray(parsed)) {
          onImportGames(parsed);
          setImportError('');
        } else {
          setImportError('Invalid format: File must contain a JSON array of games.');
        }
      } catch (err) {
        setImportError('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="bg-[#100d1e] border border-[#251f3b] rounded-xl max-w-lg w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto text-xs shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1c172f]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1e1738] border border-[#302559] flex items-center justify-center text-purple-400">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm tracking-tight">
                Settings & Disguise
              </h3>
              <p className="text-[11px] text-[#716a8d]">Stealth tab cloaking and panic redirect</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#645d7d] hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Cloaking Disguise */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wide">
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span>Tab Disguise / Cloak</span>
          </div>
          <p className="text-[11px] text-[#787196]">
            Changes the browser tab title and favicon to look like a classroom or study application.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CLOAK_PRESETS.map((p) => {
              const isSelected = localSettings.activeCloak === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setLocalSettings({ ...localSettings, activeCloak: p.id })}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'bg-[#221a3d] border-purple-500/50 text-purple-300 font-bold shadow-md shadow-purple-950/30'
                      : 'bg-[#141026] border-[#221c38] text-[#8680a2] hover:text-white hover:bg-[#1a1433]'
                  }`}
                >
                  <div className="truncate text-xs font-semibold">{p.name}</div>
                  <div className="text-[10px] text-[#5e587a] truncate mt-0.5">{p.title}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Panic Hotkey */}
        <div className="space-y-2 pt-3 border-t border-[#1c172f]">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wide">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Panic Hotkey & Redirect</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[10px] font-bold text-[#716a8d] uppercase tracking-wider mb-1">
                Trigger Key
              </label>
              <input
                type="text"
                maxLength={1}
                value={localSettings.panicKey}
                onChange={(e) => setLocalSettings({ ...localSettings, panicKey: e.target.value })}
                className="w-full px-3 py-1.5 bg-[#0e0b1c] text-white text-center font-mono font-bold rounded-md border border-[#251f3b] focus:outline-none focus:border-purple-500/70"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#716a8d] uppercase tracking-wider mb-1">
                Redirect Destination
              </label>
              <input
                type="text"
                value={localSettings.panicUrl}
                onChange={(e) => setLocalSettings({ ...localSettings, panicUrl: e.target.value })}
                className="w-full px-3 py-1.5 bg-[#0e0b1c] text-white font-mono rounded-md border border-[#251f3b] focus:outline-none focus:border-purple-500/70"
              />
            </div>
          </div>
        </div>

        {/* Library Backup & Restore */}
        <div className="space-y-2 pt-3 border-t border-[#1c172f]">
          <div className="text-xs font-bold text-white uppercase tracking-wide">
            Library Data Management
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141026] hover:bg-[#1c1636] text-[#cbd5e1] border border-[#251f3b] rounded-md font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON ({games.length})</span>
            </button>

            <label className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141026] hover:bg-[#1c1636] text-[#cbd5e1] border border-[#251f3b] rounded-md font-semibold cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON</span>
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>

            <button
              onClick={() => {
                if (window.confirm('Clear all custom games from library?')) {
                  onClearGames();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-800/30 rounded-md font-semibold ml-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Library</span>
            </button>
          </div>
          {importError && <p className="text-red-400 text-[11px]">{importError}</p>}
        </div>

        {/* Save footer */}
        <div className="pt-3 flex items-center justify-between border-t border-[#1c172f]">
          {savedSuccess ? (
            <span className="text-purple-400 font-bold flex items-center gap-1 text-xs">
              <Check className="w-3.5 h-3.5" />
              <span>Settings saved!</span>
            </span>
          ) : (
            <span className="text-[#645d7d] text-[10px]">Changes stored client-side</span>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-[#716a8d] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-md shadow-md transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
