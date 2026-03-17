import api from './axios';

export const authApi = {
  adminLogin: (credentials) => api.post('/auth/login', credentials),
  adminLogout: () => api.post('/auth/logout'),
  memberLogin: (credentials) => api.post('/auth/member/login', credentials),
  memberRegister: (data) => api.post('/auth/member/register', data),
  memberLogout: () => api.post('/auth/member/logout'),
  getMe: () => api.get('/auth/me')
};
