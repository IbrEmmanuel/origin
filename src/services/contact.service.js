import api from './api';

class ContactService {
  async sendMessage(contactData) {
    try {
      const response = await api.post('/contact', contactData);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error('Network error or server is down');
    }
  }
}

export default new ContactService();
