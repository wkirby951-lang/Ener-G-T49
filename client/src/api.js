/**
 * API helper for communicating with the Express backend.
 */

const API_BASE = '';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

export const api = {
  // General
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),

  // Auth
  signup: (body) => request('/api/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/api/auth/me'),
  forgotPassword: (body) => request('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify(body) }),

  // Content
  getModalities: () => request('/api/content/modalities'),
  getLibrary: (params) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/api/content/library${qs}`);
  },
  getContentById: (id) => request(`/api/content/${id}`),
  getContentByModality: () => request('/api/content/by-modality'),

  // User
  getDashboard: () => request('/api/user/dashboard'),
  completeSession: (body) => request('/api/user/session/complete', { method: 'POST', body: JSON.stringify(body) }),
  toggleFavorite: (body) => request('/api/user/favorites/toggle', { method: 'POST', body: JSON.stringify(body) }),
  getSubscription: () => request('/api/user/subscription'),
  upgradeSubscription: (body) => request('/api/user/subscription/upgrade', { method: 'POST', body: JSON.stringify(body) }),
};