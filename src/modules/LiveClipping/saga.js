import { put, takeLatest, call } from 'redux-saga/effects';
import { message as antMessage } from 'antd';

import { CREATE_LIVE_JOB, UPDATE_LIVE_JOB, liveClippingActions } from './actions';
import { markerEditActions } from '../markerEdit/actions';
import JobsApi from '../../services/jobs';

export function* handleCreateLiveJob(action) {
  try {
    const { data } = yield call(JobsApi.createJob, action.payload);
    yield put(
      liveClippingActions.createJob.success({
        index: action.payload.jobIndex,
        id: data.id,
      })
    );
    antMessage.success('Job created successfully.');
  } catch (error) {
    yield put(liveClippingActions.createJob.failure({ error }));
    antMessage.error(error.message, 8);
  }
}

export function* handleUpdateLiveJob(action) {
  try {
    const { data } = yield call(JobsApi.updateJob, action.payload);
    yield put(liveClippingActions.updateJob.success());
    antMessage.success('Job updated successfully.');
  } catch (error) {
    yield put(liveClippingActions.updateJob.failure({ error }));
    antMessage.error(error.message, 5);
  }
}

export function* createLiveJob() {
  yield takeLatest(CREATE_LIVE_JOB.REQUEST, handleCreateLiveJob);
}

export function* updateLiveJob() {
  yield takeLatest(UPDATE_LIVE_JOB.REQUEST, handleUpdateLiveJob);
}
