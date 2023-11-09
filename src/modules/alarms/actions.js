import { REQUEST, SUCCESS, FAILURE, createRequestTypes, action } from '../common/actions';
export const RESET_FORM_DETAILS = 'Alarms/RESET_FORM_DETAILS';
export const GET_ALARMS = createRequestTypes('Alarms/GET_ALARMS');
export const GET_ALARM = createRequestTypes('Alarms/GET_ALARM');
export const ADD_ALARM = createRequestTypes('Alarms/ADD_ALARM');
export const UPDATE_ALARM = createRequestTypes('Alarms/UPDATE_ALARM');
export const DELETE_ALARM = createRequestTypes('Alarms/DELETE_ALARM');

 
const alarmActions = {
  resetFormDetails: () => action(RESET_FORM_DETAILS),

  getAlarms: {
    request: data => action(GET_ALARMS[REQUEST], { payload: data }),
    success: data => action(GET_ALARMS[SUCCESS], { payload: data }),
    failure: error => action(GET_ALARMS[FAILURE], { payload: error }),
  },

  addAlarm: {
    request: data => action(ADD_ALARM[REQUEST], { payload: data }),
    success: data => action(ADD_ALARM[SUCCESS], { payload: data }),
    failure: error => action(ADD_ALARM[FAILURE], { payload: error }),
  },

  getAlarm: {
    request: data => action(GET_ALARM[REQUEST], { payload: data }),
    success: data => action(GET_ALARM[SUCCESS], { payload: data }),
    failure: error => action(GET_ALARM[FAILURE], { payload: error }),
  },

  updateAlarm: {
    request: data => action(UPDATE_ALARM[REQUEST], { payload: data }),
    success: data => action(UPDATE_ALARM[SUCCESS], { payload: data }),
    failure: error => action(UPDATE_ALARM[FAILURE], { payload: error }),
  },

  deleteAlarm: {
    request: data => action(DELETE_ALARM[REQUEST], { payload: data }),
    success: data => action(DELETE_ALARM[SUCCESS], { payload: data }),
    failure: error => action(DELETE_ALARM[FAILURE], { payload: error }),
  },
};

export default alarmActions;