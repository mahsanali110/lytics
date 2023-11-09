import axios from 'axios';

import { USERS_BASE_URL } from 'constants/config';
// import { PUBLIC_URL, LOCAL_URL } from 'constants/config/config.dev';
import { apiWrapper, errorInterceptor, requestInterceptor, checkForce } from './interceptors';

// let URL;
// sessionStorage.getItem('internet') === 'true' ? (URL = PUBLIC_URL) : (URL = LOCAL_URL);

const request = axios.create({ baseURL: USERS_BASE_URL });
// const request = axios.create({ baseURL: URL });
request.interceptors.response.use(null, errorInterceptor);
request.interceptors.request.use(requestInterceptor);
request.interceptors.request.use(checkForce);

const api = {
  getMainThemeStats: async payload => request.post('/analytics/mediaThemes', payload),
  getMainTopicStats: async payload => request.post('/analytics/mainTopics', payload),
  getSubThemeStats: async payload => request.post('/analytics/subThemes', payload),
  getSubTopicStats: async payload => request.post('/analytics//subTopics', payload),
  getStatePillarStats: async payload => request.post('/analytics/trendsOfPillars', payload),
  addAlramStats: async payload => request.post('/analytics/alarmStats', payload),
  getGuestStats: async payload => request.post('/analytics/guestMentionStats', payload),
};

export default apiWrapper(api);
