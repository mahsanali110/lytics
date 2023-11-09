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
  getRoles: async () => request.get('/roles'),
  getChannels: async () => request.get('/channels'),
  getUsers: async () => request.get(`/users`),
  // getSearchedUser: async params => request.get(`/users?role=${params.role}`),
  addUser: async newUser =>
    request.post('/users', newUser, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  // getUserBySearch: async => request.get(`/users&name=${params}`),
  getUser: async userId => request.get(`/users/${userId}`),
  updateUser: async ({ userId, data }) =>
    request.patch(`/users/${userId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  deleteUser: async ({ userId, data }) => request.post(`/users/${userId}`, data),
  getUsers: async params => request.get(`/users`, { params }),
};

export default apiWrapper(api);
