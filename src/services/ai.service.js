import api from './api';

const aiService = {
    /**
     * Send a message to Energy AI
     * @param {string} message - User message
     * @param {number|null} conversationId - Optional conversation ID
     * @returns {Promise}
     */
    sendMessage: async (message, conversationId = null) => {
        try {
            const response = await api.post('/ai/chat', {
                message,
                conversation_id: conversationId
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Get user chat history
     * @returns {Promise}
     */
    getHistory: async () => {
        try {
            const response = await api.get('/ai/history');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Get messages for a specific conversation
     * @param {number} id - Conversation ID
     * @returns {Promise}
     */
    getConversation: async (id) => {
        try {
            const response = await api.get(`/ai/history/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Delete a conversation
     * @param {number} id - Conversation ID
     * @returns {Promise}
     */
    deleteConversation: async (id) => {
        try {
            const response = await api.delete(`/ai/history/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default aiService;
