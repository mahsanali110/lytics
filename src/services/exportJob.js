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
  getExportJobs: async ({ ...params }) => request.get('/exportJob', { params }),
  createExportJob: async data => request.post('/exportJob', data),
  getExportJobById: async jobId => request.get(`/exportJob/${jobId}`),
  updateExportJob: async ({ id, data }) => request.put(`/exportJob/${id}`, data),
  deleteExportJob: async alarmId => request.delete(`/alarm/${alarmId}`),
  exportToDrive: async ({ data }) => request.post('/exportJob/export-to-drive', data),
};
export default apiWrapper(api);
