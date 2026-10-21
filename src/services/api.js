import axios from 'axios';
import router from '@/router';

// Prefer same-origin `/api` (Vite/Vercel proxy) so the browser is not blocked by CORS.
// Proxy must not spoof User-Agent/Origin or Imunify360 may 403.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  timeout: 30000
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
      return 'Cannot reach the API (network/CORS). Use VITE_API_URL=/api with the Vite proxy for local dev, or ask the host to allow CORS from this site on api.originelectricltd.com.';
    }
    if (err.code === 'ECONNABORTED') {
      return 'The server took too long to respond. Please try again.';
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
      return 'The API host is still blocking this request (Imunify360). In cPanel/Imunify360: whitelist your IP, or disable bot-protection for api.originelectricltd.com /api/auth/*. Also allow CORS for your site origin.';
    }
    return msg;
  }

  // Empty 403 bodies usually mean WAF / origin block, not bad password
  if (err.response.status === 403) {
    return 'The API returned 403 (host firewall). Whitelist your IP in Imunify360 or disable bot-protection on /api/auth/* — this is not an invalid password.';
  }

  if (err.response.status >= 500) {
    return 'Server error. Please try again in a moment.';
  }

  return fallback;
}
