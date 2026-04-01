import api from './api';

const applianceService = {
  async getAppliances() {
    try {
      const response = await api.get('/appliances');
      return response.data;
    } catch (error) {
      console.error('Error fetching appliances:', error);
      throw error;
    }
  }
};

export default applianceService;
