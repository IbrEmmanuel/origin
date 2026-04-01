import api from './api';

const settingsService = {
    async getSetting(key) {
        try {
            const response = await api.get(`/settings/${key}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching setting ${key}:`, error);
            return null;
        }
    }
};

export default settingsService;
