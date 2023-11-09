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
  addHashtag: async newHashtag => request.post('/hashtags', newHashtag),
  getHashtags: async () => request.get('/hashtags'),
  getTopHashtags: async () => request.get('/jobs/topHashtag'),
  //   deleteTopic: async topicId => request.delete(`/topic/${topicId}`),
  //   getTopic: async topicId => request.get(`/topic/${topicId}`),
  //   updateTopic: async ({ topicId, data }) => request.patch(`/topic/${topicId}`, data),
};
export default apiWrapper(api);
