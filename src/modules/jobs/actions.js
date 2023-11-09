import { createRequestTypes, action } from '../common/actions';

export const SET_RANGEPICKER_DATE = 'SET_RANGEPICKER_DATE';
export const UPDATE_BY_FIELD = 'UPDATE_BY_FIEALD';
export const SET_ESCALATIONS = 'SET_ESCALATIONS';
export const IMPORT_VIDEOS = 'IMPORT_VIDEOS';
export const RESET_JOB = 'RESET_JOB';
export const REFRESH_JOB = createRequestTypes('REFRESH_JOB');
export const FETCH_JOBS = createRequestTypes('FETCH_JOBS');
export const FETCH_JOBS_BY_HASHTAG = createRequestTypes('FETCH_JOBS_BY_HASHTAG');
export const GET_JOB_BY_ID = createRequestTypes('GET_JOB_BY_ID');
export const CREATE_JOB = createRequestTypes('CREATE_JOB');
export const UPDATE_JOB = createRequestTypes('UPDATE_JOB');
export const DELETE_JOB = createRequestTypes('DELETE_JOB');
export const EDIT_BUNCH_JOBS = createRequestTypes('EDIT_BUNCH_JOBS');
export const EXPORT_VIDEO = createRequestTypes('EXPORT_VIDEO');
export const CREATE_MEDIA_JOBS = createRequestTypes('CREATE_MEDIA_JOBS');
export const BULK_ESCALATE_JOBS = createRequestTypes('BULK_ESCALATE_JOBS');
export const LOCK_JOB = createRequestTypes('LOCK_JOB');
export const UN_LOCK_JOB = createRequestTypes('UN_LOCK_JOB');
export const CREATE_WEBSITE_JOB = createRequestTypes('CREATE_WEBSITE_JOB');
export const CREATE_SOCIAL_JOB = createRequestTypes('CREATE_SOCIAL_JOB');
export const RESET_JOBS = createRequestTypes('RESET_JOBS');
export const LOCK_UN_LOCK_JOB = createRequestTypes('LOCK_UN_LOCK_JOB');
export const UPDATE_JOB_ARRAY_THROUGH_EVENT = 'UPDATE_JOB_ARRAY_THROUGH_EVENT';
export const GET_JOB_BY_ID_FROM_REDUCER = 'GET_JOB_BY_ID_FROM_REDUCER';
export const SET_LOADING = 'SET_LOADING';

