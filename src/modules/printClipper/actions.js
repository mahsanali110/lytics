import { REQUEST, SUCCESS, FAILURE, createRequestTypes, action } from '../common/actions';

export const RESET_FORM_DETAILS = 'ProgramNames/RESET_FORM_DETAILS';
export const CREATE_JOB = createRequestTypes(' CREATE_JOB');

const printClipperActions = {
  resetFormDetails: () => action(RESET_FORM_DETAILS),
  createJob: {
    request: data => action(CREATE_JOB[REQUEST], { payload: data }),
    success: data => action(CREATE_JOB[SUCCESS], { payload: data }),
    failure: error => action(CREATE_JOB[FAILURE], { payload: error }),
  },
};

export default printClipperActions;
