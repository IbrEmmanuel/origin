import axios from 'axios';
import router from '@/router';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

const isAuthCredentialRequest = (config) => {
  const url = config?.url || '';
  return /\/auth\/(login|register|google|forgot-password|reset-password|verify|resend-code)/.test(url);
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    const newToken = response.headers['x-new-token'];
    if (newToken) {
      localStorage.setItem('token', newToken);
    }
    return response;
  },
  (error) => {
    // Don't treat failed login/register as an expired session
    if (isAuthCredentialRequest(error.config)) {
      return Promise.reject(error);
    }

    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      const message = error.response.data?.message?.toLowerCase() || '';
      const isAuthError =
        error.response.status === 401 ||
        message.includes('token') ||
        message.includes('expired') ||
        message.includes('forbidden');

      if (isAuthError && !message.includes('verify')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (router.currentRoute.value.path !== '/login') {
          router.push('/login');
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export function getAuthErrorMessage(err, fallback = 'Login failed. Please check your credentials.') {
  if (!err) return fallback;

  if (!err.response) {
    if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
      return 'Cannot reach the server. Check your connection and try again.';
    }
    return err.message || fallback;
  }

  const data = err.response.data;
  if (typeof data === 'string' && data.trim()) {
    // Cloudflare / HTML challenge pages
    if (data.includes('<!DOCTYPE') || data.includes('<html')) {
      return 'Cannot reach the server. Please try again in a moment.';
    }
    return data;
  }

  if (data?.message || data?.error) {
    const msg = data.message || data.error;
    if (/imunify|bot-protection|whitelist/i.test(msg)) {
      return 'Login blocked by server bot-protection (Imunify360). Ask your host to whitelist your IP or disable bot protection on /api/auth/*.';
    }
    return msg;
  }

  // Empty 403 bodies usually mean WAF / origin block, not bad password
  if (err.response.status === 403) {
    return 'Server blocked the login request (bot-protection). This is not an invalid-password error — the API host is blocking the request.';
  }

  if (err.response.status >= 500) {
    return 'Server error. Please try again in a moment.';
  }

  return fallback;
}
