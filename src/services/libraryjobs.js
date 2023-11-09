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
  createJob: async ({ data, headers }) =>
    request.post(`/libraryJobs`, data, {
      headers,
    }),
  fetchJobs: async ({ ...params }) => request.get(`/libraryJobs`, { params }),
  getJobById: async id => request.get(`/libraryJobs/${id}`),
  shareJob: async ({ id, data }) =>
    request.post(`/libraryJobs/shareLibraryJob/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  youtubePost: async data =>
    request.post('/social/upload/youtube-video', data, {
      // headers: {
      //   'Content-Type': 'multipart/form-data',
      // },
    }),
};

export default apiWrapper(api);
