import { call, put, takeLatest } from 'redux-saga/effects';
import { message as antMessage } from 'antd';

import Settings from '../settings/actions';
import { REQUEST } from '../common/actions';
import programNamesApi from '../../services/programNames';
import programNamesActions, {
  GET_CHANNELS,
  GET_PROGRAM_TYPES,
  GET_PROGRAM_NAMES,
  ADD_PROGRAM_NAME,
  GET_PROGRAM_NAME,
  UPDATE_PROGRAM_NAME,
  DELETE_PROGRAM_NAME,
} from './actions';

export function* handleGetChannels({ payload }) {
  try {
    const { data } = yield call(programNamesApi.getChannels, payload);
    yield put(programNamesActions.getChannels.success({ channels: data.results }));
  } catch (error) {
    yield put(programNamesActions.getChannels.failure(error));
    // antMessage.error(error.message, 5);
  }
}

export function* handleGetProgramTypes({ payload }) {
  try {
    const {
      data: { results, ...pagination },
    } = yield call(programNamesApi.getProgramTypes, payload);
    yield put(programNamesActions.getProgramTypes.success({ programTypes: results, pagination }));
  } catch (error) {
    yield put(programNamesActions.getProgramTypes.failure(error));
    // antMessage.error(error.message, 5);
  }
}

export function* handleGetProgramNames({ payload }) {
  try {
    const { data } = yield call(programNamesApi.getProgramNames, payload);
    yield put(programNamesActions.getProgramNames.success({ programNames: data.results }));
  } catch (error) {
    yield put(programNamesActions.getProgramNames.failure(error));
    // antMessage.error(error.message, 5);
  }
}
export function* handleAddProgramName({ payload }) {
  try {
    const { data } = yield call(programNamesApi.addProgramName, payload);
    yield put(programNamesActions.addProgramName.success(data));
    yield put(Settings.setFormVisibility({ showForm: false, formType: 'ADD' }));
  } catch (error) {
    yield put(programNamesActions.addProgramName.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleGetProgramName({ payload }) {
  try {
    const { data } = yield call(programNamesApi.getProgramName, payload);
    yield put(programNamesActions.getProgramName.success({ formDetails: data }));
    yield put(Settings.setFormVisibility({ showForm: true, formType: 'EDIT' }));
    window.scrollTo(0, 40);
  } catch (error) {
    yield put(programNamesActions.getProgramName.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleUpdateProgramName({ payload }) {
  try {
    const { data } = yield call(programNamesApi.updateProgramName, payload);
    yield put(
      programNamesActions.updateProgramName.success({ programNameId: payload.programNameId, data })
    );
    yield put(Settings.setFormVisibility({ showForm: false, formType: 'ADD' }));
  } catch (error) {
    yield put(programNamesActions.updateProgramName.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleDeleteProgramName({ payload }) {
  try {
    // yield call(programNamesApi.deleteProgramName, payload);
    // yield put(programNamesActions.deleteProgramName.success(payload));
    const data = yield call(programNamesApi.deleteProgramName, payload);
    if (data.data === false) {
      antMessage.warning("Program cannot be deleted because it's been used by other services", 3);
      yield put(programNamesActions.deleteProgramName.success());
    } else {
      yield put(programNamesActions.deleteProgramName.success(payload));
    }
  } catch (error) {
    yield put(programNamesActions.deleteProgramName.failure(error));
    antMessage.error(error.message, 5);
  }
}

export default function* programNamesWatcher() {
  yield takeLatest(GET_CHANNELS[REQUEST], handleGetChannels);
  yield takeLatest(GET_PROGRAM_TYPES[REQUEST], handleGetProgramTypes);
  yield takeLatest(GET_PROGRAM_NAMES[REQUEST], handleGetProgramNames);
  yield takeLatest(ADD_PROGRAM_NAME[REQUEST], handleAddProgramName);
  yield takeLatest(GET_PROGRAM_NAME[REQUEST], handleGetProgramName);
  yield takeLatest(UPDATE_PROGRAM_NAME[REQUEST], handleUpdateProgramName);
  yield takeLatest(DELETE_PROGRAM_NAME[REQUEST], handleDeleteProgramName);
}
