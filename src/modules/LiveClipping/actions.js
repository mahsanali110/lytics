import { REQUEST, SUCCESS, FAILURE, action, createRequestTypes } from '../common/actions';
export const ADD_LIVECLIPPER_CHANNEL_WINDOW = 'ADD_LIVECLIPPER_CHANNEL_WINDOW';
export const REMOVE_LIVECLIPPER_CHANNEL_WINDOW = 'REMOVE_LIVECLIPPER_CHANNEL_WINDOW';
export const UPDATE_START_PROG = 'UPDATE_START_PROG';
export const CREATE_LIVE_JOB = createRequestTypes('CREATE_LIVE_JOB');
export const UPDATE_LIVE_JOB = createRequestTypes('UPDATE_LIVE_JOB');
export const UPDATE_PROG_DATE = 'UPDATE_PROG_DATE';
export const liveClippingActions = {
  addWindow: data => action(ADD_LIVECLIPPER_CHANNEL_WINDOW, { payload: data }),
  removeWindow: data => action(REMOVE_LIVECLIPPER_CHANNEL_WINDOW, { payload: data }),
  createJob: {
    request: data => action(CREATE_LIVE_JOB[REQUEST], { payload: data }),
    success: data => action(CREATE_LIVE_JOB[SUCCESS], { payload: data }),
    failure: data => action(CREATE_LIVE_JOB[FAILURE], { payload: data }),
  },

  updateJob: {
    request: data => action(UPDATE_LIVE_JOB[REQUEST], { payload: data }),
    success: data => action(UPDATE_LIVE_JOB[SUCCESS], { payload: data }),
    failure: data => action(UPDATE_LIVE_JOB[FAILURE], { payload: data }),
  },
  updateStartPro: data => action(UPDATE_START_PROG, { payload: data }),
  updateProgDate: data => action(UPDATE_PROG_DATE, { payload: data }),
};
