import { REQUEST, SUCCESS, FAILURE, action, createRequestTypes } from '../common/actions';
import { DEFAULT_GUEST, DEFAULT_THEME, DEFAULT_ADD_GUEST_ANALYSIS } from 'constants/options';
import { UPDATE_BY_FIELD } from 'modules/jobs/actions';

export const UPDATE_SEGMENT_TITLE = 'UPDATE_SEGMENT_TITLE';

export const UPDATE_MARKER = createRequestTypes('UPDATE_MARKER');
export const GET_MARKER_BY_ID = createRequestTypes('GET_MARKER_BY_ID');

export const ADD_GUEST = 'ADD_GUEST';
export const UPDATE_GUEST = 'UPDATE_GUEST';
export const REMOVE_GUEST = 'REMOVE_GUEST';

// Themes
export const ADD_THEME = 'ADD_THEME';
export const UPDATE_THEME = 'UPDATE_THEME';
export const REMOVE_THEME = 'REMOVE_THEME';

//Topics
export const CHANGE_SEGMENT_TOPIC1 = 'CHANGE_SEGMENT_TOPIC1';
export const CHANGE_SEGMENT_TOPIC2 = 'CHANGE_SEGMENT_TOPIC2';
export const CHANGE_SEGMENT_TOPIC3 = 'CHANGE_SEGMENT_TOPIC3';

//Hashtags
export const UPDATE_HASHTAG = 'UPDATE_HASHTAG';

// Segment Analysis
export const UPDATE_TREND = 'UPDATE_TREND';
export const UPDATE_ANCHOR = 'UPDATE_ANCHOR';
export const UPDATE_SUMMARY = 'UPDATE_SUMMARY';
export const UPDATE_ANALYSIS = 'UPDATE_ANALYSIS';
export const UPDATE_SEGMENT_FIELD = 'UPDATE_SEGMENT_FIELD';

// Guest Analysis
export const ADD_GUEST_ANALYSIS = 'ADD_GUEST_ANALYSIS';
export const REMOVE_GUEST_ANALYSIS = 'REMOVE_GUEST_ANALYSIS';
export const UPDATE_GUEST_ANALYSIS = 'UPDATE_GUEST_ANALYSIS';
export const UPDATE_GUEST_SENTIMENT = createRequestTypes('UPDATE_GUEST_SENTIMENT');
export const UPDATE_ANAYSIS_SENTIMENT = createRequestTypes('UPDATE_ANAYSIS_SENTIMENT');
export const UPDATE_ANCHOR_SENTIMENT = createRequestTypes('UPDATE_ANCHOR_SENTIMENT');
export const UPDATE_SUMMARY_SENTIMENT = createRequestTypes('UPDATE_SUMMARY_SENTIMENT');

// Update meta data
export const UPDATE_JOB_FIELD = 'UPDATE_JOB_FIELD';

export const markerEditActions = {
  getGuestSentiment: {
    request: data => action(UPDATE_GUEST_SENTIMENT[REQUEST], { payload: data }),
    success: data => action(UPDATE_GUEST_SENTIMENT[SUCCESS], { payload: data }),
    failure: error => action(UPDATE_GUEST_SENTIMENT[FAILURE], { payload: error }),
  },
  getAnalysisSentiment: {
    request: data => action(UPDATE_ANAYSIS_SENTIMENT[REQUEST], { payload: data }),
    success: data => action(UPDATE_ANAYSIS_SENTIMENT[SUCCESS], { payload: data }),
    failure: error => action(UPDATE_ANAYSIS_SENTIMENT[FAILURE], { payload: error }),
  },
  anchorSentiment: {
    request: data => action(UPDATE_ANCHOR_SENTIMENT[REQUEST], { payload: data }),
    success: data => action(UPDATE_ANCHOR_SENTIMENT[SUCCESS], { payload: data }),
    failure: error => action(UPDATE_ANCHOR_SENTIMENT[FAILURE], { payload: error }),
  },
  summarySentiment: {
    request: data => action(UPDATE_SUMMARY_SENTIMENT[REQUEST], { payload: data }),
    success: data => action(UPDATE_SUMMARY_SENTIMENT[SUCCESS], { payload: data }),
    failure: error => action(UPDATE_SUMMARY_SENTIMENT[FAILURE], { payload: error }),
  },
  addGuest: _ => action(ADD_GUEST, { payload: { ...DEFAULT_GUEST } }),
  updateGuest: data => action(UPDATE_GUEST, { payload: data }),
  removeGuest: data => action(REMOVE_GUEST, { payload: data }),

  updateSegmentTitle: payload => action(UPDATE_SEGMENT_TITLE, { payload }),

  // Theme
  addTheme: _ => action(ADD_THEME, { payload: { ...DEFAULT_THEME } }),
  updateTheme: data => action(UPDATE_THEME, { payload: data }),
  removeTheme: data => action(REMOVE_THEME, { payload: data }),

  // Segment Analysis
  updateTrend: data => action(UPDATE_TREND, { payload: data }),
  updateAnchor: data => action(UPDATE_ANCHOR, { payload: data }),
  updateSummary: data => action(UPDATE_SUMMARY, { payload: data }),
  updateAnalysis: data => action(UPDATE_ANALYSIS, { payload: data }),
  updateSegmentField: data => action(UPDATE_SEGMENT_FIELD, { payload: data }),

  // Guest Analysis
  addGuestAnalysis: index =>
    action(ADD_GUEST_ANALYSIS, { payload: { index, ...DEFAULT_ADD_GUEST_ANALYSIS } }),
  removeGuestAnalysis: data => action(REMOVE_GUEST_ANALYSIS, { payload: data }),
  updateGuestAnalysis: data => action(UPDATE_GUEST_ANALYSIS, { payload: data }),

  updateByField: payload => action(UPDATE_BY_FIELD, { payload }),

  // Async
  getDataById: {
    request: data => action(GET_MARKER_BY_ID.REQUEST, { payload: data }),
    success: data => action(GET_MARKER_BY_ID.SUCCESS, { payload: data }),
    failure: error => action(GET_MARKER_BY_ID.FAILURE, { payload: error }),
  },

  updateMarker: {
    request: data => action(UPDATE_MARKER.REQUEST, { payload: data }),
    success: data => action(UPDATE_MARKER.SUCCESS, { payload: data }),
    failure: error => action(UPDATE_MARKER.FAILURE, { payload: error }),
  },
  changeTopic1: data => action(CHANGE_SEGMENT_TOPIC1, { payload: data }),
  changeTopic2: data => action(CHANGE_SEGMENT_TOPIC2, { payload: data }),
  changeTopic3: data => action(CHANGE_SEGMENT_TOPIC3, { payload: data }),
  updateHashtags: data => action(UPDATE_HASHTAG, { payload: data }),
  updateJobField: data => action(UPDATE_JOB_FIELD, { payload: data }),
};
