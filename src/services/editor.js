import axios from 'axios';
import { USERS_BASE_URL } from 'constants/config';
import { apiWrapper, errorInterceptor, requestInterceptor, checkForce } from './interceptors';

const request = axios.create({ baseURL: USERS_BASE_URL });
request.interceptors.request.use(checkForce);
request.interceptors.request.use(requestInterceptor);
request.interceptors.response.use(null, errorInterceptor);

const api = {
  exportVideo: async data => request.post('/mediaManager/process', data),
  checkVideoStatus: async ({ videoId }) => request.get(`/mediaManager/video/status/${videoId}`),
};

export default apiWrapper(api);
