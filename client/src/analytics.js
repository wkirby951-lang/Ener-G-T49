/**
 * Lightweight analytics module.
 * Tracks key events by sending them to the backend /api/analytics/track endpoint.
 * No external dependencies. Privacy-friendly: no PII, no third-party tracking.
 */

let sessionId = null;
let pageViewTracked = false;

function getSessionId() {
  if (!sessionId) {
    sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
  }
  return sessionId;
}

/**
 * Track an analytics event.
 * @param {string} eventName - Event name (e.g., 'page_view', 'signup_completed')
 * @param {object} eventData - Optional event-specific data
 * @param {boolean} requireAuth - If true, only send if user is logged in
 */
export function track(eventName, eventData = {}, requireAuth = false) {
  // Don't track if Do Not Track is enabled
  if (navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes') {
    return;
  }

  const token = localStorage.getItem('token');
  if (requireAuth && !token) return;

  const payload = {
    eventName,
    eventData,
    pageUrl: window.location.pathname,
    sessionId: getSessionId(),
  };

  // Fire and forget — no need to await
  fetch('/api/analytics/track', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  }).catch(() => {
    // Silently fail — analytics shouldn't break the app
  });
}

/**
 * Track a page view (called once per page navigation).
 */
export function trackPageView(page) {
  // Only track the first page view per session to avoid duplicates
  if (!pageViewTracked) {
    track('page_view', { page });
    pageViewTracked = true;
  }
}

/**
 * Reset page view tracking (call on route change).
 */
export function resetPageTracking() {
  pageViewTracked = false;
}