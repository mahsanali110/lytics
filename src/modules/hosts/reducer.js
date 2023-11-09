import {
  RESET_FORM_DETAILS,
  GET_HOSTS,
  ADD_HOST,
  GET_HOST,
  UPDATE_HOST,
  DELETE_HOST,
} from './actions';

const initialState = {
  formDetails: {
    name: '',
    description: '',
    logoPath: null,
  },
  hosts: [],
  loading: false,
  error: false,
};

function hostsReducer(state = initialState, { type, payload }) {
  switch (type) {
    case RESET_FORM_DETAILS:
      return { ...state, formDetails: initialState.formDetails };

    case GET_HOSTS.REQUEST:
    case ADD_HOST.REQUEST:
    case GET_HOST.REQUEST:
    case UPDATE_HOST.REQUEST:
    case DELETE_HOST.REQUEST:
      return { ...state, loading: true, error: false, hostError: false };

    case GET_HOSTS.SUCCESS:
    case GET_HOST.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        ...payload,
      };

    case ADD_HOST.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        hosts: [payload, ...state.hosts],
      };

    case UPDATE_HOST.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        hosts: [
          ...state.hosts.map(host => {
            if (host.id === payload.hostId) return payload.data;
            else return host;
          }),
        ],
      };

    case DELETE_HOST.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        hosts: [...state.hosts.filter(host => host.id !== payload)],
      };

    case GET_HOSTS.FAILURE:
    case ADD_HOST.FAILURE:
    case GET_HOST.FAILURE:
    case UPDATE_HOST.FAILURE:
    case DELETE_HOST.FAILURE:
      return {
        ...state,
        loading: false,
        error: payload.message,
        hostError: payload.message,
      };

    default:
      return state;
  }
}

export default hostsReducer;
