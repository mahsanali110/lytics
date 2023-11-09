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
  getHosts: async () => request.get('/hosts'),
  addHost: async newHost =>
    request.post('/hosts', newHost, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  getHost: async hostId => request.get(`/hosts/${hostId}`),
  updateHost: async ({ hostId, data }) =>
    request.patch(`/hosts/${hostId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  deleteHost: async hostId => request.delete(`/hosts/${hostId}`),
};

export default apiWrapper(api);
