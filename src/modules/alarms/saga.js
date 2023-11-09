import { call, put, takeLatest } from 'redux-saga/effects';
import { message as antMessage } from 'antd';
import settingsActions from '../settings/actions';
import { REQUEST } from '../common/actions';
import alarmsApi from '../../services/alarms';
import alarmActions, {
  GET_ALARMS,
  ADD_ALARM,
  GET_ALARM,
  UPDATE_ALARM,
  DELETE_ALARM,
} from './actions';
 


export function* handleGetAlarms({ payload }) {
  try {
    const { data } = yield call(alarmsApi.getAlarms, payload);
    yield put(alarmActions.getAlarms.success({ alarms: data.results }));
  } catch (error) {
    yield put(alarmActions.getAlarms.failure(error));
    // antMessage.error(error.message, 5);
  }
}

export function* handleAddAlarm({ payload }) {

  try { 
    const { data } = yield call(alarmsApi.addAlarm, payload);
    yield put(alarmActions.addAlarm.success({ formDetails: data }));
    yield put(settingsActions.setFormVisibility({ showForm: false, formType: 'ADD' }));
  } catch (error) {
    yield put(alarmActions.addAlarm.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleGetAlarm({ payload }) {
  try {
    const { data } = yield call(alarmsApi.getAlarm, payload);
    yield put(alarmActions.getAlarm.success({ formDetails: data }));
    yield put(settingsActions.setFormVisibility({ showForm: true, formType: 'EDIT' }));
    window.scrollTo(0, 40);
  } catch (error) {
    yield put(alarmActions.getAlarm.failure(error));
    antMessage.error(error.message, 5);
  }
}


export function* handleUpdateAlarm({ payload }) {
  try {
    const { data } = yield call(alarmsApi.updateAlarm, payload);
    yield put(alarmActions.updateAlarm.success({ alarmId: payload.alarmId, data }));
    yield put(settingsActions.setFormVisibility({ showForm: false, formType: 'ADD' }));
  } catch (error) {
    yield put(alarmActions.updateAlarm.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleDeleteAlarm({ payload }) {
  try {
    yield call(alarmsApi.deleteAlarm, payload);
    yield put(alarmActions.deleteAlarm.success(payload));
  } catch (error) {
    yield put(alarmActions.deleteAlarm.failure(error));
    antMessage.error(error.message, 5);
  }
}

export default function* alarmsWatcher() {
  yield takeLatest(GET_ALARMS[REQUEST], handleGetAlarms);
  yield takeLatest(ADD_ALARM[REQUEST], handleAddAlarm);
  yield takeLatest(GET_ALARM[REQUEST], handleGetAlarm);
  yield takeLatest(UPDATE_ALARM[REQUEST], handleUpdateAlarm);
  yield takeLatest(DELETE_ALARM[REQUEST], handleDeleteAlarm);
}



