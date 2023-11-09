import { createRequestTypes, action } from '../common/actions';

export const FETCH_TV_ONLINE_JOBS = createRequestTypes('FETCH_TV_ONLINE_JOBS');
export const FETCH_PRINT_WEB_JOBS = createRequestTypes('FETCH_PRINT_WEB_JOBS');
export const FETCH_SOCIAL_JOBS = createRequestTypes('FETCH_SOCIAL_JOBS');
export const FETCH_TICKER_JOBS = createRequestTypes('FETCH_TICKER_JOBS');
export const UPDATE_JOB_ARRAY = 'UPDATE_JOB_ARRAY';
export const RESET_NEWSBOARD_REDUCER = 'RESET_NEWSBOARD_REDUCER';
export const UPDATE_CURRENT_USER = createRequestTypes('UPDATE_CURRENT_USER');

const newsboardActions = {
  fetchTvOnlineJobs: {
    request: data => action(FETCH_TV_ONLINE_JOBS.REQUEST, { payload: data }),
    success: data => action(FETCH_TV_ONLINE_JOBS.SUCCESS, { payload: data }),
    failure: data => action(FETCH_TV_ONLINE_JOBS.FAILURE, { payload: data }),
  },
  fetchPrintWeb: {
    request: data => action(FETCH_PRINT_WEB_JOBS.REQUEST, { payload: data }),
    success: data => action(FETCH_PRINT_WEB_JOBS.SUCCESS, { payload: data }),
    failure: data => action(FETCH_PRINT_WEB_JOBS.FAILURE, { payload: data }),
  },
  fetchSocialJobs: {
    request: data => action(FETCH_SOCIAL_JOBS.REQUEST, { payload: data }),
    success: data => action(FETCH_SOCIAL_JOBS.SUCCESS, { payload: data }),
    failure: data => action(FETCH_SOCIAL_JOBS.FAILURE, { payload: data }),
  },
  fetchTickerJobs: {
    request: data => action(FETCH_TICKER_JOBS.REQUEST, { payload: data }),
    success: data => action(FETCH_TICKER_JOBS.SUCCESS, { payload: data }),
    failure: data => action(FETCH_TICKER_JOBS.FAILURE, { payload: data }),
  },
  updateCurrentUser: {
    request: data => action(UPDATE_CURRENT_USER.REQUEST, { payload: data }),
    success: data => action(UPDATE_CURRENT_USER.SUCCESS, { payload: data }),
    failure: data => action(UPDATE_CURRENT_USER.FAILURE, { payload: data }),
  },
  updateJobArray: data => action(UPDATE_JOB_ARRAY, { payload: data }),
  resetNewsboardReducer: () => action(RESET_NEWSBOARD_REDUCER),
};

export default newsboardActions;
