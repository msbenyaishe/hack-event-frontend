import api from './axios';

export const teamsApi = {
  getScoreboard: (eventId) => api.get(`/teams/scoreboard/${eventId}?t=${new Date().getTime()}`),
  getAll: () => api.get(`/teams?t=${new Date().getTime()}`),
  getById: (id) => api.get(`/teams/${id}`),
  getTeamMembers: (id) => api.get(`/teams/${id}/members`),
  create: (data) => api.post('/teams', data),
  update: (id, data) => api.put(`/teams/${id}`, data),
  updateScores: (id, data) => api.put(`/teams/${id}/scores`, data, { headers: { 'Content-Type': 'application/json' } }),
  delete: (id) => api.delete(`/teams/${id}`),
  removeMember: (teamId, memberId) => api.delete(`/teams/${teamId}/members/${memberId}`),
  getAvailableMembers: (eventId) => api.get(`/teams/available?event_id=${eventId}`),
  addMember: (teamId, memberId) => api.post('/teams/add-member', { team_id: teamId, memberId })
};
