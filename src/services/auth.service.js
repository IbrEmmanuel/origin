import api from './api';

const authService = {
  async register(email, password, referral_code = null, name = '') {
    const response = await api.post('/auth/register', { email, password, referral_code, name });
    return response.data;
  },

  async googleLogin(idToken, referral_code = null) {
    const response = await api.post('/auth/google', { idToken, referral_code });
    return response.data;
  },

  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(email, code, newPassword) {
    const response = await api.post('/auth/reset-password', { email, code, newPassword });
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
