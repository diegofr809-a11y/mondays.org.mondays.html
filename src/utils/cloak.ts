import { CLOAK_PRESETS } from '../data/initialData';

export const applyTabCloak = (
  cloakId: string,
  customTitle?: string,
  customFavicon?: string
): void => {
  let title = 'grrmondays';
  let favicon = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%239333ea%22 stroke-width=%222%22><polygon points=%226 3 20 12 6 21 6 3%22/></svg>';

  if (cloakId === 'custom') {
    title = customTitle?.trim() || 'Classes';
    favicon = customFavicon?.trim() || 'https://ssl.gstatic.com/classroom/favicon.png';
  } else {
    const preset = CLOAK_PRESETS.find((p) => p.id === cloakId) || CLOAK_PRESETS[0];
    title = preset.title;
    favicon = preset.favicon;
  }

  // Set document title
  document.title = title;

  // Set favicon
  let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  link.href = favicon;
};

export const triggerPanic = (panicUrl: string): void => {
  const url = panicUrl.startsWith('http') ? panicUrl : `https://${panicUrl}`;
  window.location.replace(url);
};

export const openAboutBlankCloaked = (targetUrl: string, title?: string): boolean => {
  try {
    const win = window.open('about:blank', '_blank');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      return false;
    }
    
    win.document.title = title || 'Google Classroom';
    
    const iframe = win.document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.bottom = '0';
    iframe.style.left = '0';
    iframe.style.right = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.margin = '0';
    iframe.style.padding = '0';
    iframe.style.overflow = 'hidden';
    iframe.style.zIndex = '999999';
    iframe.src = targetUrl;
    
    win.document.body.style.margin = '0';
    win.document.body.appendChild(iframe);
    return true;
  } catch (err) {
    console.warn('Popup blocked or error creating stealth frame', err);
    return false;
  }
};
