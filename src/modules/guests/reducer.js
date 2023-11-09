import {
  RESET_FORM_DETAILS,
  GET_ASSOCIATIONS,
  GET_GUESTS,
  ADD_GUEST,
  GET_GUEST,
  UPDATE_GUEST,
  DELETE_GUEST,
} from './actions';

const initialState = {
  formDetails: {
    name: '',
  },
  guests: [],
  associations: [],
  logoPath: null,
  loading: false,
  error: false,
};

function guestsReducer(state = initialState, { type, payload }) {
  switch (type) {
    case RESET_FORM_DETAILS:
      return { ...state, formDetails: initialState.formDetails };

    case GET_ASSOCIATIONS.REQUEST:
    case GET_GUESTS.REQUEST:
    case ADD_GUEST.REQUEST:
    case GET_GUEST.REQUEST:
    case UPDATE_GUEST.REQUEST:
    case DELETE_GUEST.REQUEST:
      return { ...state, loading: true, error: false, guestError: false };

    case GET_ASSOCIATIONS.SUCCESS:
    case GET_GUESTS.SUCCESS:
    case GET_GUEST.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        ...payload,
      };

    case ADD_GUEST.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        guests: [payload, ...state.guests],
      };

    case UPDATE_GUEST.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        guests: [
          ...state.guests.map(guest => {
            if (guest.id === payload.guestId) return payload.data;
            else return guest;
          }),
        ],
      };

    case DELETE_GUEST.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        guests: [...state.guests.filter(guest => guest.id !== payload)],
      };

    case GET_ASSOCIATIONS.FAILURE:
    case GET_GUESTS.FAILURE:
    case ADD_GUEST.FAILURE:
    case GET_GUEST.FAILURE:
    case UPDATE_GUEST.FAILURE:
    case DELETE_GUEST.FAILURE:
      return {
        ...state,
        loading: false,
        error: payload.message,
        guestError: payload.message,
      };

    default:
      return state;
  }
}

export default guestsReducer;
