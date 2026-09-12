import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  Search,
  ExternalLink,
  Maximize2,
  Minimize2,
  X,
  AlertTriangle,
  Globe,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { DEFAULT_PROXIES } from '../data/initialData';
import { openAboutBlankCloaked } from '../utils/cloak';

import { SearchEngineId } from '../types';

// Known domains that strictly disallow iframe embedding via X-Frame-Options/CSP
const KNOWN_FRAME_BLOCKED_DOMAINS = [
  'google.com',
  'youtube.com',
  'youtu.be',
  'reddit.com',
  'twitter.com',
  'x.com',
  'discord.com',
  'instagram.com',
  'facebook.com',
  'github.com',
  'netflix.com',
  'tiktok.com',
  'roblox.com',
];

interface ProxyBrowserProps {
  initialUrl?: string;
  onClose?: () => void;
  searchEngine?: SearchEngineId;
}

export const ProxyBrowser: React.FC<ProxyBrowserProps> = ({ initialUrl, onClose, searchEngine = 'duckduckgo' }) => {
  const [urlInput, setUrlInput] = useState(initialUrl || '');
  const [activeUrl, setActiveUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasFrameError, setHasFrameError] = useState(false);
  const [popupBlockedMessage, setPopupBlockedMessage] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const loadTimeoutRef = useRef<any>(null);

  useEffect(() => {
    if (initialUrl && initialUrl !== activeUrl) {
      navigateTo(initialUrl);
    }
  }, [initialUrl]);

  // Helper to format search query vs URL
  const resolveTargetUrl = (input: string): string => {
    const trimmed = input.trim();
    if (!trimmed) return '';

    // Direct HTTP/HTTPS protocol
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }

    // Likely a domain (e.g. wikipedia.org or html5games.com)
    if (/^[a-z0-9-]+(\.[a-z0-9-]+)+([/?#].*)?$/i.test(trimmed) && !trimmed.includes(' ')) {
      return `https://${trimmed}`;
    }

    // Search Engine based on user settings
    switch (searchEngine) {
      case 'google':
        return `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
      case 'bing':
        return `https://www.bing.com/search?q=${encodeURIComponent(trimmed)}`;
      case 'brave':
        return `https://search.brave.com/search?q=${encodeURIComponent(trimmed)}`;
      case 'duckduckgo':
      default:
        return `https://html.duckduckgo.com/html/?q=${encodeURIComponent(trimmed)}`;
    }
  };

  const isDomainLikelyBlocked = (url: string): boolean => {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.toLowerCase();
      return KNOWN_FRAME_BLOCKED_DOMAINS.some((d) => host === d || host.endsWith(`.${d}`));
    } catch {
      return false;
    }
  };

  const navigateTo = (target: string) => {
    if (!target.trim()) return;
    const finalUrl = resolveTargetUrl(target);

    setUrlInput(target);
    setActiveUrl(finalUrl);
    setPopupBlockedMessage(false);

    // Check if domain is known to block iframes
    if (isDomainLikelyBlocked(finalUrl)) {
      setHasFrameError(true);
      setIsLoading(false);
      return;
    }

    setHasFrameError(false);
    setIsLoading(true);

    // Push into history stack
    const nextHist = history.slice(0, historyIndex + 1);
    nextHist.push(finalUrl);
    setHistory(nextHist);
    setHistoryIndex(nextHist.length - 1);

    // Safety timeout: if iframe fails to load cleanly in 8 seconds, offer error screen
    if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
    loadTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
    }, 4000);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      const targetUrl = history[nextIndex];
      setHistoryIndex(nextIndex);
      setActiveUrl(targetUrl);
      setUrlInput(targetUrl);
      setHasFrameError(isDomainLikelyBlocked(targetUrl));
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const targetUrl = history[nextIndex];
      setHistoryIndex(nextIndex);
      setActiveUrl(targetUrl);
      setUrlInput(targetUrl);
      setHasFrameError(isDomainLikelyBlocked(targetUrl));
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const handleRefresh = () => {
    if (!activeUrl) return;
    setIsLoading(true);
    setHasFrameError(isDomainLikelyBlocked(activeUrl));
    if (iframeRef.current) {
      iframeRef.current.src = activeUrl;
    }
    setTimeout(() => setIsLoading(false), 800);
  };

  const handleHome = () => {
    setActiveUrl('');
    setUrlInput('');
    setHasFrameError(false);
    setIsLoading(false);
  };

  const handleCloakPopout = (targetUrlToOpen?: string) => {
    const urlToUse = targetUrlToOpen || activeUrl || (urlInput ? resolveTargetUrl(urlInput) : '');
    if (!urlToUse) return;

    const allowed = openAboutBlankCloaked(urlToUse, 'Google Classroom');
    if (!allowed) {
      setPopupBlockedMessage(true);
    } else {
      setPopupBlockedMessage(false);
    }
  };

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
    };
  }, []);

  return (
    <div
      className={`flex flex-col bg-[#0b0817] border border-[#231c3b] rounded-lg select-none ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none border-none h-screen'
          : 'w-full h-screen'
      }`}
      id="unblocked-web-proxy-page"
    >
      {/* 1. Lightweight Old-School Browser Header */}
      <div className="flex items-center gap-1.5 p-2 bg-[#100d20] border-b border-[#231c3b] text-xs">
        {/* Controls: Back, Forward, Refresh, Home */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleBack}
            disabled={historyIndex <= 0}
            className="p-1.5 rounded-md text-[#787196] hover:text-white hover:bg-[#1a1433] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Back"
            id="proxy-btn-back"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleForward}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 rounded-md text-[#787196] hover:text-white hover:bg-[#1a1433] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Forward"
            id="proxy-btn-forward"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRefresh}
            disabled={!activeUrl}
            className="p-1.5 rounded-md text-[#787196] hover:text-white hover:bg-[#1a1433] disabled:opacity-30 transition-colors"
            title="Refresh"
            id="proxy-btn-refresh"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-purple-400' : ''}`} />
          </button>
          <button
            onClick={handleHome}
            className="p-1.5 rounded-md text-[#787196] hover:text-white hover:bg-[#1a1433] transition-colors"
            title="Home"
            id="proxy-btn-home"
          >
            <Home className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* URL / Search Input Bar with Go button */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigateTo(urlInput);
          }}
          className="flex-1 flex items-center relative mx-1"
        >
          <div className="relative flex-1 flex items-center">
            <Search className="absolute left-2.5 w-3.5 h-3.5 text-[#5e577a]" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Search or enter URL..."
              className="w-full pl-8 pr-14 py-1.5 bg-[#080612] text-white placeholder-[#5c5576] text-xs font-mono rounded-md border border-[#231d3b] focus:outline-none focus:border-purple-500/70"
              id="proxy-url-omnibar"
            />
            {urlInput && (
              <button
                type="button"
                onClick={() => setUrlInput('')}
                className="absolute right-10 text-[#5e577a] hover:text-white p-0.5"
                title="Clear"
              >
                <X className="w-3 h-3" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1 px-2.5 py-0.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px] rounded transition-colors"
              id="proxy-btn-go"
            >
              Go
            </button>
          </div>
        </form>

        {/* Cloak Popout and Fullscreen */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => handleCloakPopout()}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#191333] hover:bg-[#231a47] text-[#938cae] hover:text-purple-300 border border-[#2c224f] font-semibold text-xs transition-colors"
            title="Open in unblocked stealth popup window (about:blank)"
            id="proxy-btn-cloak-popout"
          >
            <ExternalLink className="w-3 h-3" />
            <span className="hidden sm:inline text-[11px]">Cloak Popout</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-md text-[#787196] hover:text-white hover:bg-[#1a1433] transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            id="proxy-btn-fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-[#787196] hover:text-red-400 hover:bg-[#1a1433] transition-colors"
              title="Close browser view"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Popup Blocked Warning Message (When browser blocks popups) */}
      {popupBlockedMessage && (
        <div className="bg-amber-950/60 border-b border-amber-800/60 px-3 py-1.5 text-xs text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              Popup blocked by your browser. Please click the popup icon in your browser URL address bar to allow stealth popups.
            </span>
          </div>
          <button
            onClick={() => setPopupBlockedMessage(false)}
            className="text-amber-400 hover:text-white ml-2 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Quick Unblocked Bookmarks Strip */}
      <div className="flex items-center gap-1 px-2 py-1 bg-[#0e1016] border-b border-[#1f2430] overflow-x-auto scrollbar-none text-[11px]">
        <span className="text-[#556075] font-bold uppercase tracking-wider text-[9px] mr-1">
          Quick Links:
        </span>
        {DEFAULT_PROXIES.map((p, idx) => (
          <button
            key={idx}
            onClick={() => navigateTo(p.url)}
            className="px-1.5 py-0.5 rounded-xs bg-[#141720] hover:bg-[#1c212d] text-[#8592a8] hover:text-white border border-[#222733] shrink-0 transition-colors"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Loading bar */}
      {isLoading && (
        <div className="h-0.5 w-full bg-[#161a24] overflow-hidden">
          <div className="h-full bg-emerald-400 animate-pulse w-3/4"></div>
        </div>
      )}

      {/* 2. Main Browser Area */}
      <div className="flex-1 bg-[#090b0f] relative flex flex-col overflow-hidden">
        {!activeUrl ? (
          /* Browser Home / Speed Dial Launchpad */
          <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center text-center">
            <div className="max-w-md w-full space-y-4">
              <div className="w-10 h-10 mx-auto rounded-xs bg-[#141720] border border-[#242b3a] flex items-center justify-center text-emerald-400">
                <Globe className="w-5 h-5" />
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-white tracking-wide uppercase">
                  Integrated Web Browser
                </h3>
                <p className="text-xs text-[#6b7994] mt-0.5">
                  Search the web or navigate to unblocked sites inside this sandbox frame.
                </p>
              </div>

              {/* Fast Launch Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  navigateTo(urlInput);
                }}
                className="relative"
              >
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Enter URL or search DuckDuckGo..."
                  className="w-full pl-8 pr-16 py-2 bg-[#12151d] text-white text-xs rounded-xs border border-[#242c3c] focus:outline-none focus:border-emerald-500/70"
                />
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#556075]" />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xs transition-colors"
                >
                  Browse
                </button>
              </form>

              {/* Quick Sites */}
              <div className="pt-2 text-left">
                <div className="text-[10px] font-bold text-[#556075] uppercase tracking-wider mb-1.5">
                  Popular Unblocked Tools:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {DEFAULT_PROXIES.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => navigateTo(item.url)}
                      className="p-2 bg-[#13161f] hover:bg-[#181d28] border border-[#202533] rounded-xs text-left transition-colors"
                    >
                      <div className="text-xs font-bold text-white truncate">{item.name}</div>
                      <div className="text-[10px] text-[#556075] font-mono truncate mt-0.5">
                        {item.url.replace(/^https?:\/\//, '')}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Honest disclaimer about iframe architecture */}
              <div className="text-[10px] text-[#556075] pt-2 border-t border-[#1a1f2a] leading-relaxed">
                Note: Websites that restrict iframe embedding (such as Google or YouTube) will display an error screen with an instant 1-click Cloak Popout option.
              </div>
            </div>
          </div>
        ) : hasFrameError ? (
          /* CUSTOM DARK ERROR SCREEN (When a website refuses iframe embedding) */
          <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center">
            <div className="max-w-md w-full p-5 bg-[#12141c] border border-[#282f40] rounded-xs space-y-3.5 text-left">
              <div className="flex items-center gap-2.5 text-red-400 font-bold text-xs pb-2 border-b border-[#202636]">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>Website Refused Embedded Connection</span>
              </div>

              <div className="space-y-1.5">
                <div className="text-[11px] font-mono text-[#8592a8] bg-[#0c0e14] p-2 rounded-xs border border-[#1c2230] truncate">
                  {activeUrl}
                </div>
                <p className="text-xs text-[#cfd6e4] leading-relaxed">
                  This website sends strict security headers (<code className="text-amber-300 text-[10px]">X-Frame-Options: SAMEORIGIN</code> or <code className="text-amber-300 text-[10px]">CSP frame-ancestors</code>) preventing it from rendering inside an embedded browser window.
                </p>
                <p className="text-[11px] text-[#8592a8] leading-relaxed">
                  To view this destination without frame restrictions, use the <strong>Cloak Popout</strong> button below to launch it inside an unconstrained stealth window (<code className="text-emerald-400 text-[10px]">about:blank</code>).
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleCloakPopout(activeUrl)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold rounded-xs transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Cloak Popout</span>
                </button>
                <button
                  onClick={handleBack}
                  className="px-3 py-1.5 bg-[#181d28] hover:bg-[#202638] text-[#cfd6e4] text-xs font-semibold rounded-xs border border-[#283042] transition-colors"
                >
                  Go Back
                </button>
                <button
                  onClick={handleHome}
                  className="px-3 py-1.5 text-xs text-[#6b7994] hover:text-white"
                >
                  Return Home
                </button>
              </div>

              {/* Server-Side Fetching & Proxy Architecture Hook Note */}
              <div className="pt-2.5 border-t border-[#1c2230] text-[10px] text-[#556075] space-y-1">
                <div className="font-bold text-[#718096]">Architecture Note:</div>
                <p>
                  To proxy arbitrary restricted sites directly within this frame, a server-side proxy relay (such as Ultraviolet or Wisp server) can be integrated into this route to rewrite HTTP headers.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* ACTIVE BROWSING IFRAME AREA */
          <div className="flex-1 w-full h-full relative flex flex-col">
            {/* Quick Helper Floating Pill */}
            <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
              <button
                onClick={() => setHasFrameError(true)}
                className="px-2 py-0.5 bg-[#141720]/90 hover:bg-[#1c2230] text-[#8592a8] hover:text-white text-[10px] rounded-xs border border-[#262c3a] backdrop-blur-xs flex items-center gap-1 transition-colors"
                title="Page didn't load or shows refuse connection?"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Blocked?</span>
              </button>
              <button
                onClick={() => handleCloakPopout()}
                className="px-2 py-0.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-[10px] font-bold rounded-xs border border-emerald-500/30 backdrop-blur-xs flex items-center gap-1 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Popout</span>
              </button>
            </div>

            <iframe
              ref={iframeRef}
              src={activeUrl}
              title="Unblocked Web Browser"
              className="w-full flex-1 border-none bg-white"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
              allow="fullscreen; autoplay"
              onLoad={() => setIsLoading(false)}
              onError={() => setHasFrameError(true)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
