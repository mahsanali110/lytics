import { GET_TALKSHOW_REPORT } from './action';

const initialState = {
  report: [],
  loading: false,
  error: false,
};

function reportReducer(state = initialState, { type, payload }) {
  switch (type) {
    case GET_TALKSHOW_REPORT.REQUEST:
      return { ...state, loading: true, error: false };

    case GET_TALKSHOW_REPORT.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        ...payload,
      };

    case GET_TALKSHOW_REPORT.FAILURE:
      return {
        ...state,
        loading: false,
        error: payload.message,
      };

    default:
      return state;
  }
}

export default reportReducer;
