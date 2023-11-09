import moment from 'moment';
import {
  ADD_LIVECLIPPER_CHANNEL_WINDOW,
  REMOVE_LIVECLIPPER_CHANNEL_WINDOW,
  CREATE_LIVE_JOB,
  UPDATE_START_PROG,
  UPDATE_PROG_DATE,
} from './actions';

const initialState = {
  selectedWindows: [],
  loading: false,
  segIndex: null,
  startPro: false,
  progDate: moment(),
};
const liveClippingReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ADD_LIVECLIPPER_CHANNEL_WINDOW:
      return {
        ...state,
        selectedWindows: [payload],
      };

    case REMOVE_LIVECLIPPER_CHANNEL_WINDOW: {
      const channels = [...state.selectedWindows];
      channels.splice(payload.windowIndex, 1);
      return {
        ...state,
        selectedWindows: [...channels],
      };
    }

    case CREATE_LIVE_JOB.REQUEST: {
      return {
        ...state,
        // segIndex: payload.jobIndex,
        loading: true,
      };
    }

    case CREATE_LIVE_JOB.SUCCESS: {
      return {
        ...state,
        // segIndex: null,
        loading: false,
      };
    }

    case CREATE_LIVE_JOB.FAILURE: {
      return {
        ...state,
        segIndex: null,
        loading: false,
      };
    }
    case UPDATE_START_PROG: {
      return {
        ...state,
        startPro: payload,
      };
    }
    case UPDATE_PROG_DATE: {
      return {
        ...state,
        progDate: payload,
      };
    }

    default:
      return state;
  }
};

export default liveClippingReducer;
