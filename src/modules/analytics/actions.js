import { REQUEST, SUCCESS, FAILURE, createRequestTypes, action } from '../common/actions';

export const GET_MAIN_THEME_STATS = createRequestTypes('GET_MAIN_THEME_STATS');
export const GET_MAIN_TOPIC_STATS = createRequestTypes('GET_MAIN_TOPIC_STATS');
export const GET_SUB_THEME_STATS = createRequestTypes('GET_SUB_THEME_STATS');
export const GET_SUB_TOPIC_STATS = createRequestTypes('GET_SUB_TOPIC_STATS');
export const GET_STATE_PILLAR_STATS = createRequestTypes('GET_STATE_PILLAR_STATS');
export const ADD_ALARM_STATS = createRequestTypes('ADD_ALARM_STATS');
export const ADD_SECOND_ALARM_STATS = createRequestTypes('ADD_SECOND_ALARM_STATS');
export const GET_GUEST_REPORT_STATS = createRequestTypes('GET_GUEST_REPORT_STATS');
export const GET_SECOND_GUEST_REPORT_STATS = createRequestTypes('GET_SECOND_GUEST_REPORT_STATS');

const analyticsActions = {
  getMainThemeStats: {
    request: data => action(GET_MAIN_THEME_STATS.REQUEST, { payload: data }),
    success: data => action(GET_MAIN_THEME_STATS.SUCCESS, { payload: data }),
    failure: error => action(GET_MAIN_THEME_STATS.FAILURE, { payload: error }),
  },

  getMainTopicStats: {
    request: data => action(GET_MAIN_TOPIC_STATS.REQUEST, { payload: data }),
    success: data => action(GET_MAIN_TOPIC_STATS.SUCCESS, { payload: data }),
    failure: error => action(GET_MAIN_TOPIC_STATS.FAILURE, { payload: error }),
  },

  getSubThemeStats: {
    request: data => action(GET_SUB_THEME_STATS.REQUEST, { payload: data }),
    success: data => action(GET_SUB_THEME_STATS.SUCCESS, { payload: data }),
    failure: error => action(GET_SUB_THEME_STATS.FAILURE, { payload: error }),
  },

  getSubTopicStats: {
    request: data => action(GET_SUB_TOPIC_STATS.REQUEST, { payload: data }),
    success: data => action(GET_SUB_TOPIC_STATS.SUCCESS, { payload: data }),
    failure: error => action(GET_SUB_TOPIC_STATS.FAILURE, { payload: error }),
  },

  getStatePillarStats: {
    request: data => action(GET_STATE_PILLAR_STATS.REQUEST, { payload: data }),
    success: data => action(GET_STATE_PILLAR_STATS.SUCCESS, { payload: data }),
    failure: error => action(GET_STATE_PILLAR_STATS.FAILURE, { payload: error }),
  },
  addAlaramStats: {
    request: data => action(ADD_ALARM_STATS.REQUEST, { payload: data }),
    success: data => action(ADD_ALARM_STATS.SUCCESS, { payload: data }),
    failure: error => action(ADD_ALARM_STATS.FAILURE, { payload: error }),
  },
  addSecondAlramStats: {
    request: data => action(ADD_SECOND_ALARM_STATS.REQUEST, { payload: data }),
    success: data => action(ADD_SECOND_ALARM_STATS.SUCCESS, { payload: data }),
    failure: error => action(ADD_SECOND_ALARM_STATS.FAILURE, { payload: error }),
  },

  getGuestReportStats: {
    request: data => action(GET_GUEST_REPORT_STATS.REQUEST, { payload: data }),
    success: data => action(GET_GUEST_REPORT_STATS.SUCCESS, { payload: data }),
    failure: error => action(GET_GUEST_REPORT_STATS.FAILURE, { payload: error }),
  },
  getSecondGuestReportStats: {
    request: data => action(GET_SECOND_GUEST_REPORT_STATS.REQUEST, { payload: data }),
    success: data => action(GET_SECOND_GUEST_REPORT_STATS.SUCCESS, { payload: data }),
    failure: error => action(GET_SECOND_GUEST_REPORT_STATS.FAILURE, { payload: error }),
  },
};

export default analyticsActions;
