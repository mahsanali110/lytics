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
  getCompanies: async () => request.get('/company'),
  addCompany: async newCompany =>
    request.post('/company', newCompany, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  getCompany: async companyId => request.get(`/company/${companyId}`),
  updateCompany: async ({ companyId, data }) =>
    request.patch(`/company/${companyId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  deleteCompany: async companyId => request.delete(`/company/${companyId}`),
};

export default apiWrapper(api);
