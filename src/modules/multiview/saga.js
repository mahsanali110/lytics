import { put, takeLatest, call } from 'redux-saga/effects';

import { GET_CHANNELS, channelActions, GET_ACTUS_URL } from './actions';
import multiViewApi from '../../services/multiView';

export function* handleGetChannelsData(action) {
  try {
    const { data } = yield call(multiViewApi.getChannels, action.payload);
    yield put(channelActions.getChannels.success(data));
  } catch (error) {
    yield put(channelActions.getChannels.failure(error));
  }
}
export function* handleGetActusURL() {
  try {
    const { data } = yield call(multiViewApi.getActusURL);
    yield put(channelActions.getActusURL.success(data));
  } catch (error) {
    yield put(channelActions.getActusURL.failure(error));
  }
}

export function* handleGetChannelsDataTakeLatest() {
  yield takeLatest(GET_CHANNELS.REQUEST, handleGetChannelsData);
  yield takeLatest(GET_ACTUS_URL.REQUEST, handleGetActusURL);
}
