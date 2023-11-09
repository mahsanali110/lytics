import axios from 'axios';

import { USERS_BASE_URL } from 'constants/config';
// import { PUBLIC_URL,LOCAL_URL } from 'constants/config/config.dev';
import { apiWrapper, errorInterceptor, requestInterceptor, checkForce } from './interceptors';

// let URL;
// sessionStorage.getItem('internet') === 'true' ? (URL = PUBLIC_URL) : (URL = LOCAL_URL);

const request = axios.create({ baseURL: USERS_BASE_URL });
// const request = axios.create({ baseURL: URL });
request.interceptors.response.use(null, errorInterceptor);
request.interceptors.request.use(requestInterceptor);
request.interceptors.request.use(checkForce);

const api = {
  getChannels: async () => request.get('/channels'),
  getProgramTypes: async () => request.get('/programTypes'),
  getHosts: async () => request.get('/hosts'),
  getProgramNames: async () => request.get('/programNames'),
  addProgramName: async newProgramName => request.post('/programNames', newProgramName),
  getProgramName: async programNameId => request.get(`/programNames/${programNameId}`),
  updateProgramName: async ({ programNameId, data }) =>
    request.patch(`/programNames/${programNameId}`, data),
  deleteProgramName: async programNameId => request.delete(`/programNames/${programNameId}`),
};

export default apiWrapper(api);
