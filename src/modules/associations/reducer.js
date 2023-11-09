import {
  RESET_FORM_DETAILS,
  GET_ASSOCIATIONS,
  ADD_ASSOCIATION,
  GET_ASSOCIATION,
  UPDATE_ASSOCIATION,
  DELETE_ASSOCIATION,
} from './actions';

const initialState = {
  associations: [],
  formDetails: {
    name: '',
    shortForm: '',
    slogan: '',
    logoPath: '',
  },
  loading: false,
  error: false,
};

function associationsReducer(state = initialState, { type, payload }) {
  switch (type) {
    case RESET_FORM_DETAILS:
      return { ...state, formDetails: initialState.formDetails };

    case GET_ASSOCIATIONS.REQUEST:
      return { ...state, loading: true, ...payload, associationError: false };
    case ADD_ASSOCIATION.REQUEST:
    case GET_ASSOCIATION.REQUEST:
    case UPDATE_ASSOCIATION.REQUEST:
    case DELETE_ASSOCIATION.REQUEST:
      return { ...state, loading: true, error: false };

    case GET_ASSOCIATIONS.SUCCESS:
    case GET_ASSOCIATION.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        ...payload,
      };

    case ADD_ASSOCIATION.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        associations: [payload, ...state.associations],
      };

    case UPDATE_ASSOCIATION.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        associations: [
          ...state.associations.map(association => {
            if (association.id === payload.associationId) return payload.data;
            else return association;
          }),
        ],
      };

    case DELETE_ASSOCIATION.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        associations: [...state.associations.filter(association => association.id !== payload)],
      };

    case GET_ASSOCIATIONS.FAILURE:
      return { ...state, loading: false, associationError: payload.message };
    case ADD_ASSOCIATION.FAILURE:
    case GET_ASSOCIATION.FAILURE:
    case UPDATE_ASSOCIATION.FAILURE:
    case DELETE_ASSOCIATION.FAILURE:
      return {
        ...state,
        loading: false,
        error: payload.message,
      };

    default:
      return state;
  }
}

export default associationsReducer;
