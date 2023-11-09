import {
  FETCH_TV_ONLINE_JOBS,
  FETCH_PRINT_WEB_JOBS,
  FETCH_SOCIAL_JOBS,
  FETCH_TICKER_JOBS,
  UPDATE_JOB_ARRAY,
  RESET_NEWSBOARD_REDUCER,
} from './actions';

import { updateJobArray } from './utils';

const initialState = {
  tvOnline: {
    results: [],
    loading: false,
    singleJobLoading: false,
    job: {},
  },
  printWeb: {
    results: [],
    loading: false,
  },
  social: {
    results: [],
    loading: false,
  },
  ticker: {
    results: [],
    loading: false,
  },
};

const newsboardReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_TV_ONLINE_JOBS.REQUEST:
      return {
        ...state,
        tvOnline: {
          ...state.tvOnline,
          loading: true,
        },
      };

    case FETCH_TV_ONLINE_JOBS.SUCCESS:
      return {
        ...state,
        tvOnline: {
          ...state.tvOnline,
          ...payload,
          loading: false,
        },
      };

    case FETCH_TV_ONLINE_JOBS.FAILURE:
      return {
        ...state,
        tvOnline: {
          ...state.tvOnline,
          loading: false,
        },
      };

    case FETCH_PRINT_WEB_JOBS.REQUEST:
      return {
        ...state,
        printWeb: {
          ...state.printWeb,
          loading: true,
        },
      };

    case FETCH_PRINT_WEB_JOBS.SUCCESS:
      return {
        ...state,
        printWeb: {
          ...state.printWeb,
          ...payload,
          loading: false,
        },
      };

    case FETCH_PRINT_WEB_JOBS.FAILURE:
      return {
        ...state,
        printWeb: {
          ...state.printWeb,
          loading: false,
        },
      };

    case FETCH_SOCIAL_JOBS.REQUEST:
      return {
        ...state,
        social: {
          ...state.social,
          loading: true,
        },
      };

    case FETCH_SOCIAL_JOBS.SUCCESS:
      return {
        ...state,
        social: {
          ...state.social,
          ...payload,
          loading: false,
        },
      };

    case FETCH_SOCIAL_JOBS.FAILURE:
      return {
        ...state,
        social: {
          ...state.social,
          loading: false,
        },
      };

    case FETCH_TICKER_JOBS.REQUEST:
      return {
        ...state,
        ticker: {
          ...state.ticker,
          loading: true,
        },
      };

    case FETCH_TICKER_JOBS.SUCCESS:
      return {
        ...state,
        ticker: {
          ...state.ticker,
          ...payload,
          loading: false,
        },
      };

    case FETCH_TICKER_JOBS.FAILURE:
      return {
        ...state,
        ticker: {
          ...state.ticker,
          loading: false,
        },
      };

    case UPDATE_JOB_ARRAY:
      return updateJobArray(state, payload);

    case RESET_NEWSBOARD_REDUCER:
      return {
        ...initialState,
      };

    default:
      return {
        ...state,
      };
  }
};

export default newsboardReducer;
