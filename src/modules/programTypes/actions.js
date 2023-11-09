import { REQUEST, SUCCESS, FAILURE, createRequestTypes, action } from '../common/actions';

export const RESET_FORM_DETAILS = 'ProgramTypes/RESET_FORM_DETAILS';

export const GET_PROGRAM_TYPES = createRequestTypes('ProgramTypes/GET_PROGRAM_TYPES');
export const ADD_PROGRAM_TYPE = createRequestTypes('ProgramTypes/ADD_PROGRAM_TYPE');
export const GET_PROGRAM_TYPE = createRequestTypes('ProgramTypes/GET_PROGRAM_TYPE');
export const UPDATE_PROGRAM_TYPE = createRequestTypes('ProgramTypes/UPDATE_PROGRAM_TYPE');
export const DELETE_PROGRAM_TYPE = createRequestTypes('ProgramTypes/DELETE_PROGRAM_TYPE');

const programTypesActions = {
  resetFormDetails: () => action(RESET_FORM_DETAILS),

  getProgramTypes: {
    request: data => action(GET_PROGRAM_TYPES[REQUEST], { payload: data }),
    success: data => action(GET_PROGRAM_TYPES[SUCCESS], { payload: data }),
    failure: error => action(GET_PROGRAM_TYPES[FAILURE], { payload: error }),
  },

  addProgramType: {
    request: data => action(ADD_PROGRAM_TYPE[REQUEST], { payload: data }),
    success: data => action(ADD_PROGRAM_TYPE[SUCCESS], { payload: data }),
    failure: error => action(ADD_PROGRAM_TYPE[FAILURE], { payload: error }),
  },

  getProgramType: {
    request: data => action(GET_PROGRAM_TYPE[REQUEST], { payload: data }),
    success: data => action(GET_PROGRAM_TYPE[SUCCESS], { payload: data }),
    failure: error => action(GET_PROGRAM_TYPE[FAILURE], { payload: error }),
  },
  updateProgramType: {
    request: data => action(UPDATE_PROGRAM_TYPE[REQUEST], { payload: data }),
    success: data => action(UPDATE_PROGRAM_TYPE[SUCCESS], { payload: data }),
    failure: error => action(UPDATE_PROGRAM_TYPE[FAILURE], { payload: error }),
  },

  deleteProgramType: {
    request: data => action(DELETE_PROGRAM_TYPE[REQUEST], { payload: data }),
    success: data => action(DELETE_PROGRAM_TYPE[SUCCESS], { payload: data }),
    failure: error => action(DELETE_PROGRAM_TYPE[FAILURE], { payload: error }),
  },
};

export default programTypesActions;
