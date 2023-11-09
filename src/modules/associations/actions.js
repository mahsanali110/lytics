import { REQUEST, SUCCESS, FAILURE, createRequestTypes, action } from '../common/actions';

export const RESET_FORM_DETAILS = 'Associations/RESET_FORM_DETAILS';

export const GET_ASSOCIATIONS = createRequestTypes('Associations/GET_ASSOCIATIONS');
export const ADD_ASSOCIATION = createRequestTypes('Associations/ADD_ASSOCIATION');
export const GET_ASSOCIATION = createRequestTypes('Associations/GET_ASSOCIATION');
export const UPDATE_ASSOCIATION = createRequestTypes('Associations/UPDATE_ASSOCIATION');
export const DELETE_ASSOCIATION = createRequestTypes('Associations/DELETE_ASSOCIATION');

const associationsActions = {
  resetFormDetails: () => action(RESET_FORM_DETAILS),

  getAssociations: {
    request: data => action(GET_ASSOCIATIONS[REQUEST], { payload: data }),
    success: data => action(GET_ASSOCIATIONS[SUCCESS], { payload: data }),
    failure: error => action(GET_ASSOCIATIONS[FAILURE], { payload: error }),
  },

  addAssociation: {
    request: data => action(ADD_ASSOCIATION[REQUEST], { payload: data }),
    success: data => action(ADD_ASSOCIATION[SUCCESS], { payload: data }),
    failure: error => action(ADD_ASSOCIATION[FAILURE], { payload: error }),
  },

  getAssociation: {
    request: data => action(GET_ASSOCIATION[REQUEST], { payload: data }),
    success: data => action(GET_ASSOCIATION[SUCCESS], { payload: data }),
    failure: error => action(GET_ASSOCIATION[FAILURE], { payload: error }),
  },
  updateAssociation: {
    request: data => action(UPDATE_ASSOCIATION[REQUEST], { payload: data }),
    success: data => action(UPDATE_ASSOCIATION[SUCCESS], { payload: data }),
    failure: error => action(UPDATE_ASSOCIATION[FAILURE], { payload: error }),
  },

  deleteAssociation: {
    request: data => action(DELETE_ASSOCIATION[REQUEST], { payload: data }),
    success: data => action(DELETE_ASSOCIATION[SUCCESS], { payload: data }),
    failure: error => action(DELETE_ASSOCIATION[FAILURE], { payload: error }),
  },
};

export default associationsActions;
