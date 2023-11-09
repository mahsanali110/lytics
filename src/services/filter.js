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
  getFilter: async userId => request.get('/filters', userId),
  addFilter: async (userId, data) => request.post(`/filter/addfilter/${userId}`, data),
  updateFilter: async (filterId, data) => request.post(`/filter/updatefilter/${filterId}`, data),
  deleteFilter: async filterId => request.delete(`/filter/${filterId}`),
  savePreset: async data => request.post('/filter', data),
  getAllPreset: async objectId => request.get(`/filter/${objectId}`),
  getSinglePreset: async objectId => request.get(`/filter/${objectId}`),
  updatePreset: async ({ objectId, data }) => request.patch(`/filter/${objectId}`, data),
  deletePreset: async objectId => request.delete(`/filter/${objectId}`),
};
export default apiWrapper(api);
