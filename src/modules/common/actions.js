import _ from 'lodash';

export const REQUEST = 'REQUEST';
export const SUCCESS = 'SUCCESS';
export const FAILURE = 'FAILURE';
export const SET_ERROR = 'SET_ERROR';
export const SET_LOADING = 'SET_LOADING';
export const SET_MESSAGE = 'SET_MESSAGE';
export const SET_VIDEO_CURRENT_TIME = 'SET_VIDEO_CURRENT_TIME';
export const SET_VIDEO_DURATION = 'SET_VIDEO_DURATION';
export const SEARCH_SETTINGS = 'SEARCH_SETTINGS';
export const CHANNEL_NAME = 'CHANNEL_NAME';
export const SET_SEGMENT_DURATION = 'SET_SEGMENT_DURATION';
export const ADD_SEGMENT = 'ADD_SEGMENT';
export const UPDATE_SEGMENT_TIME = 'UPDATE_SEGMENT';
export const DELETE_SEGMENT = 'DELETE_SEGMENT';
export const UPDATE_SEGMENT_COLOR = 'UPDATE_SEGMENT_COLOR';
export const RESET_SEGMENT = 'RESET_SEGMENT';
export const DELETE_ALL_SEGMENTS = 'DELETE_ALL_SEGMENTS';
export const VIDEO_DURATION = 'VIDEO_DURATION';
export const SET_ALL_LIVE = 'SET_ALL_LIVE';
export const SET_FROM_TIME = 'SET_FROM_TIME';
export const SET_TO_TIME = 'SET_TO_TIME';
export const SET_DATE = 'SET_DATE';
export const SET_BROADCAST_TYPE = 'SET_BROADCAST_TYPE';
export const SET_SOURCE = 'SET_SOURCE';

export const ADD_TICKER = 'ADD_TICKER';
export const ADD_SHOT = 'ADD_SHOT';
export const ADD_TICKER_SOURCE = 'ADD_TICKER_SOURCE';
export const ADD_SHOT_SOURCE = 'ADD_SHOT_SOURCE';

export const SET_SPEAKER = 'SET_SPEAKER';
export const SET_TEXT_AND_SPEAKER = 'SET_TEXT_AND_SPEAKER';
export const SET_SELECTION_WORDS = 'SET_SELECTION_WORDS';

export const SHOW_CONFIRM = 'SHOW_CONFIRM';
export const SHOW_PROGRAM_INFO = 'SHOW_PROGRAM_INFO';
export const HIDE_CONFIRM = 'HIDE_CONFIRM';
export const UPDATE_BY_FIELD = 'UPDATE_BY_FIELD';
export const BUTTON_TYPE = 'BUTTON_TYPE';

export const createRequestTypes = base => {
  const CONST = _.reduce(
    [REQUEST, SUCCESS, FAILURE],
    (acc, type) => {
      acc[type] = `${base}_${type}`;
      return acc;
    },
    {}
  );
  CONST.toString = () => base;
  return CONST;
};

export function action(type, payload = {}) {
  return { type, ...payload };
}

// Async actions
export const FETCH_HOSTS = createRequestTypes('FETCH_HOSTS');
export const FETCH_THEMES = createRequestTypes('FETCH_THEMES');
export const FETCH_TOPICS = createRequestTypes('FETCH_TOPICS');
export const FETCH_GUESTS = createRequestTypes('FETCH_GUESTS');
export const FETCH_PROGRAM_NAMES = createRequestTypes('FETCH_PROGRAM_NAMES');
export const FETCH_PROGRAM_TYPES = createRequestTypes('FETCH_PROGRAM_TYPES');
export const CREATE_HASHTAG = createRequestTypes('CREATE_HASHTAG');
export const FETCH_HASHTAGS = createRequestTypes('FETCH_HASHTAGS');
export const FETCH_TOP_HASHTAGS = createRequestTypes('FETCH_TOP_HASHTAGS');

