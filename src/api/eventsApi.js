import api from './axios';

export const eventsApi = {
  getAll: () => api.get('/events'),
  getCurrent: () => api.get('/events/current'),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`)
};
