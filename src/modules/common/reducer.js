import moment from 'moment';
import {
  SET_ERROR,
  FETCH_HOSTS,
  FETCH_THEMES,
  FETCH_GUESTS,
  FETCH_PROGRAM_NAMES,
  SET_VIDEO_CURRENT_TIME,
  SET_VIDEO_DURATION,
  FETCH_PROGRAM_TYPES,
  SEARCH_SETTINGS,
  CHANNEL_NAME,
  ADD_SEGMENT,
  SET_SEGMENT_DURATION,
  UPDATE_SEGMENT_TIME,
  UPDATE_SEGMENT_COLOR,
  DELETE_SEGMENT,
  RESET_SEGMENT,
  DELETE_ALL_SEGMENTS,
  VIDEO_DURATION,
  SET_ALL_LIVE,
  SET_FROM_TIME,
  SET_TO_TIME,
  SET_DATE,
  SET_BROADCAST_TYPE,
  SET_SOURCE,
  ADD_TICKER,
  ADD_SHOT,
  ADD_TICKER_SOURCE,
  ADD_SHOT_SOURCE,
  SET_SELECTION_WORDS,
  SET_TEXT_AND_SPEAKER,
  SET_SPEAKER,
  SHOW_CONFIRM,
  SHOW_PROGRAM_INFO,
  HIDE_CONFIRM,
  FETCH_TOPICS,
  CREATE_HASHTAG,
  FETCH_HASHTAGS,
  FETCH_TOP_HASHTAGS,
  UPDATE_BY_FIELD,
  BUTTON_TYPE,
} from './actions';
import { CLIPPER_SEGMENT_COLORS } from 'constants/options';
import { setSegmentTime, deleteAllSegments, convert } from './utils';
let toTime = moment();
let fromTime = moment().subtract(1, 'h').subtract(moment().minutes(), 'm');
const initialState = {
  guests: [],
  hosts: [],
  themes: [],
  topics: [],
  topicMap: {},
  hashTagOptions: [],
  topHashtags: [],
  programTypes: [],
  programNames: [],
  videoCurrentTime: undefined,
  videoDuration: 0,
  speaker: '',
  textPlusSpeakers: [],
  selectedText: '',
  searchText: '',
  channelName: '',
  show: false,
  showProgramInfo: false,
  text: '',
  segments: [
    {
      time: 0,
      color: CLIPPER_SEGMENT_COLORS[0],
      active: true,
      dragging: false,
    },
  ],
  count: 0,
  dateAll: moment(new Date()),
  toTimeAll: toTime,
  fromTimeAll: fromTime,
  broadcastAll: 'interval',
  jobIds: [],
  source: '',
  tickerArray: [],
  shotArray: [],
  qcButtonType:''
};