const actions = {
  setMessage: (reducer, code, message) =>
    action(SET_MESSAGE, { payload: { reducer, code, message } }),
  setError: (reducer, code, error) => action(SET_ERROR, { payload: { reducer, code, error } }),
  setLoading: (reducer, code, status) =>
    action(SET_LOADING, { payload: { reducer, code, status } }),

  setVideoCurrentTime: payload => action(SET_VIDEO_CURRENT_TIME, { payload }),
  setVideoDuration: payload => action(SET_VIDEO_DURATION, { payload }),

  // Async
  fetchHosts: {
    request: data => action(FETCH_HOSTS.REQUEST, { payload: data }),
    success: data => action(FETCH_HOSTS.SUCCESS, { payload: data }),
    failure: error => action(FETCH_HOSTS.FAILURE, { payload: error }),
  },

  fetchThemes: {
    request: data => action(FETCH_THEMES.REQUEST, { payload: data }),
    success: data => action(FETCH_THEMES.SUCCESS, { payload: data }),
    failure: error => action(FETCH_THEMES.FAILURE, { payload: error }),
  },

  fetchTopics: {
    request: data => action(FETCH_TOPICS.REQUEST, { payload: data }),
    success: data => action(FETCH_TOPICS.SUCCESS, { payload: data }),
    failure: error => action(FETCH_TOPICS.FAILURE, { payload: error }),
  },

  fetchGuests: {
    request: data => action(FETCH_GUESTS.REQUEST, { payload: data }),
    success: data => action(FETCH_GUESTS.SUCCESS, { payload: data }),
    failure: error => action(FETCH_GUESTS.FAILURE, { payload: error }),
  },

  fetchProgramTypes: {
    request: data => action(FETCH_PROGRAM_TYPES.REQUEST, { payload: data }),
    success: data => action(FETCH_PROGRAM_TYPES.SUCCESS, { payload: data }),
    failure: error => action(FETCH_PROGRAM_TYPES.FAILURE, { payload: error }),
  },

  fetchProgramNames: {
    request: data => action(FETCH_PROGRAM_NAMES.REQUEST, { payload: data }),
    success: data => action(FETCH_PROGRAM_NAMES.SUCCESS, { payload: data }),
    failure: error => action(FETCH_PROGRAM_NAMES.FAILURE, { payload: error }),
  },
  createHashtag: {
    request: data => action(CREATE_HASHTAG.REQUEST, { payload: data }),
    success: data => action(CREATE_HASHTAG.SUCCESS, { payload: data }),
    failure: data => action(CREATE_HASHTAG.FAILURE, { payload: data }),
  },

  fetchHashtags: {
    request: data => action(FETCH_HASHTAGS.REQUEST, { payload: data }),
    success: data => action(FETCH_HASHTAGS.SUCCESS, { payload: data }),
    failure: data => action(FETCH_HASHTAGS.FAILURE, { payload: data }),
  },
  fetchTopHashtags: {
    request: data => action(FETCH_TOP_HASHTAGS.REQUEST, { payload: data }),
    success: data => action(FETCH_TOP_HASHTAGS.SUCCESS, { payload: data }),
    failure: data => action(FETCH_TOP_HASHTAGS.FAILURE, { payload: data }),
  },
};

export const commonActions = {
  addGuest: _ => action(ADD_GUEST, { payload: DEFAULT_GUEST }),
  updateGuest: data => action(UPDATE_GUEST, { payload: data }),
  removeGuest: data => action(REMOVE_GUEST, { payload: data }),
  addTicker: data => action(ADD_TICKER, { payload: data }),
  addShot: data => action(ADD_SHOT, { payload: data }),
  addTickerSource: payload => action(ADD_TICKER_SOURCE, { payload }),
  addShotSource: payload => action(ADD_SHOT_SOURCE, { payload }),
  showConfirm: payload => action(SHOW_CONFIRM, { payload }),
  showProgramInfo: payload => action(SHOW_PROGRAM_INFO, { payload }),
  updataByField: payload => action(UPDATE_BY_FIELD, { payload }),
  hideConfirm: () => action(HIDE_CONFIRM),
  buttonType: payload => action(BUTTON_TYPE, { payload }),
};

export default actions;
