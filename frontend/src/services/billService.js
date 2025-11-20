import api from './api';

export const billService = {
    createBill: async (billData) => {
        const response = await api.post('/bills', billData);
        return response.data;
    },

    getBills: async (filters = {}) => {
        const params = new URLSearchParams(filters);
        const response = await api.get(`/bills?${params}`);
        return response.data;
    },

    getUpcomingBills: async () => {
        const response = await api.get('/bills/upcoming');
        return response.data;
    },

    markBillPaid: async (id) => {
        const response = await api.patch(`/bills/${id}/paid`);
        return response.data;
    },

    updateBill: async (id, updates) => {
        const response = await api.put(`/bills/${id}`, updates);
        return response.data;
    },

    deleteBill: async (id) => {
        const response = await api.delete(`/bills/${id}`);
        return response.data;
    }
};
