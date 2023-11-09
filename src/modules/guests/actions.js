import { REQUEST, SUCCESS, FAILURE, createRequestTypes, action } from '../common/actions';

export const RESET_FORM_DETAILS = 'Guests/RESET_FORM_DETAILS';

export const GET_ASSOCIATIONS = createRequestTypes('Guests/GET_ASSOCIATIONS');
export const GET_GUESTS = createRequestTypes('Guests/GET_GUESTS');
export const ADD_GUEST = createRequestTypes('Guests/ADD_GUEST');
export const GET_GUEST = createRequestTypes('Guests/GET_GUEST');
export const UPDATE_GUEST = createRequestTypes('Guests/UPDATE_GUEST');
export const DELETE_GUEST = createRequestTypes('Guests/DELETE_GUEST');

const guestsActions = {
  resetFormDetails: () => action(RESET_FORM_DETAILS),

  getAssociations: {
    request: data => action(GET_ASSOCIATIONS[REQUEST], { payload: data }),
    success: data => action(GET_ASSOCIATIONS[SUCCESS], { payload: data }),
    failure: error => action(GET_ASSOCIATIONS[FAILURE], { payload: error }),
  },

  getGuests: {
    request: data => action(GET_GUESTS[REQUEST], { payload: data }),
    success: data => action(GET_GUESTS[SUCCESS], { payload: data }),
    failure: error => action(GET_GUESTS[FAILURE], { payload: error }),
  },
  addGuest: {
    request: data => action(ADD_GUEST[REQUEST], { payload: data }),
    success: data => action(ADD_GUEST[SUCCESS], { payload: data }),
    failure: error => action(ADD_GUEST[FAILURE], { payload: error }),
  },

  getGuest: {
    request: data => action(GET_GUEST[REQUEST], { payload: data }),
    success: data => action(GET_GUEST[SUCCESS], { payload: data }),
    failure: error => action(GET_GUEST[FAILURE], { payload: error }),
  },

  updateGuest: {
    request: data => action(UPDATE_GUEST[REQUEST], { payload: data }),
    success: data => action(UPDATE_GUEST[SUCCESS], { payload: data }),
    failure: error => action(UPDATE_GUEST[FAILURE], { payload: error }),
  },

  deleteGuest: {
    request: data => action(DELETE_GUEST[REQUEST], { payload: data }),
    success: data => action(DELETE_GUEST[SUCCESS], { payload: data }),
    failure: error => action(DELETE_GUEST[FAILURE], { payload: error }),
  },
};

export default guestsActions;
