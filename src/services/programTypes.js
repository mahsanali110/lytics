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
  getProgramTypes: async () => request.get('/programTypes'),
  getProgramTypeSearched: async ({ url, text }) =>
    request.get('/search-programTypes', { url, text }),
  addProgramType: async newProgramType => request.post('/programTypes', newProgramType),
  getProgramType: async programTypeId => request.get(`/programTypes/${programTypeId}`),
  updateProgramType: async ({ programTypeId, data }) =>
    request.patch(`/programTypes/${programTypeId}`, data),
  deleteProgramType: async programTypeId => request.delete(`/programTypes/${programTypeId}`),
};

export default apiWrapper(api);
