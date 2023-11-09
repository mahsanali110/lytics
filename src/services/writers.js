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
  getWriters: async () => request.get('/writers/all'),
  addWriter: async newWriter =>
    request.post('/writers/create', newWriter, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  getWriter: async writerId => request.get(`/writers/single/${writerId}`),
  updateWriter: async ({ writerId, data }) =>
    request.put(`/writers/update/${writerId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  deleteWriter: async writerId => request.delete(`/writers/delete/${writerId}`),
};

export default apiWrapper(api);
