import { REQUEST, SUCCESS, FAILURE, createRequestTypes, action } from '../common/actions';

export const RESET_FORM_DETAILS = 'Channels/RESET_FORM_DETAILS';

export const GET_CHANNELS = createRequestTypes('Channels/GET_CHANNELS');
export const ADD_CHANNEL = createRequestTypes('Channels/ADD_CHANNEL');
export const GET_CHANNEL = createRequestTypes('Channels/GET_CHANNEL');
export const UPDATE_CHANNEL = createRequestTypes('Channels/UPDATE_CHANNEL');
export const DELETE_CHANNEL = createRequestTypes('Channels/DELETE_CHANNEL');

const channelsActions = {
  resetFormDetails: () => action(RESET_FORM_DETAILS),

  getChannels: {
    request: data => action(GET_CHANNELS[REQUEST], { payload: data }),
    success: data => action(GET_CHANNELS[SUCCESS], { payload: data }),
    failure: error => action(GET_CHANNELS[FAILURE], { payload: error }),
  },

  addChannel: {
    request: data => action(ADD_CHANNEL[REQUEST], { payload: data }),
    success: data => action(ADD_CHANNEL[SUCCESS], { payload: data }),
    failure: error => action(ADD_CHANNEL[FAILURE], { payload: error }),
  },

  getChannel: {
    request: data => action(GET_CHANNEL[REQUEST], { payload: data }),
    success: data => action(GET_CHANNEL[SUCCESS], { payload: data }),
    failure: error => action(GET_CHANNEL[FAILURE], { payload: error }),
  },
  updateChannel: {
    request: data => action(UPDATE_CHANNEL[REQUEST], { payload: data }),
    success: data => action(UPDATE_CHANNEL[SUCCESS], { payload: data }),
    failure: error => action(UPDATE_CHANNEL[FAILURE], { payload: error }),
  },

  deleteChannel: {
    request: data => action(DELETE_CHANNEL[REQUEST], { payload: data }),
    success: data => action(DELETE_CHANNEL[SUCCESS], { payload: data }),
    failure: error => action(DELETE_CHANNEL[FAILURE], { payload: error }),
  },
};

export default channelsActions;
