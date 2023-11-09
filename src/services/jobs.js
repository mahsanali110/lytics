import axios from 'axios';
import { pick } from 'lodash';

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
  fetchJobs: async ({ ...params }) => request.get(`/jobs`, { params }),
  getJobById: async id => request.get(`/jobs/${id}`),
  updateJob: async ({ data, id }) => request.patch(`/jobs/${id}`, data),
  createJob: async data => request.post(`/jobs`, data),
  deleteJob: async id => request.delete(`/jobs/${id}`),
  exportVideo: async data => request.post(`/jobs/export-video`, data),
  editBunchJobs: async data => request.put(`/jobs`, data),
  refreshJob: async data => request.post(`/engine/refresh-jobs`, data),
  randomAPI: async data => request.post(`/jobs/sentiments`, data),
  createMediaJobs: async data =>
    request.post(`/jobs/mediaJobs`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  createWebsiteJob: async data =>
    request.post(`/jobs/websiteJobs`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  createSocialJob: async data =>
    request.post(`/jobs/socialJobs`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  bulkEsclateJobs: async data => request.post(`/jobs/bulk-escalations`, data),
  lockJob: async data => request.post(`/jobs/lock-job`, data),
  unlockJob: async data => request.post(`/jobs/unLock-job`, data),
  lockUnlockJob: async data => request.post(`/jobs/lock-unlock`, data),
  fetchJobsByHashtag: async data => {
    return request.post(
      `/jobs/hashTagSearch?hashTag=${data.hashtag}&page=${data.pageNumber}&limit=${data.limit}`
    );
  },
};

export default apiWrapper(api);
