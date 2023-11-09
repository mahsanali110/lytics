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
  getChannels: async () => request.get('/channels'),
  addChannel: async newChannel =>
    request.post('/channels', newChannel, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  getChannel: async channelId => request.get(`/channels/${channelId}`),
  updateChannel: async ({ channelId, data }) =>
    request.patch(`/channels/${channelId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  deleteChannel: async channelId => request.delete(`/channels/${channelId}`),
};

export default apiWrapper(api);
