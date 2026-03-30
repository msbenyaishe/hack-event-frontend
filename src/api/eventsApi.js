import api from './axios';

export const eventsApi = {
  getAll: () => api.get('/events'),
  getCurrent: () => api.get('/events/current'),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => {
    if (data instanceof FormData) {
      return api.post('/events', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return api.post('/events', data);
  },
  update: (id, data) => {
    if (data instanceof FormData) {
      return api.put(`/events/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return api.put(`/events/${id}`, data);
  },
  setCurrent: (id) => api.put(`/events/${id}/current`),
  delete: (id) => api.delete(`/events/${id}`)
};
