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
  addTheme: async newTheme => request.post('/themes', newTheme),
  getThemes: async () => request.get('/themes'),
  deleteTheme: async themeId => request.delete(`/themes/${themeId}`),
  getTheme: async themeId => request.get(`/themes/${themeId}`),
  updateTheme: async ({ themeId, data }) => request.patch(`/themes/${themeId}`, data),
};
export default apiWrapper(api);
