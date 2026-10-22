import api from './api';

const consultationService = {
  async getMyConsultations() {
    const { data } = await api.get('/consultations');
    return data;
  },

  async getConsultationTypes() {
    const { data } = await api.get('/consultations/types');
    return data;
  },

  async getAvailableSlots(date) {
    const { data } = await api.get('/consultations/available-slots', {
      params: { date }
    });
    return data;
  },

  async createBooking(bookingData) {
    const { data } = await api.post('/consultations', bookingData);
    return data;
  },

  async verifyPayment(consultationId, reference) {
    const { data } = await api.post(`/consultations/${consultationId}/verify-payment`, {
      reference
    });
    return data;
  }
};

export default consultationService;
