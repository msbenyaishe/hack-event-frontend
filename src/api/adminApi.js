import api from './axios';

export const adminApi = {
  getMembers: () => api.get('/admin/members'),
  deleteMember: (id) => api.delete(`/admin/members/${id}`),
  updateRole: (id, role) => api.put(`/admin/members/${id}/role`, { role }),
};
