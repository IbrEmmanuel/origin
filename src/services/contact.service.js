import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

class ContactService {
    async sendMessage(contactData) {
        try {
            const response = await axios.post(`${API_URL}/api/contact`, contactData);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Network error or server is down');
        }
    }
}

export default new ContactService();
