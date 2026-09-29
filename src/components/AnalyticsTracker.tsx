import {useEffect, useRef} from 'react';
import {useLocation} from 'react-router-dom';
import {analyticsEnabled, deviceType, referrerType, sendAnalytics, visitorId} from '@/lib/analytics';

const AnalyticsTracker = () => {
  const location = useLocation();
  const visitor = useRef(visitorId());
  const referrer = useRef(referrerType());

  useEffect(() => {
    if (!analyticsEnabled()) return;
    const base = {visitorId: visitor.current, path: location.pathname, device: deviceType(), referrer: referrer.current};
    sendAnalytics({event: 'page_view', ...base});

    const sessionKey = 'norte4j_session_started';
    let sessionStarted = false;
    try {
      sessionStarted = sessionStorage.getItem(sessionKey) === '1';
      if (!sessionStarted) sessionStorage.setItem(sessionKey, '1');
    } catch { /* armazenamento indisponível: conta a sessão atual */ }
    if (!sessionStarted) {
      sendAnalytics({event: 'session_start', ...base});
    }

    const startedAt = Date.now();
    let engagementSent = false;
    const sendEngagement = () => {
      if (engagementSent) return;
      engagementSent = true;
      const durationSeconds = Math.min(3600, Math.max(0, Math.round((Date.now() - startedAt) / 1000)));
      sendAnalytics({event: 'engagement', durationSeconds, ...base});
    };
    const reached = new Set<number>();
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const percentage = Math.round((window.scrollY / scrollable) * 100);
      ([25, 50, 75, 100] as const).forEach((depth) => {
        if (percentage >= depth && !reached.has(depth)) {
          reached.add(depth);
          sendAnalytics({event: 'scroll_depth', depth, ...base});
        }
      });
    };
    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('pagehide', sendEngagement);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pagehide', sendEngagement);
      sendEngagement();
    };
  }, [location.pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!analyticsEnabled()) return;
      const element = (event.target as Element | null)?.closest<HTMLElement>('[data-analytics-tag]');
      const tag = element?.dataset.analyticsTag;
      if (!tag) return;
      const anchor = element.closest<HTMLAnchorElement>('a[href]');
      const outbound = Boolean(anchor && new URL(anchor.href, window.location.href).origin !== window.location.origin);
      sendAnalytics({event: 'click', tag, outbound, visitorId: visitor.current, path: location.pathname, device: deviceType(), referrer: referrer.current});
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [location.pathname]);

  return null;
};

export default AnalyticsTracker;
