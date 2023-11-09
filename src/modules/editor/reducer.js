import {
  SET_PROGRAM_DATA,
  UPDATE_BY_FIELD,
  EXPORT_VIDEO,
  CHECK_VIDEO_STATUS,
  RESET_EDITOR_REDUCER,
  RESET_CLIP_DATA,
  RESET_SCREEN_DATA,
  RESET_TICKER_DATA,
  SET_SCREEN_DATA,
  SET_TICKER_DATA,
} from './actions.js';
import { YOUTUBE_POST, CREATE_LIBRARY_JOB } from '../libraryJobs/actions';
import { updateStateField } from './utils';

const srcMap = {
  Tv: 'clipData',
  Online: 'clipData',
  ScreenShot: 'screenData',
  Ticker: 'tickerData',
};

const resetFields = {
  clipTitle: '',
  programDescription: '',
  isCompanyLibrary: false,
  isPersonalLibrary: false,
};

const initialState = {
  saveVisible: false,
  clipData: {
    clipTitle: '',
    programDescription: '',
    isCompanyLibrary: false,
    isPersonalLibrary: false,
    isJobCreated: false,
  },
  screenData: {
    clipTitle: '',
    programDescription: '',
    isCompanyLibrary: false,
    isPersonalLibrary: false,
  },
  downloadScreen: false,
  tickerData: {
    clipTitle: '',
    programDescription: '',
    isCompanyLibrary: false,
    isPersonalLibrary: false,
  },
  downloadTicker: false,
  exportVideo: {},
  exportLoading: false,
  actusVideoId: null,
  videoCurrentStatus: null,
  clipProcessFields: {
    save: false,
    download: false,
    facebook: false,
    youtube: false,
    twitter: false,
    instagram: false,
    whatsapp: false,
    lens: false,
  },
  tickerProcessFields: {
    save: false,
    download: false,
    facebook: false,
    youtube: false,
    twitter: false,
    instagram: false,
    whatsapp: false,
    lens: false,
  },
  screenProcessFields: {
    save: false,
    download: false,
    facebook: false,
    youtube: false,
    twitter: false,
    instagram: false,
    whatsapp: false,
    lens: false,
  },
  activeTab: '0',
  shareToLens: false,
  youtubeData: {
    title: '',
    playList: '',
    tags: [],
    fileList: [],
    caption: '',
  },
};

function editorReducer(state = initialState, { type, payload }) {
  switch (type) {
    case SET_PROGRAM_DATA:
      return {
        ...state,
        clipData: { ...state.clipData, ...payload },
      };

    case SET_SCREEN_DATA:
      return {
        ...state,
        screenData: { ...state.screenData, ...payload },
      };
    case SET_TICKER_DATA:
      return {
        ...state,
        tickerData: { ...state.tickerData, ...payload },
      };
    case RESET_CLIP_DATA:
      return {
        ...state,
        clipData: { ...initialState.clipData },
        videoCurrentStatus: 'Converting 0%',
        clipProcessFields: { ...initialState.clipProcessFields },
      };

    case RESET_SCREEN_DATA:
      return {
        ...state,
        screenData: { ...initialState.screenData },
        screenProcessFields: { ...initialState.screenProcessFields },
      };

    case RESET_TICKER_DATA:
      return {
        ...state,
        tickerData: { ...initialState.tickerData },
        tickerProcessFields: { ...initialState.tickerProcessFields },
      };

    case RESET_EDITOR_REDUCER:
      return {
        ...initialState,
      };

    case UPDATE_BY_FIELD:
      return {
        ...state,
        ...updateStateField(state, { ...payload }, initialState),
      };

    case EXPORT_VIDEO.SUCCESS:
      return {
        ...state,
        exportVideo: { ...payload },
        actusVideoId: payload.actusVideoId,
      };

    case CHECK_VIDEO_STATUS.SUCCESS:
      let videoPath = `${payload.actusBaseUrl}${payload.videoPath}`;
      return {
        ...state,
        exportVideo: {
          ...payload,
          actusVideoId: state.exportVideo.actusVideoId,
          videoPath,
        },
        videoCurrentStatus: payload.videoCurrentStatus,
      };

    case YOUTUBE_POST.SUCCESS:
      return {
        ...state,
        youtubeData: { ...initialState.youtubeData },
      };

    case CREATE_LIBRARY_JOB.SUCCESS:
      console.log({ payload });
      const nestedField = srcMap[payload.data.source];
      console.log({ nestedField });
      return {
        ...state,
        [nestedField]: {
          ...state[nestedField],
          ...resetFields,
        },
      };
    default:
      return state;
  }
}

export default editorReducer;
