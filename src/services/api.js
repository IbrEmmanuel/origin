import axios from 'axios';
import router from '@/router';
import { env } from '@/config/env';
import { getAuthErrorMessage } from '@/lib/errors';
import { logger } from '@/lib/logger';

// Prefer same-origin `/api` (Vite/Vercel proxy) so the browser is not blocked by CORS.
// Proxy must not spoof User-Agent/Origin or Imunify360 may 403.
const api = axios.create({
  baseURL: env.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  timeout: 30000
});

const isAuthCredentialRequest = (config) => {
  const url = config?.url || '';
  return /\/auth\/(login|register|google|forgot-password|reset-password|verify|resend-code)/.test(
    url
  );
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
        logger.warn('[api] clearing session after auth failure', error.response.status);
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

export { getAuthErrorMessage };
