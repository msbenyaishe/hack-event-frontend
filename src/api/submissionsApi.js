import api from './axios';

export const submissionsApi = {
  submit: (data) => api.post('/submissions', data),
  getMine: () => api.get('/submissions/mine'),
  getAll: () => api.get('/submissions')
};
