import { call, put, takeLatest } from 'redux-saga/effects';
import { message as antMessage } from 'antd';

import { REQUEST } from '../common/actions';
import analyticsApi from '../../services/analytics';
import analyticsActions, {
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

export function* handleGetMainThemeStats({ payload }) {
  try {
    const { data } = yield call(analyticsApi.getMainThemeStats, payload);

    yield put(analyticsActions.getMainThemeStats.success({ mainThemeStats: data }));
  } catch (error) {
    yield put(analyticsActions.getMainThemeStats.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleGetMainTopicStats({ payload }) {
  try {
    const { data } = yield call(analyticsApi.getMainTopicStats, payload);

    yield put(analyticsActions.getMainTopicStats.success({ mainTopicStats: data }));
  } catch (error) {
    yield put(analyticsActions.getMainTopicStats.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleGetSubThemeStats({ payload }) {
  try {
    const { data } = yield call(analyticsApi.getSubThemeStats, payload);
    yield put(analyticsActions.getSubThemeStats.success({ subThemeStats: data }));
  } catch (error) {
    yield put(analyticsActions.getSubThemeStats.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleGetSubTopicStats({ payload }) {
  try {
    const { data } = yield call(analyticsApi.getSubTopicStats, payload);
    yield put(analyticsActions.getSubTopicStats.success({ subTopicStats: data }));
  } catch (error) {
    yield put(analyticsActions.getSubTopicStats.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleGetStatePillarStats({ payload }) {
  try {
    const { data } = yield call(analyticsApi.getStatePillarStats, payload);
    yield put(analyticsActions.getStatePillarStats.success({ statePillarStats: data }));
  } catch (error) {
    yield put(analyticsActions.getStatePillarStats.failure(error));
    antMessage.error(error.message, 5);
  }
}
export function* handleAddAlramStats({ payload }) {
  try {
    const { data } = yield call(analyticsApi.addAlramStats, payload);
    yield put(analyticsActions.addAlaramStats.success({ wordCount: data }));
  } catch (error) {
    yield put(analyticsActions.addAlaramStats.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleAddSecondAlramStats({ payload }) {
  try {
    const { data } = yield call(analyticsApi.addAlramStats, payload);
    yield put(analyticsActions.addSecondAlramStats.success({ secondWordCount: data }));
  } catch (error) {
    yield put(analyticsActions.addSecondAlramStats.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleGuestStats({ payload }) {
  try {
    const { data } = yield call(analyticsApi.getGuestStats, payload);
    yield put(analyticsActions.getGuestReportStats.success({ guestCount: data }));
  } catch (error) {
    yield put(analyticsActions.getGuestReportStats.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleSecondGuestStats({ payload }) {
  try {
    const { data } = yield call(analyticsApi.getGuestStats, payload);
    yield put(analyticsActions.getSecondGuestReportStats.success({ secondGuestCount: data }));
  } catch (error) {
    yield put(analyticsActions.getSecondGuestReportStats.failure(error));
    antMessage.error(error.message, 5);
  }
}

export default function* analyticsWatcher() {
  yield takeLatest(GET_MAIN_THEME_STATS[REQUEST], handleGetMainThemeStats);
  yield takeLatest(GET_MAIN_TOPIC_STATS[REQUEST], handleGetMainTopicStats);
  yield takeLatest(GET_SUB_THEME_STATS[REQUEST], handleGetSubThemeStats);
  yield takeLatest(GET_SUB_TOPIC_STATS[REQUEST], handleGetSubTopicStats);
  yield takeLatest(GET_STATE_PILLAR_STATS[REQUEST], handleGetStatePillarStats);
  yield takeLatest(ADD_ALARM_STATS[REQUEST], handleAddAlramStats);
  yield takeLatest(ADD_SECOND_ALARM_STATS[REQUEST], handleAddSecondAlramStats);
  yield takeLatest(GET_GUEST_REPORT_STATS[REQUEST], handleGuestStats);
  yield takeLatest(GET_SECOND_GUEST_REPORT_STATS[REQUEST], handleSecondGuestStats);
}
