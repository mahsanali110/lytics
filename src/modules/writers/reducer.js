import {
  RESET_FORM_DETAILS,
  GET_WRITERS,
  ADD_WRITER,
  GET_WRITER,
  UPDATE_WRITER,
  DELETE_WRITER,
} from './actions';

const initialState = {
  formDetails: {
    name: '',
    description: '',
    logoPath: null,
  },
  writers: [],
  loading: false,
  error: false,
};

function writersReducer(state = initialState, { type, payload }) {
  switch (type) {
    case RESET_FORM_DETAILS:
      return { ...state, formDetails: initialState.formDetails };

    case GET_WRITERS.REQUEST:
    case ADD_WRITER.REQUEST:
    case GET_WRITER.REQUEST:
    case UPDATE_WRITER.REQUEST:
    case DELETE_WRITER.REQUEST:
      return { ...state, loading: true, error: false, writerError: false };

    case GET_WRITERS.SUCCESS:
    case GET_WRITER.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        ...payload,
      };

    case ADD_WRITER.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        writers: [payload, ...state.writers],
      };

    case UPDATE_WRITER.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        writers: [
          ...state.writers.map(writer => {
            if (writer.id === payload.writerId) return payload.data;
            else return writer;
          }),
        ],
      };

    case DELETE_WRITER.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        writers: [...state.writers.filter(writer => writer.id !== payload)],
      };

    case GET_WRITERS.FAILURE:
    case ADD_WRITER.FAILURE:
    case GET_WRITER.FAILURE:
    case UPDATE_WRITER.FAILURE:
    case DELETE_WRITER.FAILURE:
      return {
        ...state,
        loading: false,
        error: payload.message,
        writerError: payload.message,
      };

    default:
      return state;
  }
}

export default writersReducer;
