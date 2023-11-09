import axios from 'axios';

import { USERS_BASE_URL } from 'constants/config';
import { apiWrapper, errorInterceptor, requestInterceptor, checkForce } from './interceptors';

const request = axios.create({ baseURL: USERS_BASE_URL });

request.interceptors.response.use(null, errorInterceptor);
request.interceptors.request.use(requestInterceptor);
request.interceptors.request.use(checkForce);

const api = {
  createJob: async data =>
    request.post('/jobs/singlePrintJobs', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};

export default apiWrapper(api);
