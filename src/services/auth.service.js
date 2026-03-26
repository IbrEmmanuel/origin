import api from './api';

const authService = {
  async register(email, password) {
    const response = await api.post('/auth/register', { email, password });
    return response.data;
  },

  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async verify(email, code) {
    const response = await api.post('/auth/verify', { email, code });
    return response.data;
  },

  async resendCode(email) {
    const response = await api.post('/auth/resend-code', { email });
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  getUser() {
    const user = localStorage.getItem('user');
    if (!user) return null;
    const userData = JSON.parse(user);
    return userData;
  }
};

export default authService;
