import api from './api';

export const familyService = {
    createFamily: async (familyData) => {
        const response = await api.post('/family/create', familyData);
        return response.data;
    },

    joinFamily: async (inviteCode) => {
        const response = await api.post('/family/join', { inviteCode });
        return response.data;
    },

    getMembers: async () => {
        const response = await api.get('/family/members');
        return response.data;
    },

    leaveFamily: async () => {
        const response = await api.delete('/family/leave');
        return response.data;
    },

    updateMemberRole: async (memberId, role) => {
        const response = await api.put('/family/members/role', { memberId, role });
        return response.data;
    },

    removeMember: async (memberId) => {
        const response = await api.delete(`/family/members/${memberId}`);
        return response.data;
    }
};
