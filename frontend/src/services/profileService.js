import api from './api';

export const profileService = {
    getProfile: async () => {
        const response = await api.get('/profile');
        return response.data;
    },

    updateProfile: async (profileData) => {
        const response = await api.put('/profile', profileData);
        return response.data;
    },

    changePassword: async (passwordData) => {
        const response = await api.post('/profile/change-password', passwordData);
        return response.data;
    }
};
