import { REQUEST, SUCCESS, FAILURE, createRequestTypes, action } from '../common/actions';
export const GET_EXPORT_JOB = createRequestTypes('ContentExport/GET_EXPORT_JOB');
export const CREATE_EXPORT_JOB = createRequestTypes('ContentExport/CREATE_EXPORT_JOB');
export const UPDATE_EXPORT_JOB = createRequestTypes('ContentExport/UPDATE_EXPORT_JOB');
export const DELETE_EXPORT_JOB = createRequestTypes('ContentExport/DELETE_EXPORT_JOB');
export const GET_EXPORT_BY_ID = createRequestTypes('ContentExport/GET_EXPORT_BY_ID');
export const UPDATE_BY_FIELD = 'UPDATE_BY_FIEALD';
export const EXPORT_TO_DRIVE = createRequestTypes('EXPORT_TO_DRIVE');
const contentExportActions = {
  getExportJobs: {
    request: data => action(GET_EXPORT_JOB[REQUEST], { payload: data }),
    success: data => action(GET_EXPORT_JOB[SUCCESS], { payload: data }),
    failure: error => action(GET_EXPORT_JOB[FAILURE], { payload: error }),
  },

  createExportJob: {
    request: data => action(CREATE_EXPORT_JOB[REQUEST], { payload: data }),
    success: data => action(CREATE_EXPORT_JOB[SUCCESS], { payload: data }),
    failure: error => action(CREATE_EXPORT_JOB[FAILURE], { payload: error }),
  },

  updateExportJob: {
    request: data => action(UPDATE_EXPORT_JOB[REQUEST], { payload: data }),
    success: data => action(UPDATE_EXPORT_JOB[SUCCESS], { payload: data }),
    failure: error => action(UPDATE_EXPORT_JOB[FAILURE], { payload: error }),
  },

  getExportJobById: {
    request: data => action(GET_EXPORT_BY_ID[REQUEST], { payload: data }),
    success: data => action(GET_EXPORT_BY_ID[SUCCESS], { payload: data }),
    failure: error => action(GET_EXPORT_BY_ID[FAILURE], { payload: error }),
  },

  deleteExportJob: {
    request: data => action(DELETE_EXPORT_JOB[REQUEST], { payload: data }),
    success: data => action(DELETE_EXPORT_JOB[SUCCESS], { payload: data }),
    failure: error => action(DELETE_EXPORT_JOB[FAILURE], { payload: error }),
  },
  exportToDrive: {
    request: data => action(EXPORT_TO_DRIVE[REQUEST], { payload: data }),
    success: data => action(EXPORT_TO_DRIVE[SUCCESS], { payload: data }),
    failure: error => action(EXPORT_TO_DRIVE[FAILURE], { payload: error }),
  },
  updateByField: payload => action(UPDATE_BY_FIELD, { payload }),
};

export default contentExportActions;