export const jobActions = {
  exportVideo: {
    request: data => action(EXPORT_VIDEO.REQUEST, { payload: data }),
  },
  reset: {
    request: data => action(RESET_JOBS.REQUEST, { payload: data }),
  },
  fetchJobs: {
    request: data => action(FETCH_JOBS.REQUEST, { payload: data }),
    success: data => action(FETCH_JOBS.SUCCESS, { payload: data }),
    failure: error => action(FETCH_JOBS.FAILURE, { payload: error }),
  },
  fetchJobsByHashtag: {
    request: data => action(FETCH_JOBS_BY_HASHTAG.REQUEST, { payload: data }),
    success: data => action(FETCH_JOBS_BY_HASHTAG.SUCCESS, { payload: data }),
    failure: error => action(FETCH_JOBS_BY_HASHTAG.FAILURE, { payload: error }),
  },
  refreshJob: {
    request: data => action(REFRESH_JOB.REQUEST, { payload: data }),
    success: data => action(REFRESH_JOB.SUCCESS, { payload: data }),
    failure: error => action(REFRESH_JOB.FAILURE, { payload: error }),
  },
  // Async
  getJobById: {
    request: data => action(GET_JOB_BY_ID.REQUEST, { payload: data }),
    success: data => action(GET_JOB_BY_ID.SUCCESS, { payload: data }),
    failure: error => action(GET_JOB_BY_ID.FAILURE, { payload: error }),
  },

  updateJob: {
    request: data => action(UPDATE_JOB.REQUEST, { payload: data }),
    success: data => action(UPDATE_JOB.SUCCESS, { payload: data }),
    failure: error => action(UPDATE_JOB.FAILURE, { payload: error }),
  },

  createJob: {
    request: data => action(CREATE_JOB.REQUEST, { payload: data }),
    success: data => action(CREATE_JOB.SUCCESS, { payload: data }),
    failure: error => action(CREATE_JOB.FAILURE, { payload: error }),
  },
  deleteJob: {
    request: data => action(DELETE_JOB.REQUEST, { payload: data }),
    success: data => action(DELETE_JOB.SUCCESS, { payload: data }),
    failure: error => action(DELETE_JOB.FAILURE, { payload: error }),
  },
  createMediaJobs: {
    request: data => action(CREATE_MEDIA_JOBS.REQUEST, { payload: data }),
    success: data => action(CREATE_MEDIA_JOBS.SUCCESS, { payload: data }),
    failure: error => action(CREATE_MEDIA_JOBS.FAILURE, { payload: error }),
  },
  createWebsiteJob: {
    request: data => action(CREATE_WEBSITE_JOB.REQUEST, { payload: data }),
    success: data => action(CREATE_WEBSITE_JOB.SUCCESS, { payload: data }),
    failure: error => action(CREATE_WEBSITE_JOB.FAILURE, { payload: error }),
  },
  createSocialJob: {
    request: data => action(CREATE_SOCIAL_JOB.REQUEST, { payload: data }),
    success: data => action(CREATE_SOCIAL_JOB.SUCCESS, { payload: data }),
    failure: error => action(CREATE_SOCIAL_JOB.FAILURE, { payload: error }),
  },
  editBunchJobs: {
    request: data => action(EDIT_BUNCH_JOBS.REQUEST, { payload: data }),
    success: data => action(EDIT_BUNCH_JOBS.SUCCESS, { payload: data }),
    failure: error => action(EDIT_BUNCH_JOBS.FAILURE, { payload: error }),
  },
  bulkEscalateJobs: {
    request: data => action(BULK_ESCALATE_JOBS.REQUEST, { payload: data }),
    success: data => action(BULK_ESCALATE_JOBS.SUCCESS, { payload: data }),
    failure: data => action(BULK_ESCALATE_JOBS.FAILURE, { payload: data }),
  },
  lockJob: {
    request: data => action(LOCK_JOB.REQUEST, { payload: data }),
    success: data => action(LOCK_JOB.SUCCESS, { payload: data }),
    failure: error => action(LOCK_JOB.FAILURE, { payload: error }),
  },
  unlockJob: {
    request: data => action(UN_LOCK_JOB.REQUEST, { payload: data }),
    success: data => action(UN_LOCK_JOB.SUCCESS, { payload: data }),
    failure: error => action(UN_LOCK_JOB.FAILURE, { payload: error }),
  },
  lockUnlockJob: {
    request: data => action(LOCK_UN_LOCK_JOB.REQUEST, { payload: data }),
    success: data => action(LOCK_UN_LOCK_JOB.SUCCESS, { payload: data }),
    failure: error => action(LOCK_UN_LOCK_JOB.FAILURE, { payload: error }),
  },
  setHash: {
    request: data => {
      return {
        type: 'Hashing',
        payload: data,
      };
    },
  },
  updateByField: payload => action(UPDATE_BY_FIELD, { payload }),
  setEscalations: payload => action(SET_ESCALATIONS, { payload }),
  importVideos: payload => action(IMPORT_VIDEOS, { payload }),
  resetJob: payload => action(RESET_JOB, { payload }),
  updateJobArrayThroughEvent: data => action(UPDATE_JOB_ARRAY_THROUGH_EVENT, { payload: data }),
  setLoading: data => action(SET_LOADING, { payload: data }),
  getJobByIdFromReducer: data => action(GET_JOB_BY_ID_FROM_REDUCER, { payload: data }),
};
