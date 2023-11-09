import { call, put, takeLatest } from 'redux-saga/effects';
import { message as antMessage } from 'antd';

import settingsActions from '../settings/actions';
import { REQUEST } from '../common/actions';
import programTypesApi from '../../services/programTypes';
import programTypesActions, {
  GET_PROGRAM_TYPES,
  ADD_PROGRAM_TYPE,
  GET_PROGRAM_TYPE,
  UPDATE_PROGRAM_TYPE,
  DELETE_PROGRAM_TYPE,
} from './actions';

export function* handleGetProgramTypes({ payload }) {
  try {
    const {
      data: { results, ...pagination },
    } = yield call(programTypesApi.getProgramTypes, payload);
    yield put(programTypesActions.getProgramTypes.success({ programTypes: results, pagination }));
  } catch (error) {
    yield put(programTypesActions.getProgramTypes.failure(error));
    // antMessage.error(error.message, 5);
  }
}
export function* handleAddProgramType({ payload }) {
  try {
    const { data } = yield call(programTypesApi.addProgramType, payload);
    yield put(programTypesActions.addProgramType.success(data));
    yield put(settingsActions.setFormVisibility({ showForm: false, formType: 'ADD' }));
  } catch (error) {
    yield put(programTypesActions.addProgramType.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleGetProgramType({ payload }) {
  try {
    const { data } = yield call(programTypesApi.getProgramType, payload);
    yield put(programTypesActions.getProgramType.success({ formDetails: data }));
    yield put(settingsActions.setFormVisibility({ showForm: true, formType: 'EDIT' }));
    window.scrollTo(0, 40);
  } catch (error) {
    yield put(programTypesActions.getProgramType.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleUpdateProgramType({ payload }) {
  try {
    const { data } = yield call(programTypesApi.updateProgramType, payload);
    yield put(
      programTypesActions.updateProgramType.success({ programTypeId: payload.programTypeId, data })
    );
    yield put(settingsActions.setFormVisibility({ showForm: false, formType: 'ADD' }));
  } catch (error) {
    yield put(programTypesActions.updateProgramType.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleDeleteProgramType({ payload }) {
  try {
    // yield call(programTypesApi.deleteProgramType, payload);
    // yield put(programTypesActions.deleteProgramType.success(payload));
    const data = yield call(programTypesApi.deleteProgramType, payload);
    if (data.data === false) {
      antMessage.warning(
        "Program Type cannot be deleted because it's been used by other services",
        3
      );
      yield put(programTypesActions.deleteProgramType.success());
    } else {
      yield put(programTypesActions.deleteProgramType.success(payload));
    }
  } catch (error) {
    yield put(programTypesActions.deleteProgramType.failure(error));
    antMessage.error(error.message, 5);
  }
}

export default function* programTypesWatcher() {
  yield takeLatest(GET_PROGRAM_TYPES[REQUEST], handleGetProgramTypes);
  yield takeLatest(ADD_PROGRAM_TYPE[REQUEST], handleAddProgramType);
  yield takeLatest(GET_PROGRAM_TYPE[REQUEST], handleGetProgramType);
  yield takeLatest(UPDATE_PROGRAM_TYPE[REQUEST], handleUpdateProgramType);
  yield takeLatest(DELETE_PROGRAM_TYPE[REQUEST], handleDeleteProgramType);
}
