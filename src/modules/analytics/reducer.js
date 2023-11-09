import {
  GET_MAIN_THEME_STATS,
  GET_MAIN_TOPIC_STATS,
  GET_SUB_THEME_STATS,
  GET_SUB_TOPIC_STATS,
  GET_STATE_PILLAR_STATS,
  ADD_ALARM_STATS,
  GET_GUEST_REPORT_STATS,
  GET_SECOND_GUEST_REPORT_STATS,
  ADD_SECOND_ALARM_STATS,
} from './actions';

const initialState = {
  mainThemeStats: [],
  mainTopicStats: [],
  subThemeStats: [],
  subTopicStats: [],
  statePillarStats: [],
  wordCount: [],
  guestCount: [],
  secondGuestCount: [],
  secondWordCount: [],
};

function analyticsReducer(state = initialState, { type, payload }) {
  switch (type) {
    case ADD_SECOND_ALARM_STATS.REQUEST:
    case GET_SECOND_GUEST_REPORT_STATS.REQUEST:
    case GET_GUEST_REPORT_STATS.REQUEST:
    case ADD_ALARM_STATS.REQUEST:
    case GET_MAIN_THEME_STATS.REQUEST:
    case GET_MAIN_TOPIC_STATS.REQUEST:
    case GET_SUB_THEME_STATS.REQUEST:
    case GET_SUB_TOPIC_STATS.REQUEST:
    case GET_STATE_PILLAR_STATS.REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
      };
    case ADD_SECOND_ALARM_STATS.SUCCESS:
    case GET_SECOND_GUEST_REPORT_STATS.SUCCESS:
    case GET_GUEST_REPORT_STATS.SUCCESS:
    case ADD_ALARM_STATS.SUCCESS:
    case GET_MAIN_THEME_STATS.SUCCESS:
    case GET_MAIN_TOPIC_STATS.SUCCESS:
    case GET_SUB_THEME_STATS.SUCCESS:
    case GET_SUB_TOPIC_STATS.SUCCESS:
    case GET_STATE_PILLAR_STATS.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        ...payload,
      };

    case ADD_SECOND_ALARM_STATS.FAILURE:
    case GET_SECOND_GUEST_REPORT_STATS.FAILURE:
    case GET_GUEST_REPORT_STATS.FAILURE:
    case ADD_ALARM_STATS.FAILURE:
    case GET_MAIN_THEME_STATS.FAILURE:
    case GET_SUB_THEME_STATS.FAILURE:
    case GET_SUB_TOPIC_STATS.FAILURE:
    case GET_STATE_PILLAR_STATS.FAILURE:
      return {
        ...state,
        loading: false,
        error: payload.message,
      };

    default:
      return state;
  }
}

export default analyticsReducer;
