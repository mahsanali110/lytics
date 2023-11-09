import {
  FETCH_JOBS,
  GET_JOB_BY_ID,
  UPDATE_JOB,
  UPDATE_BY_FIELD,
  SET_ESCALATIONS,
  CREATE_JOB,
  CREATE_MEDIA_JOBS,
  REFRESH_JOB,
  IMPORT_VIDEOS,
  BULK_ESCALATE_JOBS,
  SET_RANGEPICKER_DATE,
  FETCH_JOBS_BY_HASHTAG,
  CREATE_WEBSITE_JOB,
  DELETE_JOB,
  CREATE_SOCIAL_JOB,
  RESET_JOBS,
  RESET_JOB,
  UPDATE_JOB_ARRAY_THROUGH_EVENT,
  SET_LOADING,
  GET_JOB_BY_ID_FROM_REDUCER,
} from './actions';
import { updateJobArr, handleSingleJob, handleUpdateResults, getJobById } from './utils';

const initialState = {
  results: [],
  tickers: [],
  hashing: false,
  searchText: '',
  loading: false,
  buttonloading: false,
  job: {
    translation: [],
    transcription: [],
  },
  errors: '',
  wordCount: 0,
  dateRange: null,
  importVideos: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_JOBS.REQUEST:
      if (payload?.loading == false) return { ...state, loading: false, errors: true };
      else return { ...state, loading: true, errors: true };
    case FETCH_JOBS_BY_HASHTAG.REQUEST:
      return {
        ...state,
        loading: true,
        errors: false,
        hastTagName: payload.hashtag,
        hashing: true,
      };
    case DELETE_JOB.REQUEST:
      return {
        ...state,
        loading: true,
        errors: false,
      };

    case RESET_JOBS.REQUEST:
      return {
        ...initialState,
        loading: false,
        errors: false,
      };
    case RESET_JOB:
      return {
        ...state,
        job: { ...initialState.job },
      };

    case DELETE_JOB.SUCCESS:
      return {
        ...state,
        loading: false,
        results: [...state.results.filter(job => job.id !== payload)],
        errors: false,
      };
    case FETCH_JOBS.SUCCESS:
      return {
        ...state,
        loading: false,
        ...payload,
        job: { ...payload.results?.[0] },
        tickers: [...payload.results],
        errors: false,
      };
    case FETCH_JOBS_BY_HASHTAG.SUCCESS:
      return {
        ...state,
        loading: false,
        totalPages: payload.totalPages,
        job: { ...payload.results[0] },
        topHashtagJobs: [...payload.results],

        errors: false,
      };
    case FETCH_JOBS_BY_HASHTAG.FAILURE:
      return { ...state, loading: false, error: payload.error, errors: true };
    case FETCH_JOBS.FAILURE:
      return { ...state, loading: false, error: payload.error, errors: true };

    case GET_JOB_BY_ID.REQUEST:
    case UPDATE_JOB.REQUEST:
    case CREATE_JOB.REQUEST:
    case CREATE_MEDIA_JOBS.REQUEST:
    case CREATE_WEBSITE_JOB.REQUEST:
    case CREATE_SOCIAL_JOB.REQUEST:
      return {
        ...state,
        buttonloading: payload.buttonloading === undefined ? true : payload.buttonloading,
        loading: payload.loading === undefined ? true : payload.loading,
      };
    case 'SET_COUNT_OF_CURRENT_JOB':
      return {
        ...state,
        wordCount: payload,
      };
    case 'Hashing':
      return {
        ...state,
        results: [],
        job: {},
        hashing: payload.isRedirect,
        searchText: payload.searchText,
        totalPages: 0,
        topHashtagJobs: [],
      };
    case GET_JOB_BY_ID.SUCCESS:
    case UPDATE_JOB.SUCCESS:
    case CREATE_JOB.SUCCESS:
    case CREATE_MEDIA_JOBS.SUCCESS:
    case CREATE_WEBSITE_JOB.SUCCESS:
    case CREATE_SOCIAL_JOB.SUCCESS:
      return {
        ...state,
        loading: false,
        buttonloading: false,
        results: handleSingleJob(
          type,
          state.results ?? state.topHashtagJobs,
          payload,
          state.wordCount
        ),
        tickers: handleSingleJob(
          type,
          state.tickers ?? state.topHashtagJobs,
          payload,
          state.wordCount
        ),
        job: { ...payload },
      };

    case GET_JOB_BY_ID.FAILURE:
    case UPDATE_JOB.FAILURE:
    case CREATE_JOB.FAILURE:
    case DELETE_JOB.FAILURE:
    case CREATE_MEDIA_JOBS.FAILURE:
    case CREATE_WEBSITE_JOB.FAILURE:
    case CREATE_SOCIAL_JOB.FAILURE:
      return { ...state, loading: false, error: payload.error };

    case UPDATE_BY_FIELD:
      return { ...state, job: { ...state.job, [payload.field]: payload.value } };

    case SET_ESCALATIONS: {
      const jobs = [...state.results];
      const jobToUpdate = jobs.find(job => job.id === payload.jobId);
      jobToUpdate.escalations = payload.data;

      const results = jobs.map(job => (job.id === payload.jobId ? jobToUpdate : job));
      return { ...state, results };
    }
    case IMPORT_VIDEOS:
      return {
        ...state,
        importVideos: payload,
      };
    case REFRESH_JOB.SUCCESS:
      return {
        ...state,
        loading: false,
        results: updateJobArr(state.results, payload),
      };
    case REFRESH_JOB.FAILURE:
      return { ...state, loading: false, error: payload.error };

    case BULK_ESCALATE_JOBS.REQUEST:
      return {
        ...state,
        loading: true,
      };

    case BULK_ESCALATE_JOBS.SUCCESS:
      return {
        ...state,
        loading: false,
        results: handleUpdateResults(state.results, payload.results),
      };

    case BULK_ESCALATE_JOBS.FAILURE:
      return {
        ...state,
        loading: false,
        error: payload.error,
      };
    case SET_RANGEPICKER_DATE:
      return { ...state, dateRange: payload };
    case UPDATE_JOB_ARRAY_THROUGH_EVENT:
      return {
        ...state,
        results: [...payload],
      };

    case SET_LOADING:
      return {
        ...state,
        loading: payload.loading,
      };

    case GET_JOB_BY_ID_FROM_REDUCER:
      return {
        ...state,
        job: getJobById(payload.jobId, state.results),
      };

    default:
      return state;
  }
};
