import { REQUEST, SUCCESS, FAILURE, createRequestTypes, action } from '../common/actions';

export const RESET_FORM_DETAILS = 'Groups/RESET_FORM_DETAILS';

export const GET_GROUPS = createRequestTypes('Groups/GET_GROUPS');
export const ADD_GROUP = createRequestTypes('Groups/ADD_GROUP');
export const GET_GROUP = createRequestTypes('Groups/GET_GROUP');
export const UPDATE_GROUP = createRequestTypes('Groups/UPDATE_GROUP');
export const DELETE_GROUP = createRequestTypes('Groups/DELETE_GROUP');

const groupsActions = {
  resetFormDetails: () => action(RESET_FORM_DETAILS),

  getGroups: {
    request: data => action(GET_GROUPS[REQUEST], { payload: data }),
    success: data => action(GET_GROUPS[SUCCESS], { payload: data }),
    failure: error => action(GET_GROUPS[FAILURE], { payload: error }),
  },
  addGroup: {
    request: data => action(ADD_GROUP[REQUEST], { payload: data }),
    success: data => action(ADD_GROUP[SUCCESS], { payload: data }),
    failure: error => action(ADD_GROUP[FAILURE], { payload: error }),
  },

  getGroup: {
    request: data => action(GET_GROUP[REQUEST], { payload: data }),
    success: data => action(GET_GROUP[SUCCESS], { payload: data }),
    failure: error => action(GET_GROUP[FAILURE], { payload: error }),
  },

  updateGroup: {
    request: data => action(UPDATE_GROUP[REQUEST], { payload: data }),
    success: data => action(UPDATE_GROUP[SUCCESS], { payload: data }),
    failure: error => action(UPDATE_GROUP[FAILURE], { payload: error }),
  },

  deleteGroup: {
    request: data => action(DELETE_GROUP[REQUEST], { payload: data }),
    success: data => action(DELETE_GROUP[SUCCESS], { payload: data }),
    failure: error => action(DELETE_GROUP[FAILURE], { payload: error }),
  },
};

export default groupsActions;
