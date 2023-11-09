import axios from 'axios';

import { USERS_BASE_URL } from '../constants/config';
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
  getHomeData: payload => {
    return new Promise((resolve, reject) => {
      request
        .get(`/homeData/${payload}`)
        .then(res => {
          const { data } = res;
          resolve({ data });
        })
        .catch(() => {
          reject();
        });
    });
  },
};

export default apiWrapper(api);
