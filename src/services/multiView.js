import axios from 'axios';
// import { USERS_BASE_URL } from '../constants/config';
import { USERS_BASE_URL } from 'constants/config/config.dev';

import { ACTUS_API_PATH } from 'constants/index';

import { apiWrapper, errorInterceptor, requestInterceptor, checkForce } from './interceptors';

const request = axios.create({ baseURL: ACTUS_API_PATH });
request.interceptors.response.use(null, errorInterceptor);
request.interceptors.request.use(requestInterceptor);
request.interceptors.request.use(checkForce);

const api = {
  getChannels: payload => {
    return new Promise((resolve, reject) => {
      request
        .get(`/search/${payload}`)
        .then(res => {
          const { data } = res;
          resolve({ data });
        })
        .catch(() => {
          reject();
        });
    });
  },
  getActusURL: async () => request.get(`${USERS_BASE_URL}/auth/checkActus`),
};

export default apiWrapper(api);
