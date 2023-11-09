import {
  CREATE_LIBRARY_JOB,
  FETCH_LIBRARY_JOBS_COMPANY,
  FETCH_LIBRARY_JOBS_PERSONAL,
  GET_JOB_BY_ID_LIBRARY,
  SHARE_JOB,
  YOUTUBE_POST,
} from './actions';

import { GET_JOB_BY_ID } from '../jobs/actions';

const initialState = {
  company: {
    results: [],
  },
  personal: {
    results: [],
  },
  searchText: '',
  loading: false,
  jobCreationLoading: false,
  jobSharingLoading: false,
  singleJobLoading: false,
  youtubePostLoading: false,
  job: {
    translation: [],
    transcription: [],
  },
  errors: '',
  wordCount: 0,
  dateRange: null,
  importVideos: [],
};

function libraryJobsReducer(state = initialState, { type, payload }) {
  switch (type) {
    case CREATE_LIBRARY_JOB.REQUEST:
      return {
        ...state,
        jobCreationLoading: payload.loading === undefined ? true : payload.loading,
      };

    case GET_JOB_BY_ID_LIBRARY.REQUEST:
    case GET_JOB_BY_ID.REQUEST:
      return {
        ...state,
        singleJobLoading: payload.loading === undefined ? true : payload.loading,
      };

    case SHARE_JOB.REQUEST:
      return {
        ...state,
        jobSharingLoading: payload.loading === undefined ? true : payload.loading,
      };

    case YOUTUBE_POST.REQUEST:
      return {
        ...state,
        youtubePostLoading: payload.loading === undefined ? true : payload.loading,
      };

    case CREATE_LIBRARY_JOB.SUCCESS:
      return {
        ...state,
        jobCreationLoading: false,
      };

    case GET_JOB_BY_ID_LIBRARY.SUCCESS:
    case GET_JOB_BY_ID.SUCCESS:
      return {
        ...state,
        singleJobLoading: false,
      };

    case SHARE_JOB.SUCCESS:
      return {
        ...state,
        jobSharingLoading: false,
      };

    case YOUTUBE_POST.SUCCESS:
      return {
        ...state,
        youtubePostLoading: false,
      };

    case FETCH_LIBRARY_JOBS_COMPANY.REQUEST:
    case FETCH_LIBRARY_JOBS_PERSONAL.REQUEST:
      if (payload?.loading == false) return { ...state, loading: false, errors: true };
      else return { ...state, loading: true, errors: true };

    case FETCH_LIBRARY_JOBS_COMPANY.SUCCESS:
      return {
        ...state,
        loading: false,
        company: { ...payload },
        errors: false,
      };

    case FETCH_LIBRARY_JOBS_PERSONAL.SUCCESS:
      return {
        ...state,
        loading: false,
        personal: { ...payload },
        errors: false,
      };

    case FETCH_LIBRARY_JOBS_COMPANY.FAILURE:
    case FETCH_LIBRARY_JOBS_PERSONAL.FAILURE:
      return {
        ...state,
        loading: false,
      };

    case GET_JOB_BY_ID_LIBRARY.FAILURE:
    case GET_JOB_BY_ID.FAILURE:
      return {
        ...state,
        singleJobLoading: false,
      };

    case CREATE_LIBRARY_JOB.FAILURE:
      return {
        ...state,
        jobCreationLoading: false,
      };

    case SHARE_JOB.FAILURE:
      return {
        ...state,
        jobSharingLoading: false,
      };

    case YOUTUBE_POST.FAILURE:
      return {
        ...state,
        youtubePostLoading: false,
      };
    default:
      return state;
  }
}

export default libraryJobsReducer;
