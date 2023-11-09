import {
  RESET_FORM_DETAILS,
  GET_CHANNELS,
  ADD_CHANNEL,
  GET_CHANNEL,
  UPDATE_CHANNEL,
  DELETE_CHANNEL,
} from './actions';

const initialState = {
  channels: [],
  formDetails: {
    name: '',
    actusId: '',
    description: '',
    language: '',
    region: '',
    logoPath: null,
    tickerSize: '',
  },
  loading: false,
  error: false,
};

function channelsReducer(state = initialState, { type, payload }) {
  switch (type) {
    case RESET_FORM_DETAILS:
      return { ...state, formDetails: initialState.formDetails };

    case GET_CHANNELS.REQUEST:
      return { ...state, loading: true, ...payload, channelsError: false };
    case ADD_CHANNEL.REQUEST:
    case GET_CHANNEL.REQUEST:
    case UPDATE_CHANNEL.REQUEST:
    case DELETE_CHANNEL.REQUEST:
      return { ...state, loading: true, error: false };

    case GET_CHANNELS.SUCCESS:
    case GET_CHANNEL.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        ...payload,
      };

    case ADD_CHANNEL.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        channels: [payload, ...state.channels],
      };

    case UPDATE_CHANNEL.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        channels: [
          ...state.channels.map(channel => {
            if (channel.id === payload.channelId) return payload.data;
            else return channel;
          }),
        ],
      };

    case DELETE_CHANNEL.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        channels: [...state.channels.filter(channel => channel.id !== payload)],
      };

    case GET_CHANNELS.FAILURE:
      return { ...state, loading: false, channelsError: payload.message };
    case ADD_CHANNEL.FAILURE:
    case GET_CHANNEL.FAILURE:
    case UPDATE_CHANNEL.FAILURE:
    case DELETE_CHANNEL.FAILURE:
      return {
        ...state,
        loading: false,
        error: payload.message,
      };

    default:
      return state;
  }
}

export default channelsReducer;
