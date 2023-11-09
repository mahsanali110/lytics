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
  getGroups: async () => request.get('/group'),
  addGroup: async newGroup => request.post('/group', newGroup),
  getGroup: async groupId => request.get(`/group/${groupId}`),
  updateGroup: async ({ groupId, data }) => request.patch(`/group/${groupId}`, data),
  deleteGroup: async groupId => request.delete(`/group/${groupId}`),
};

export default apiWrapper(api);
