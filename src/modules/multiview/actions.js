import { createRequestTypes, action } from '../common/actions';

export const ADD_CHANNEL_WINDOW = 'ADD_CHANNEL_WINDOW';
export const REMOVE_CHANNEL_WINDOW = 'REMOVE_CHANNEL_WINDOW';
export const ADD_CHANNEL_WINDOW_AWARENESS = 'ADD_CHANNEL_WINDOW_AWARENESS';
export const REMOVE_CHANNEL_WINDOW_AWARENESS = 'REMOVE_CHANNEL_WINDOW_AWARENESS';

export const GET_CHANNELS = createRequestTypes('GET_CHANNELS');
export const GET_ACTUS_URL = createRequestTypes('GET_ACTUS_URL');
export const UPDATE_ACTUS = 'UPDATE_BY_FIEALD';

export const channelActions = {
  addWindow: data => action(ADD_CHANNEL_WINDOW, { payload: data }),
  removeWindow: data => action(REMOVE_CHANNEL_WINDOW, { payload: data }),
  addWindowAwareness: data => action(ADD_CHANNEL_WINDOW_AWARENESS, { payload: data }),
  removeWindowAwareness: data => action(REMOVE_CHANNEL_WINDOW_AWARENESS, { payload: data }),
  getChannels: {
    request: data => action(GET_CHANNELS.REQUEST, { payload: data }),
    success: data => {
      return action(GET_CHANNELS.SUCCESS, { payload: data });
    },
    failure: error => {
      return action(GET_CHANNELS.FAILURE, { payload: error });
    },
  },
  getActusURL: {
    request: data => action(GET_ACTUS_URL.REQUEST, { payload: data }),
    success: data => action(GET_ACTUS_URL.SUCCESS, { payload: data }),
    failure: error => action(GET_ACTUS_URL.FAILURE, { payload: error }),
  },
  updateActus: payload => action(UPDATE_ACTUS, { payload }),
};
