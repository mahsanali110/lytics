import {
  RESET_FORM_DETAILS,
  GET_CHANNELS,
  GET_PROGRAM_TYPES,
  GET_PROGRAM_NAMES,
  ADD_PROGRAM_NAME,
  GET_PROGRAM_NAME,
  UPDATE_PROGRAM_NAME,
  DELETE_PROGRAM_NAME,
} from './actions';

const initialState = {
  formDetails: {
    title: '',
    description: '',
    host: [],
    fromTime: null,
    toTime: null,
  },
  programNames: [],
  channels: [],
  programTypes: [],
  loading: false,
  error: false,
};

function programNamesReducer(state = initialState, { type, payload }) {
  switch (type) {
    case RESET_FORM_DETAILS:
      return { ...state, formDetails: initialState.formDetails };

    case GET_CHANNELS.REQUEST:
      return { ...state, loading: true, ...payload, channelsError: false };
    case GET_PROGRAM_TYPES.REQUEST:
      return { ...state, loading: true, ...payload, programTypesError: false };
    case GET_PROGRAM_NAMES.REQUEST:
      return { ...state, loading: true, ...payload, programNamesError: false };
    case ADD_PROGRAM_NAME.REQUEST:
    case GET_PROGRAM_NAME.REQUEST:
    case UPDATE_PROGRAM_NAME.REQUEST:
    case DELETE_PROGRAM_NAME.REQUEST:
      return { ...state, loading: true, programNameError: false };

    case GET_CHANNELS.SUCCESS:
    case GET_PROGRAM_TYPES.SUCCESS:
    case GET_PROGRAM_NAMES.SUCCESS:
    case GET_PROGRAM_NAME.SUCCESS:
      console.log({ payload });
      return {
        ...state,
        loading: false,
        error: false,
        ...payload,
      };

    case ADD_PROGRAM_NAME.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        programNames: [payload, ...state.programNames],
      };

    case UPDATE_PROGRAM_NAME.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        programNames: [
          ...state.programNames.map(programName => {
            if (programName.id === payload.programNameId) return payload.data;
            else return programName;
          }),
        ],
      };

    case DELETE_PROGRAM_NAME.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        programNames: [...state.programNames.filter(programName => programName.id !== payload)],
      };

    case GET_CHANNELS.FAILURE:
      return { ...state, loading: false, channelsError: payload.message };
    case GET_PROGRAM_TYPES.FAILURE:
      return { ...state, loading: false, programTypesError: payload.message };
    case GET_PROGRAM_NAMES.FAILURE:
      return { ...state, loading: false, programNamesError: payload.message };
    case ADD_PROGRAM_NAME.FAILURE:
    case GET_PROGRAM_NAME.FAILURE:
    case UPDATE_PROGRAM_NAME.FAILURE:
    case DELETE_PROGRAM_NAME.FAILURE:
      return {
        ...state,
        loading: false,
        error: payload.message,
        programNameError: payload.message,
      };

    default:
      return state;
  }
}

export default programNamesReducer;
