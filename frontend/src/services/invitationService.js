import api from './api';

export const invitationService = {
    sendInvitation: async (email) => {
        const response = await api.post('/invitations/send', { email });
        return response.data;
    },

    getInvitation: async (token) => {
        const response = await api.get(`/invitations/${token}`);
        return response.data;
    },

    acceptInvitation: async (token, name, password) => {
        const response = await api.post('/invitations/accept', { token, name, password });
        return response.data;
    },

    getPendingInvitations: async () => {
        const response = await api.get('/invitations/pending/list');
        return response.data;
    },

    reviewInvitation: async (invitationId, approved) => {
        const response = await api.post('/invitations/review', { invitationId, approved });
        return response.data;
    }
};
