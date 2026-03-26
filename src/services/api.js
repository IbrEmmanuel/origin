import axios from 'axios';
import router from '@/router';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});
// ... (omitting request interceptor for brevity in search, but will keep it in replace)

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refreshing and expiry
api.interceptors.response.use(
  (response) => {
    const newToken = response.headers['x-new-token'];
    if (newToken) {
      localStorage.setItem('token', newToken);
    }
    return response;
  },
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      const message = error.response.data?.message?.toLowerCase() || '';
      const isAuthError = error.response.status === 401 || 
                         message.includes('token') || 
                         message.includes('expired') || 
                         message.includes('forbidden');

      if (isAuthError && !message.includes('verify')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
