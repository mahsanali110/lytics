import { REQUEST, SUCCESS, FAILURE, createRequestTypes, action } from '../common/actions';

export const RESET_FORM_DETAILS = 'Users/RESET_FORM_DETAILS';

export const GET_ROLES = createRequestTypes('Users/GET_ROLES');
export const GET_CHANNELS = createRequestTypes('Users/GET_CHANNELS');
export const GET_USERS = createRequestTypes('Users/GET_USERS');
export const SEARCH_USERS = createRequestTypes('Users/GET_USERS');
export const ADD_USER = createRequestTypes('Users/ADD_USER');
export const GET_USER = createRequestTypes('Users/GET_USER');
export const UPDATE_USER = createRequestTypes('Users/UPDATE_USER');
export const DELETE_USER = createRequestTypes('Users/DELETE_USER');

const usersActions = {
  resetFormDetails: () => action(RESET_FORM_DETAILS),

  getRoles: {
    request: data => action(GET_ROLES[REQUEST], { payload: data }),
    success: data => action(GET_ROLES[SUCCESS], { payload: data }),
    failure: error => action(GET_ROLES[FAILURE], { payload: error }),
  },

  getChannels: {
    request: data => action(GET_CHANNELS[REQUEST], { payload: data }),
    success: data => action(GET_CHANNELS[SUCCESS], { payload: data }),
    failure: error => action(GET_CHANNELS[FAILURE], { payload: error }),
  },

  getUsers: {
    request: data => action(GET_USERS[REQUEST], { payload: data }),
    success: data => action(GET_USERS[SUCCESS], { payload: data }),
    failure: error => action(GET_USERS[FAILURE], { payload: error }),
  },
  addUser: {
    request: data => action(ADD_USER[REQUEST], { payload: data }),
    success: data => action(ADD_USER[SUCCESS], { payload: data }),
    failure: error => action(ADD_USER[FAILURE], { payload: error }),
  },

  getUser: {
    request: data => action(GET_USER[REQUEST], { payload: data }),
    success: data => action(GET_USER[SUCCESS], { payload: data }),
    failure: error => action(GET_USER[FAILURE], { payload: error }),
  },
  updateUser: {
    request: data => action(UPDATE_USER[REQUEST], { payload: data }),
    success: data => action(UPDATE_USER[SUCCESS], { payload: data }),
    failure: error => action(UPDATE_USER[FAILURE], { payload: error }),
  },

  deleteUser: {
    request: data => action(DELETE_USER[REQUEST], { payload: data }),
    success: data => action(DELETE_USER[SUCCESS], { payload: data }),
    failure: error => action(DELETE_USER[FAILURE], { payload: error }),
  },
};

export default usersActions;
