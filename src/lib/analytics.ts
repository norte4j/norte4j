export type AnalyticsEvent = {
  event: 'page_view' | 'session_start' | 'click' | 'scroll_depth' | 'engagement';
  visitorId: string;
  path: string;
  device: 'desktop' | 'mobile' | 'tablet';
  referrer: 'direct' | 'google' | 'instagram' | 'facebook' | 'linkedin' | 'github' | 'other';
  tag?: string;
  outbound?: boolean;
  depth?: 25 | 50 | 75 | 100;
  durationSeconds?: number;
};

const apiUrl = `${import.meta.env.VITE_API_URL || '/api'}/analytics/events`;

export const analyticsEnabled = () => navigator.doNotTrack !== '1' && !window.location.pathname.startsWith('/cms');

export const visitorId = () => {
  const key = 'norte4j_visitor_id';
  try {
    const current = localStorage.getItem(key);
    if (current) return current;
    const created = crypto.randomUUID();
    localStorage.setItem(key, created);
    return created;
  } catch {
    return crypto.randomUUID();
  }
};

export const deviceType = (): AnalyticsEvent['device'] => {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

export const referrerType = (): AnalyticsEvent['referrer'] => {
  const host = document.referrer ? new URL(document.referrer).hostname.toLowerCase() : '';
  if (!host || host === window.location.hostname) return 'direct';
  if (host.includes('google.')) return 'google';
  if (host.includes('instagram.')) return 'instagram';
  if (host.includes('facebook.') || host.includes('fb.')) return 'facebook';
  if (host.includes('linkedin.')) return 'linkedin';
  if (host.includes('github.')) return 'github';
  return 'other';
};

export const sendAnalytics = (event: AnalyticsEvent) => {
  if (!analyticsEnabled()) return;
  void fetch(apiUrl, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(event),
    keepalive: true,
    credentials: 'omit',
  }).catch(() => undefined);
};
