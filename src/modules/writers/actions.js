import { REQUEST, SUCCESS, FAILURE, createRequestTypes, action } from '../common/actions';

export const RESET_FORM_DETAILS = 'Writers/RESET_FORM_DETAILS';

export const GET_WRITERS = createRequestTypes('Writers/GET_WRITERS');
export const ADD_WRITER = createRequestTypes('Writers/ADD_WRITER');
export const GET_WRITER = createRequestTypes('Writers/GET_WRITER');
export const UPDATE_WRITER = createRequestTypes('Writers/UPDATE_WRITER');
export const DELETE_WRITER = createRequestTypes('Writers/DELETE_WRITER');

const writersActions = {
  resetFormDetails: () => action(RESET_FORM_DETAILS),

  getWriters: {
    request: data => action(GET_WRITERS[REQUEST], { payload: data }),
    success: data => action(GET_WRITERS[SUCCESS], { payload: data }),
    failure: error => action(GET_WRITERS[FAILURE], { payload: error }),
  },

  addWriter: {
    request: data => action(ADD_WRITER[REQUEST], { payload: data }),
    success: data => action(ADD_WRITER[SUCCESS], { payload: data }),
    failure: error => action(ADD_WRITER[FAILURE], { payload: error }),
  },

  getWriter: {
    request: data => action(GET_WRITER[REQUEST], { payload: data }),
    success: data => action(GET_WRITER[SUCCESS], { payload: data }),
    failure: error => action(GET_WRITER[FAILURE], { payload: error }),
  },
  updateWriter: {
    request: data => action(UPDATE_WRITER[REQUEST], { payload: data }),
    success: data => action(UPDATE_WRITER[SUCCESS], { payload: data }),
    failure: error => action(UPDATE_WRITER[FAILURE], { payload: error }),
  },

  deleteWriter: {
    request: data => action(DELETE_WRITER[REQUEST], { payload: data }),
    success: data => action(DELETE_WRITER[SUCCESS], { payload: data }),
    failure: error => action(DELETE_WRITER[FAILURE], { payload: error }),
  },
};

export default writersActions;
