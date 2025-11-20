import api from './api';

export const todoService = {
    createTodo: async (todoData) => {
        const response = await api.post('/todos', todoData);
        return response.data;
    },

    getTodos: async (filters = {}) => {
        const params = new URLSearchParams(filters);
        const response = await api.get(`/todos?${params}`);
        return response.data;
    },

    getFamilyTodos: async () => {
        const response = await api.get('/todos/family');
        return response.data;
    },

    getUpcomingTodos: async () => {
        const response = await api.get('/todos/upcoming');
        return response.data;
    },

    updateTodo: async (id, updates) => {
        const response = await api.put(`/todos/${id}`, updates);
        return response.data;
    },

    deleteTodo: async (id) => {
        const response = await api.delete(`/todos/${id}`);
        return response.data;
    }
};
