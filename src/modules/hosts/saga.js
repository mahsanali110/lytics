import { call, put, take, takeLatest } from 'redux-saga/effects';
import { message as antMessage } from 'antd';

import settingsActions from '../settings/actions';
import { REQUEST } from '../common/actions';
import hostsApi from '../../services/hosts';
import hostsActions, { GET_HOSTS, ADD_HOST, GET_HOST, UPDATE_HOST, DELETE_HOST } from './actions';

export function* handleGetHosts({ payload }) {
  try {
    const {
      data: { results, ...pagination },
    } = yield call(hostsApi.getHosts, payload);
    yield put(hostsActions.getHosts.success({ hosts: results, pagination }));
  } catch (error) {
    yield put(hostsActions.getHosts.failure(error));
    // antMessage.error(error.message, 5);
  }
}
export function* handleAddHost({ payload }) {
  try {
    const { data } = yield call(hostsApi.addHost, payload);
    yield put(hostsActions.addHost.success(data));
    yield put(settingsActions.setFormVisibility({ showForm: false, formType: 'ADD' }));
  } catch (error) {
    yield put(hostsActions.addHost.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleGetHost({ payload }) {
  try {
    const { data } = yield call(hostsApi.getHost, payload);
    yield put(hostsActions.getHost.success({ formDetails: data }));
    yield put(settingsActions.setFormVisibility({ showForm: true, formType: 'EDIT' }));
    window.scrollTo(0, 40);
  } catch (error) {
    yield put(hostsActions.getHost.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleUpdateHost({ payload }) {
  try {
    const { data } = yield call(hostsApi.updateHost, payload);
    yield put(hostsActions.updateHost.success({ hostId: payload.hostId, data }));
    yield put(settingsActions.setFormVisibility({ showForm: false, formType: 'ADD' }));
  } catch (error) {
    yield put(hostsActions.updateHost.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleDeleteHost({ payload }) {
  try {
    // yield call(hostsApi.deleteHost, payload);
    // yield put(hostsActions.deleteHost.success(payload));
    const data = yield call(hostsApi.deleteHost, payload);
    if (data.data === false) {
      antMessage.warning("Host cannot be deleted because it's been used by other services", 3);
      yield put(hostsActions.deleteHost.success());
    } else {
      yield put(hostsActions.deleteHost.success(payload));
    }
  } catch (error) {
    yield put(hostsActions.deleteHost.failure(error));
    antMessage.error(error.message, 5);
  }
}

export default function* hostsWatcher() {
  yield takeLatest(GET_HOSTS[REQUEST], handleGetHosts);
  yield takeLatest(ADD_HOST[REQUEST], handleAddHost);
  yield takeLatest(GET_HOST[REQUEST], handleGetHost);
  yield takeLatest(UPDATE_HOST[REQUEST], handleUpdateHost);
  yield takeLatest(DELETE_HOST[REQUEST], handleDeleteHost);
}
