import api from './axios';

export const invitesApi = {
  createLeaderInvite: (data) => api.post('/invites/leader', data),
  joinLeader: (data) => api.post('/invites/leader/join', data),
  createTeamInvite: (data) => api.post('/invites/team', data),
  joinTeam: (data) => api.post('/invites/team/join', data)
};
