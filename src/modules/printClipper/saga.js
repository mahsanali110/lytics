import { call, put, takeLatest } from 'redux-saga/effects';
import { message as antMessage } from 'antd';

import printClipperApi from '../../services/printClipper';
import printClipoerActions, { CREATE_JOB } from './actions';

export function* handleCreateJob({ payload }) {
  try {
    const { data } = yield call(printClipperApi.createJob, payload);
    yield put(printClipoerActions.createJob.success(data));
    yield put(printClipoerActions.resetFormDetails());
    antMessage.success('Job created successfuly', 5);
  } catch (error) {
    yield put(printClipoerActions.createJob.failure(error));
    antMessage.error(error.message, 5);
  }
}

export default function* printClipperWatcher() {
  yield takeLatest(CREATE_JOB.REQUEST, handleCreateJob);
}
