import { REQUEST, SUCCESS, FAILURE, createRequestTypes, action } from '../common/actions';

export const RESET_FORM_DETAILS = 'ProgramNames/RESET_FORM_DETAILS';

export const GET_CHANNELS = createRequestTypes('ProgramNames/GET_CHANNELS');
export const GET_PROGRAM_TYPES = createRequestTypes('ProgramNames/GET_PROGRAM_TYPES');
export const GET_PROGRAM_NAMES = createRequestTypes('ProgramNames/GET_PROGRAM_NAMES');
export const ADD_PROGRAM_NAME = createRequestTypes('ProgramNames/ADD_PROGRAM_NAME');
export const GET_PROGRAM_NAME = createRequestTypes('ProgramNames/GET_PROGRAM_NAME');
export const UPDATE_PROGRAM_NAME = createRequestTypes('ProgramNames/UPDATE_PROGRAM_NAME');
export const DELETE_PROGRAM_NAME = createRequestTypes('ProgramNames/DELETE_PROGRAM_NAME');

const programNamesActions = {
  resetFormDetails: () => action(RESET_FORM_DETAILS),

  getChannels: {
    request: data => action(GET_CHANNELS[REQUEST], { payload: data }),
    success: data => action(GET_CHANNELS[SUCCESS], { payload: data }),
    failure: error => action(GET_CHANNELS[FAILURE], { payload: error }),
  },

  getProgramTypes: {
    request: data => action(GET_PROGRAM_TYPES[REQUEST], { payload: data }),
    success: data => action(GET_PROGRAM_TYPES[SUCCESS], { payload: data }),
    failure: error => action(GET_PROGRAM_TYPES[FAILURE], { payload: error }),
  },

  getProgramNames: {
    request: data => action(GET_PROGRAM_NAMES[REQUEST], { payload: data }),
    success: data => action(GET_PROGRAM_NAMES[SUCCESS], { payload: data }),
    failure: error => action(GET_PROGRAM_NAMES[FAILURE], { payload: error }),
  },
  addProgramName: {
    request: data => action(ADD_PROGRAM_NAME[REQUEST], { payload: data }),
    success: data => action(ADD_PROGRAM_NAME[SUCCESS], { payload: data }),
    failure: error => action(ADD_PROGRAM_NAME[FAILURE], { payload: error }),
  },

  getProgramName: {
    request: data => action(GET_PROGRAM_NAME[REQUEST], { payload: data }),
    success: data => action(GET_PROGRAM_NAME[SUCCESS], { payload: data }),
    failure: error => action(GET_PROGRAM_NAME[FAILURE], { payload: error }),
  },

  updateProgramName: {
    request: data => action(UPDATE_PROGRAM_NAME[REQUEST], { payload: data }),
    success: data => action(UPDATE_PROGRAM_NAME[SUCCESS], { payload: data }),
    failure: error => action(UPDATE_PROGRAM_NAME[FAILURE], { payload: error }),
  },

  deleteProgramName: {
    request: data => action(DELETE_PROGRAM_NAME[REQUEST], { payload: data }),
    success: data => action(DELETE_PROGRAM_NAME[SUCCESS], { payload: data }),
    failure: error => action(DELETE_PROGRAM_NAME[FAILURE], { payload: error }),
  },
};

export default programNamesActions;
