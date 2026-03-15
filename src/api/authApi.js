import api from './axios';

export const authApi = {
  adminLogin: (credentials) => api.post('/auth/login', credentials),
  adminLogout: () => api.post('/auth/logout'),
  memberLogin: (credentials) => api.post('/auth/member/login', credentials),
  memberLogout: () => api.post('/auth/member/logout'),
  getMe: () => api.get('/auth/me')
};