function commonReducer(state = initialState, { type, payload }) {
  switch (type) {
    case 'NAVS': {
      return {
        ...state,
        jobIds: payload,
      };
    }
    case SET_TO_TIME:
      return {
        ...state,
        toTimeAll: payload,
      };
    case SET_FROM_TIME:
      return {
        ...state,
        fromTimeAll: payload,
      };
    case SET_DATE:
      return {
        ...state,
        dateAll: payload,
      };
    case SET_BROADCAST_TYPE:
      return {
        ...state,
        broadcastAll: payload,
      };

    case SET_ALL_LIVE:
      return {
        ...state,
        count: payload,
      };

    case SET_SEGMENT_DURATION:
      return {
        ...state,
        segments: setSegmentTime(state.segments, payload),
      };
    case ADD_SEGMENT:
      return {
        ...state,
        segments: payload,
      };
    case UPDATE_SEGMENT_COLOR:
      return {
        ...state,
        segments: payload,
      };
    case UPDATE_SEGMENT_TIME:
      return {
        ...state,
        segments: payload,
      };
    case DELETE_SEGMENT:
      return {
        ...state,
        segments: payload,
      };
    case RESET_SEGMENT:
      return {
        ...state,
        segments: [
          {
            time: 0,
            color: CLIPPER_SEGMENT_COLORS[0],
            active: true,
            dragging: false,
          },
        ],
      };
    case DELETE_ALL_SEGMENTS:
      return {
        ...state,
        segments: deleteAllSegments(state.segments),
      };

    case CHANNEL_NAME:
      return {
        ...state,
        channelName: payload,
      };

    case SET_ERROR:
      return { ...state, error: payload };

    case FETCH_HOSTS.REQUEST:
      return { ...state, loading: true, ...payload, hostsError: false };
    case FETCH_THEMES.REQUEST:
      return { ...state, loading: true, ...payload, themeError: false };
    case FETCH_TOPICS.REQUEST:
      return { ...state, loading: true, ...payload, topicsError: false };
    case FETCH_HASHTAGS.REQUEST:
      return { ...state, loading: true, ...payload, hashtagsError: false };
    case FETCH_TOP_HASHTAGS.REQUEST:
      return { ...state, loading: true, ...payload, hashtagsError: false };
    case FETCH_GUESTS.REQUEST:
      return { ...state, loading: true, ...payload, guestsError: false };
    case FETCH_PROGRAM_NAMES.REQUEST:
      return { ...state, loading: true, ...payload, programNamesError: false };
    case FETCH_PROGRAM_TYPES.REQUEST:
      return { ...state, loading: true, ...payload, programTypesError: false };

    case FETCH_HOSTS.SUCCESS:
    case FETCH_THEMES.SUCCESS:
    case FETCH_GUESTS.SUCCESS:
    case FETCH_PROGRAM_NAMES.SUCCESS:
    case FETCH_PROGRAM_TYPES.SUCCESS:
      return { ...state, loading: false, ...payload };

    case FETCH_TOPICS.SUCCESS:
      const [topics, topicMap] = convert(payload.topics);
      return { ...state, loading: false, topics, topicMap };

    case FETCH_THEMES.FAILURE:
      return { ...state, loading: false, themeError: payload.message };
    case FETCH_TOPICS.FAILURE:
      return { ...state, loading: false, topicsError: payload.message };
    case FETCH_HASHTAGS.FAILURE:
      return { ...state, loading: false, hashtagsError: payload.message };
    case FETCH_TOP_HASHTAGS.FAILURE:
      return { ...state, loading: false, hashtagsError: payload.message };
    case FETCH_HOSTS.FAILURE:
      return { ...state, loading: false, hostsError: payload.message };
    case FETCH_GUESTS.FAILURE:
      return { ...state, loading: false, guestsError: payload.message };
    case FETCH_PROGRAM_NAMES.FAILURE:
      return { ...state, loading: false, programNamesError: payload.message };
    case FETCH_PROGRAM_TYPES.FAILURE:
      return { ...state, loading: false, programTypesError: payload.message };

    case SET_VIDEO_CURRENT_TIME:
      return { ...state, videoCurrentTime: payload };
    case SET_VIDEO_DURATION:
      return { ...state, videoDuration: payload };
    case SEARCH_SETTINGS:
      return {
        ...state,
        searchText: payload,
      };
    case VIDEO_DURATION: {
      return {
        ...state,
        exactVideoDuration: payload,
      };
    }
    case SET_SOURCE: {
      return {
        ...state,
        source: payload,
      };
    }

    case ADD_TICKER: {
      return {
        ...state,
        tickerArray: payload,
      };
    }
    case ADD_SHOT: {
      return {
        ...state,
        shotArray: payload,
      };
    }
    case ADD_TICKER_SOURCE: {
      const tempTickerArray = [...state.tickerArray];
      const tickerToUpdate = tempTickerArray.find(ticker => ticker.id === payload.id);
      tickerToUpdate.IMGsrc = [...payload.data];
      tickerToUpdate.tickerLength = tickerToUpdate.tickerLength + payload.sizeCtrl;
      const tickerArray = tempTickerArray.map(ticker =>
        ticker.id === payload.id ? tickerToUpdate : ticker
      );
      return { ...state, tickerArray };
    }
    case ADD_SHOT_SOURCE: {
      const tempShotArray = [...state.shotArray];
      const shotToUpdate = tempShotArray.find(shot => shot.id === payload.id);
      shotToUpdate.IMGsrc = [...payload.data];
      shotToUpdate.shotLength = shotToUpdate.shotLength + payload.sizeCtrl;
      const shotArray = tempShotArray.map(shot => (shot.id === payload.id ? shotToUpdate : shot));
      return { ...state, shotArray };
    }
    case SET_SPEAKER: {
      return {
        ...state,
        speaker: payload,
      };
    }
    case SET_SELECTION_WORDS:
      return {
        ...state,
        selectedText: payload,
      };
    case SET_TEXT_AND_SPEAKER:
      return {
        ...state,
        textPlusSpeakers: payload,
      };
    case SHOW_CONFIRM:
      return {
        ...state,
        show: true,
        text: payload.text,
      };
    case SHOW_PROGRAM_INFO:
      return {
        ...state,
        showProgramInfo: payload,
      };
    case HIDE_CONFIRM:
      return {
        ...state,
        show: false,
        text: '',
      };
    case CREATE_HASHTAG.SUCCESS:
      return {
        ...state,
        hashTagOptions: [...state.hashTagOptions, payload.hashtag],
      };

    case FETCH_HASHTAGS.SUCCESS:
      return {
        ...state,
        hashTagOptions: payload.hashtags,
      };
    case FETCH_TOP_HASHTAGS.SUCCESS:
      return { ...state, topHashtags: payload.topHashtags };
    case UPDATE_BY_FIELD:
      return {
        ...state,
        [payload.field]: payload.value,
      };
    case BUTTON_TYPE:
      return {
        ...state,
        qcButtonType: payload,
      };
    default:
      return state;
  }
}

export default commonReducer;
