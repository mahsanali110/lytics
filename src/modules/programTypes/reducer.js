import {
  RESET_FORM_DETAILS,
  GET_PROGRAM_TYPES,
  ADD_PROGRAM_TYPE,
  GET_PROGRAM_TYPE,
  UPDATE_PROGRAM_TYPE,
  DELETE_PROGRAM_TYPE,
} from './actions';

const initialState = {
  programTypes: [],
  limit: 10,
  page: 1,
  totalPages: 1,
  totalResults: 0,
  formDetails: {
    name: '',
    description: '',
    source: '',
  },
  loading: false,
  error: false,
};

function programTypesReducer(state = initialState, { type, payload }) {
  switch (type) {
    case RESET_FORM_DETAILS:
      return { ...state, formDetails: initialState.formDetails };

    case GET_PROGRAM_TYPES.REQUEST:
      return { ...state, loading: true, ...payload, programTypesError: false };
    case ADD_PROGRAM_TYPE.REQUEST:
    case GET_PROGRAM_TYPE.REQUEST:
    case UPDATE_PROGRAM_TYPE.REQUEST:
    case DELETE_PROGRAM_TYPE.REQUEST:
      return { ...state, loading: true, error: false, programTypeError: false };

    case GET_PROGRAM_TYPES.SUCCESS:
    case GET_PROGRAM_TYPE.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        ...payload,
      };

    case ADD_PROGRAM_TYPE.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        programTypes: [payload, ...state.programTypes],
      };

    case UPDATE_PROGRAM_TYPE.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        programTypes: [
          ...state.programTypes.map(programType => {
            if (programType.id === payload.programTypeId) return payload.data;
            else return programType;
          }),
        ],
      };

    case DELETE_PROGRAM_TYPE.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        programTypes: [...state.programTypes.filter(programType => programType.id !== payload)],
      };

    case GET_PROGRAM_TYPES.FAILURE:
      return { ...state, loading: false, programTypesError: payload.message };
    case ADD_PROGRAM_TYPE.FAILURE:
    case GET_PROGRAM_TYPE.FAILURE:
    case UPDATE_PROGRAM_TYPE.FAILURE:
    case DELETE_PROGRAM_TYPE.FAILURE:
      return {
        ...state,
        loading: false,
        error: payload.message,
        programTypeError: payload.message,
      };

    default:
      return state;
  }
}

export default programTypesReducer;
