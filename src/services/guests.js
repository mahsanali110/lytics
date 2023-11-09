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
  getAssociations: async () => request.get('/associations'),
  getGuests: async () => request.get('/guests'),
  addGuest: async newGuest =>
    request.post('/guests', newGuest, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  getGuest: async guestId => request.get(`/guests/${guestId}`),
  updateGuest: async ({ guestId, data }) =>
    request.patch(`/guests/${guestId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  deleteGuest: async guestId => request.delete(`/guests/${guestId}`),
};

export default apiWrapper(api);
