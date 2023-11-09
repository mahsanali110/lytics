import {
  ADD_CHANNEL_WINDOW,
  REMOVE_CHANNEL_WINDOW,
  ADD_CHANNEL_WINDOW_AWARENESS,
  REMOVE_CHANNEL_WINDOW_AWARENESS,
  GET_ACTUS_URL,
  UPDATE_ACTUS,
} from './actions';

const initialState = {
  selectedWindows: [],
  selectedWindowsAWARENESS: [],
  actus_webhost: '',
  actus_webhost_Url: {
    private: '',
    public: '',
  },
  loading: false,
  error: '',
};

const multiViewReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ADD_CHANNEL_WINDOW:
      return {
        ...state,
        selectedWindows: [...state.selectedWindows, payload],
      };

    case REMOVE_CHANNEL_WINDOW: {
      const channels = [...state.selectedWindows];
      channels.splice(payload.windowIndex, 1);
      return {
        ...state,
        selectedWindows: [...channels],
      };
    }
    case ADD_CHANNEL_WINDOW_AWARENESS:
      return {
        ...state,
        selectedWindowsAWARENESS: [...state.selectedWindowsAWARENESS, payload],
      };

    case REMOVE_CHANNEL_WINDOW_AWARENESS: {
      const channels = [...state.selectedWindowsAWARENESS];
      channels.splice(payload.windowIndex, 1);
      return {
        ...state,
        selectedWindowsAWARENESS: [...channels],
      };
    }
    case GET_ACTUS_URL.REQUEST:
      return { ...state, loading: true, errors: true };

    case GET_ACTUS_URL.SUCCESS:
      return {
        ...state,
        loading: false,
        actus_webhost: payload,
        errors: false,
      };

    case GET_ACTUS_URL.FAILURE:
      return { ...state, loading: false, error: payload.error, errors: true };

    case UPDATE_ACTUS:
      return {
        ...state,
        actus_webhost_Url: { ...state.actus_webhost_Url, [payload.field]: payload.value },
      };

    default:
      return state;
  }
};
export default multiViewReducer;
