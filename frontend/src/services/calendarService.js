import api from './api';

export const calendarService = {
    createEvent: async (eventData) => {
        const response = await api.post('/calendar/events', eventData);
        return response.data;
    },

    getPersonalEvents: async () => {
        const response = await api.get('/calendar/personal');
        return response.data;
    },

    getFamilyEvents: async () => {
        const response = await api.get('/calendar/family');
        return response.data;
    },

    getEventsByMonth: async (year, month) => {
        const response = await api.get(`/calendar/month/${year}/${month}`);
        return response.data;
    },

    updateEvent: async (id, updates) => {
        const response = await api.put(`/calendar/events/${id}`, updates);
        return response.data;
    },

    deleteEvent: async (id) => {
        const response = await api.delete(`/calendar/events/${id}`);
        return response.data;
    }
};
