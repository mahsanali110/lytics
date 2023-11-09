import { call, put, takeLatest } from 'redux-saga/effects';
import { message as antMessage } from 'antd';
import settingsActions from '../settings/actions';
import { REQUEST } from '../common/actions';
import contentExportApi from '../../services/exportJob';
import contentExportActions, {
  GET_EXPORT_JOB,
  GET_EXPORT_BY_ID,
  CREATE_EXPORT_JOB,
  UPDATE_EXPORT_JOB,
  DELETE_EXPORT_JOB,
  EXPORT_TO_DRIVE,
} from './action';

export function* handleGetExportJobs({ payload }) {
  try {
    const { data } = yield call(contentExportApi.getExportJobs, payload);
    yield put(contentExportActions.getExportJobs.success(data));
  } catch (error) {
    yield put(contentExportActions.getExportJobs.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleCreateExportJob({ payload }) {
  try {
    const { data } = yield call(contentExportApi.createExportJob, payload);
    yield put(contentExportActions.createExportJob.success({ formDetails: data }));
    // yield put(settingsActions.setFormVisibility({ showForm: false, formType: 'ADD' }));
  } catch (error) {
    yield put(contentExportActions.createExportJob.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleGetExportJob({ payload }) {
  try {
    const { data } = yield call(contentExportApi.getExportJobById, payload);
    yield put(contentExportActions.getExportJobById.success(data));
  } catch (error) {
    yield put(contentExportActions.getExportJobById.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleUpdateExportJob({ payload }) {
  try {
    const { data } = yield call(contentExportApi.updateExportJob, payload);
    yield put(contentExportActions.updateExportJob.success(data));
    antMessage.success('Job updated successfully.');
  } catch (error) {
    yield put(contentExportActions.updateExportJob.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleExportToDrive({ payload }) {
  try {
    const { data } = yield call(contentExportApi.exportToDrive, payload);
    yield put(contentExportActions.exportToDrive.success(data));
    antMessage.success('Job updated successfully.');
  } catch (error) {
    yield put(contentExportActions.exportToDrive.failure(error));
    antMessage.error(error.message, 5);
  }
}
// export function* hanldeDeleteExportJob({ payload }) {
//   try {
//     yield call(contentExportActions.deleteAlarm, payload);
//     yield put(contentExportActions.deleteAlarm.success(payload));
//   } catch (error) {
//     yield put(alarmActions.deleteAlarm.failure(error));
//     antMessage.error(error.message, 5);
//   }
// }

export default function* contentExport() {
  yield takeLatest(GET_EXPORT_JOB[REQUEST], handleGetExportJobs);
  yield takeLatest(CREATE_EXPORT_JOB[REQUEST], handleCreateExportJob);
  yield takeLatest(GET_EXPORT_BY_ID[REQUEST], handleGetExportJob);
  yield takeLatest(UPDATE_EXPORT_JOB[REQUEST], handleUpdateExportJob);
  yield takeLatest(EXPORT_TO_DRIVE[REQUEST], handleExportToDrive);

  //   yield takeLatest(DELETE_EXPORT_JOB[REQUEST], hanldeDeleteExportJob);
}
