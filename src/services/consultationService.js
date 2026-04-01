import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const consultationService = {
    async getMyConsultations() {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/consultations`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    async getConsultationTypes() {
        const response = await axios.get(`${API_URL}/consultations/types`);
        return response.data;
    },

    async getAvailableSlots(date) {
        const response = await axios.get(`${API_URL}/consultations/available-slots`, {
            params: { date }
        });
        return response.data;
    },

    async createBooking(bookingData) {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/consultations`, bookingData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    async verifyPayment(consultationId, reference) {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/consultations/${consultationId}/verify-payment`, { reference }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};

export default consultationService;
