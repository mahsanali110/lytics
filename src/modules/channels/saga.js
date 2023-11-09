import { call, put, takeLatest } from 'redux-saga/effects';
import { message as antMessage } from 'antd';

import settingsActions from '../settings/actions';
import { REQUEST } from '../common/actions';
import channelsApi from '../../services/channels';
import channelsActions, {
  GET_CHANNELS,
  ADD_CHANNEL,
  GET_CHANNEL,
  UPDATE_CHANNEL,
  DELETE_CHANNEL,
} from './actions';

export function* handleGetChannels({ payload }) {
  try {
    const { data } = yield call(channelsApi.getChannels, payload);
    yield put(channelsActions.getChannels.success({ channels: data.results }));
  } catch (error) {
    yield put(channelsActions.getChannels.failure(error));
    // antMessage.error(error.message, 5);
  }
}
export function* handleAddChannel({ payload }) {
  try {
    const { data } = yield call(channelsApi.addChannel, payload);
    yield put(channelsActions.addChannel.success(data));
    yield put(settingsActions.setFormVisibility({ showForm: false, formType: 'ADD' }));
  } catch (error) {
    yield put(channelsActions.addChannel.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleGetChannel({ payload }) {
  try {
    const { data } = yield call(channelsApi.getChannel, payload);
    yield put(channelsActions.getChannel.success({ formDetails: data }));
    yield put(settingsActions.setFormVisibility({ showForm: true, formType: 'EDIT' }));
    window.scrollTo(0, 40);
  } catch (error) {
    yield put(channelsActions.getChannel.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleUpdateChannel({ payload }) {
  try {
    const { data } = yield call(channelsApi.updateChannel, payload);
    yield put(channelsActions.updateChannel.success({ channelId: payload.channelId, data }));
    yield put(settingsActions.setFormVisibility({ showForm: false, formType: 'ADD' }));
  } catch (error) {
    yield put(channelsActions.updateChannel.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleDeleteChannel({ payload }) {
  try {
    // yield call(channelsApi.deleteChannel, payload);
    // yield put(channelsActions.deleteChannel.success(payload));

    const data = yield call(channelsApi.deleteChannel, payload);
    if (data.data === false) {
      antMessage.warning("Channel cannot be deleted because it's been used by other services", 3);
      yield put(channelsActions.deleteChannel.success());
    } else {
      yield put(channelsActions.deleteChannel.success(payload));
    }
  } catch (error) {
    yield put(channelsActions.deleteChannel.failure(error));
    antMessage.error(error.message, 5);
  }
}

export default function* channelsWatcher() {
  yield takeLatest(GET_CHANNELS[REQUEST], handleGetChannels);
  yield takeLatest(ADD_CHANNEL[REQUEST], handleAddChannel);
  yield takeLatest(GET_CHANNEL[REQUEST], handleGetChannel);
  yield takeLatest(UPDATE_CHANNEL[REQUEST], handleUpdateChannel);
  yield takeLatest(DELETE_CHANNEL[REQUEST], handleDeleteChannel);
}
