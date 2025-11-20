import api from './api';

export const budgetService = {
    setBudget: async (budgetData) => {
        const response = await api.post('/budget', budgetData);
        return response.data;
    },

    getCurrentBudget: async () => {
        const response = await api.get('/budget/current');
        return response.data;
    },

    getBudget: async (year, month) => {
        const response = await api.get(`/budget/${year}/${month}`);
        return response.data;
    },

    updateSpending: async (id, categoryName, amount) => {
        const response = await api.patch(`/budget/${id}/spending`, { categoryName, amount });
        return response.data;
    }
};
