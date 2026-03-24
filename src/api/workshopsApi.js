import api from './axios';

export const workshopsApi = {
  getByEvent: (eventId) => api.get(`/workshops/event/${eventId}`),
  getById: (id) => api.get(`/workshops/${id}`),
  create: (data) => api.post('/workshops', data),
  update: (id, data) => api.put(`/workshops/${id}`, data),
  delete: (id) => api.delete(`/workshops/${id}`),
  getPdfList: () => api.get('/workshops/pdfs/list')
};
