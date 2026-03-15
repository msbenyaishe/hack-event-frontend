import api from './axios';

export const timersApi = {
  getGlobalTimer: () => api.get('/timers/event/global'),
  start: () => api.put('/timers/event/global/start'),
  pause: () => api.put('/timers/event/global/pause'),
  resume: () => api.put('/timers/event/global/resume'),
  finish: () => api.put('/timers/event/global/finish')
};
