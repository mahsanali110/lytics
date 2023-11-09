import { call, put, takeLatest } from 'redux-saga/effects';
import { message as antMessage } from 'antd';
import {
  GET_FILTER_REQUEST,
  ADD_FILTER_REQUEST,
  UPDATE_FILTER_REQUEST,
  DELETE_FILTER_REQUEST,
} from './types';
import {
  SAVE_PRESET,
  GET_ALL_PRESET,
  GET_SINGLE_PRESET,
  UPDATE_PRESET,
  DELETE_PRESET,
} from './actions';
import { REQUEST } from '../common/actions';
import filterActions from './actions';
import filterApi from 'services/filter';
export function* getFilter({ payload }) {
  try {
    const { data } = yield call(filterApi.getFilter, payload);
    yield put(filterActions.getFilters.success(data));
  } catch (error) {
    yield put(filterActions.getFilters.failure(error));
  }
}
export function* addFilter({ payload }) {
  try {
    const data = yield call(filterApi.addFilter, payload);
    yield put(filterActions.addFilter.success(data));
  } catch (error) {
    yield put(filterActions.addFilter.failure(error));
  }
}
export function* updateFilter({ payload }) {
  try {
    const data = yield call(filterApi.updateFilter, payload);
    yield put(filterActions.updateFilter.success(data));
  } catch (error) {
    yield put(filterActions.updateFilter.failure(error));
  }
}
export function* deleteFilter({ payload }) {
  try {
    const data = yield call(filterApi.deleteFilter, payload);
    yield put(filterActions.deleteFilter.success(data));
  } catch (error) {
    yield put(filterActions.deleteFilter.failure(error));
  }
}
export function* handleSavePresetRequest(action) {
  try {
    const { data } = yield call(filterApi.savePreset, action.payload);
    yield put(filterActions.savePreset.success(data));
  } catch (error) {
    yield put(filterActions.savePreset.failure(error));
  }
}

export function* handleGetAllPresetRequest(action) {
  try {
    const { data } = yield call(filterApi.getAllPreset, action.payload);
    yield put(filterActions.getAllPreset.success(data));
  } catch (error) {
    yield put(filterActions.getAllPreset.failure(error));
  }
}

export function* handleGetSinglePresetRequest(action) {
  try {
    const { data } = yield call(filterApi.getSinglePreset, action.payload);
    yield put(filterActions.getSinglePreset.success(data));
  } catch (error) {
    yield put(filterActions.getSinglePreset.failure(error));
  }
}

export function* handleUpdatePresetRequest(action) {
  try {
    const { data } = yield call(filterApi.updatePreset, action.payload);
    yield put(filterActions.updatePreset.success(data));
  } catch (error) {
    yield put(filterActions.updatePreset.failure(error));
  }
}

export function* handleDeletePresetRequest(action) {
  try {
    const { data } = yield call(filterApi.deletePreset, action.payload);
    yield put(filterActions.deletePreset.success(data));
  } catch (error) {
    yield put(filterActions.deletePreset.failure(error));
  }
}

export default function* filterWrapper() {
  yield takeLatest(GET_FILTER_REQUEST, getFilter);
  yield takeLatest(ADD_FILTER_REQUEST, addFilter);
  yield takeLatest(UPDATE_FILTER_REQUEST, updateFilter);
  yield takeLatest(DELETE_FILTER_REQUEST, deleteFilter);
  yield takeLatest(SAVE_PRESET[REQUEST], handleSavePresetRequest);
  yield takeLatest(GET_ALL_PRESET[REQUEST], handleGetAllPresetRequest);
  yield takeLatest(GET_SINGLE_PRESET[REQUEST], handleGetSinglePresetRequest);
  yield takeLatest(UPDATE_PRESET[REQUEST], handleUpdatePresetRequest);
  yield takeLatest(DELETE_PRESET[REQUEST], handleDeletePresetRequest);
}
