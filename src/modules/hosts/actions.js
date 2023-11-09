import { REQUEST, SUCCESS, FAILURE, createRequestTypes, action } from '../common/actions';

export const RESET_FORM_DETAILS = 'Hosts/RESET_FORM_DETAILS';

export const GET_HOSTS = createRequestTypes('Hosts/GET_HOSTS');
export const ADD_HOST = createRequestTypes('Hosts/ADD_HOST');
export const GET_HOST = createRequestTypes('Hosts/GET_HOST');
export const UPDATE_HOST = createRequestTypes('Hosts/UPDATE_HOST');
export const DELETE_HOST = createRequestTypes('Hosts/DELETE_HOST');

const hostsActions = {
  resetFormDetails: () => action(RESET_FORM_DETAILS),

  getHosts: {
    request: data => action(GET_HOSTS[REQUEST], { payload: data }),
    success: data => action(GET_HOSTS[SUCCESS], { payload: data }),
    failure: error => action(GET_HOSTS[FAILURE], { payload: error }),
  },

  addHost: {
    request: data => action(ADD_HOST[REQUEST], { payload: data }),
    success: data => action(ADD_HOST[SUCCESS], { payload: data }),
    failure: error => action(ADD_HOST[FAILURE], { payload: error }),
  },

  getHost: {
    request: data => action(GET_HOST[REQUEST], { payload: data }),
    success: data => action(GET_HOST[SUCCESS], { payload: data }),
    failure: error => action(GET_HOST[FAILURE], { payload: error }),
  },
  updateHost: {
    request: data => action(UPDATE_HOST[REQUEST], { payload: data }),
    success: data => action(UPDATE_HOST[SUCCESS], { payload: data }),
    failure: error => action(UPDATE_HOST[FAILURE], { payload: error }),
  },

  deleteHost: {
    request: data => action(DELETE_HOST[REQUEST], { payload: data }),
    success: data => action(DELETE_HOST[SUCCESS], { payload: data }),
    failure: error => action(DELETE_HOST[FAILURE], { payload: error }),
  },
};

export default hostsActions;
