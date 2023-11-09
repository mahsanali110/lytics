import { createRequestTypes, action } from '../common/actions';

export const SET_PROGRAM_DATA = 'SET_PROGRAM_DATA';
export const SET_SCREEN_DATA = 'SET_SCREEN_DATA';
export const SET_TICKER_DATA = 'SET_TICKER_DATA';
export const UPDATE_BY_FIELD = 'UPDATE_BY_FIELD';
export const RESET_EDITOR_REDUCER = 'RESET_EDITOR_REDUCER';
export const RESET_CLIP_DATA = 'RESET_CLIP_DATA';
export const RESET_SCREEN_DATA = 'RESET_SCREEN_DATA';
export const RESET_TICKER_DATA = 'RESET_TICKER_DATA';
export const EXPORT_VIDEO = createRequestTypes('EXPORT_VIDEO');
export const CHECK_VIDEO_STATUS = createRequestTypes('CHECK_VIDEO_STATUS');

const editorActions = {
  setProgramData: payload => action(SET_PROGRAM_DATA, { payload }),
  setScreenData: payload => action(SET_SCREEN_DATA, { payload }),
  setTickerData: payload => action(SET_TICKER_DATA, { payload }),
  updateByField: payload => action(UPDATE_BY_FIELD, { payload }),
  resetReducer: payload => action(RESET_EDITOR_REDUCER, { payload }),
  resetClipData: payload => action(RESET_CLIP_DATA, { payload }),
  resetScreenData: payload => action(RESET_SCREEN_DATA, { payload }),
  resetTickerData: payload => action(RESET_TICKER_DATA, { payload }),
  exportVideo: {
    request: payload => action(EXPORT_VIDEO.REQUEST, { payload }),
    success: payload => action(EXPORT_VIDEO.SUCCESS, { payload }),
    failure: payload => action(EXPORT_VIDEO.FAILURE, { payload }),
  },

  checkVideoStatus: {
    request: payload => action(CHECK_VIDEO_STATUS.REQUEST, { payload }),
    success: payload => action(CHECK_VIDEO_STATUS.SUCCESS, { payload }),
    failure: payload => action(CHECK_VIDEO_STATUS.FAILURE, { payload }),
  },
};

export default editorActions;
