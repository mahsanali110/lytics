import { createRequestTypes, action } from '../common/actions';

export const CREATE_LIBRARY_JOB = createRequestTypes('CREATE_LIBRARY_JOB');
export const FETCH_LIBRARY_JOBS_PERSONAL = createRequestTypes('FETCH_LIBRARY_JOBS_PERSONAL');
export const FETCH_LIBRARY_JOBS_COMPANY = createRequestTypes('FETCH_LIBRARY_JOBS_COMPANY');
export const GET_JOB_BY_ID_LIBRARY = createRequestTypes('GET_JOB_BY_ID_LIBRARY');
export const SHARE_JOB = createRequestTypes('SHARE_JOB');
export const YOUTUBE_POST = createRequestTypes('YOUTUBE_POST');

const libraryJobsActions = {
  createJob: {
    request: data => action(CREATE_LIBRARY_JOB.REQUEST, { payload: data }),
    success: data => action(CREATE_LIBRARY_JOB.SUCCESS, { payload: data }),
    failure: data => action(CREATE_LIBRARY_JOB.FAILURE, { payload: data }),
  },
  fetchJobsPersonal: {
    request: data => action(FETCH_LIBRARY_JOBS_PERSONAL.REQUEST, { payload: data }),
    success: data => action(FETCH_LIBRARY_JOBS_PERSONAL.SUCCESS, { payload: data }),
    failure: data => action(FETCH_LIBRARY_JOBS_PERSONAL.FAILURE, { payload: data }),
  },

  fetchJobsCompany: {
    request: data => action(FETCH_LIBRARY_JOBS_COMPANY.REQUEST, { payload: data }),
    success: data => action(FETCH_LIBRARY_JOBS_COMPANY.SUCCESS, { payload: data }),
    failure: data => action(FETCH_LIBRARY_JOBS_COMPANY.FAILURE, { payload: data }),
  },
  getJobById: {
    request: data => action(GET_JOB_BY_ID_LIBRARY.REQUEST, { payload: data }),
    success: data => action(GET_JOB_BY_ID_LIBRARY.SUCCESS, { payload: data }),
    failure: data => action(GET_JOB_BY_ID_LIBRARY.FAILURE, { payload: data }),
  },
  shareJob: {
    request: data => action(SHARE_JOB.REQUEST, { payload: data }),
    success: data => action(SHARE_JOB.SUCCESS, { payload: data }),
    failure: data => action(SHARE_JOB.FAILURE, { payload: data }),
  },
  youtubePost: {
    request: data => action(YOUTUBE_POST.REQUEST, { payload: data }),
    success: data => action(YOUTUBE_POST.SUCCESS, { payload: data }),
    failure: data => action(YOUTUBE_POST.FAILURE, { payload: data }),
  },
};

export default libraryJobsActions;
