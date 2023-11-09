import { REQUEST, SUCCESS, FAILURE, createRequestTypes, action } from '../common/actions';

export const RESET_FORM_DETAILS = 'Companies/RESET_FORM_DETAILS';

export const GET_COMPANIES = createRequestTypes('Companies/GET_COMPANIES');
export const ADD_COMPANY = createRequestTypes('Companies/ADD_COMPANY');
export const GET_COMPANY = createRequestTypes('Companies/GET_COMPANY');
export const UPDATE_COMPANY = createRequestTypes('Companies/UPDATE_COMPANY');
export const DELETE_COMPANY = createRequestTypes('Companies/DELETE_COMPANY');

const companyActions = {
  resetFormDetails: () => action(RESET_FORM_DETAILS),

  getCompanies: {
    request: data => action(GET_COMPANIES[REQUEST], { payload: data }),
    success: data => action(GET_COMPANIES[SUCCESS], { payload: data }),
    failure: error => action(GET_COMPANIES[FAILURE], { payload: error }),
  },
  addCompany: {
    request: data => action(ADD_COMPANY[REQUEST], { payload: data }),
    success: data => action(ADD_COMPANY[SUCCESS], { payload: data }),
    failure: error => action(ADD_COMPANY[FAILURE], { payload: error }),
  },

  getCompany: {
    request: data => action(GET_COMPANY[REQUEST], { payload: data }),
    success: data => action(GET_COMPANY[SUCCESS], { payload: data }),
    failure: error => action(GET_COMPANY[FAILURE], { payload: error }),
  },

  updateCompany: {
    request: data => action(UPDATE_COMPANY[REQUEST], { payload: data }),
    success: data => action(UPDATE_COMPANY[SUCCESS], { payload: data }),
    failure: error => action(UPDATE_COMPANY[FAILURE], { payload: error }),
  },

  deleteCompany: {
    request: data => action(DELETE_COMPANY[REQUEST], { payload: data }),
    success: data => action(DELETE_COMPANY[SUCCESS], { payload: data }),
    failure: error => action(DELETE_COMPANY[FAILURE], { payload: error }),
  },
};

export default companyActions;
