import { put, takeLatest, call } from 'redux-saga/effects';
import { message as antMessage } from 'antd';
import {
  CREATE_JOB,
  EDIT_BUNCH_JOBS,
  FETCH_JOBS,
  FETCH_JOBS_BY_HASHTAG,
  GET_JOB_BY_ID,
  jobActions,
  UPDATE_JOB,
  REFRESH_JOB,
  EXPORT_VIDEO,
  DELETE_JOB,
  CREATE_MEDIA_JOBS,
  BULK_ESCALATE_JOBS,
  LOCK_JOB,
  UN_LOCK_JOB,
  CREATE_WEBSITE_JOB,
  CREATE_SOCIAL_JOB,
  LOCK_UN_LOCK_JOB,
} from './actions';
import navActions from '../navigation/actions';
import JobsApi from '../../services/jobs';

export function* handleFetchJobs(action) {
  try {
    const { data } = yield call(JobsApi.fetchJobs, action.payload);
    yield put(jobActions.fetchJobs.success(data));
    yield put(navActions.seData({ type: 'job', data: data.results }));
  } catch (error) {
    yield put(jobActions.fetchJobs.failure({ error }));
  }
}

export function* handleFetchJobsByHashtag(action) {
  try {
    const { data } = yield call(JobsApi.fetchJobsByHashtag, action.payload);
    yield put(jobActions.fetchJobsByHashtag.success(data));
    yield put(navActions.seData({ type: 'job', data: data }));
  } catch (error) {
    yield put(jobActions.fetchJobsByHashtag.failure({ error }));
    antMessage.info(error.message, 3);
  }
}

export function* handleGetJobById(action) {
  try {
    const { data } = yield call(JobsApi.getJobById, action.payload);
    yield put(jobActions.getJobById.success(data));
  } catch (error) {
    yield put(jobActions.getJobById.failure({ error }));
    antMessage.error(error.message, 5);
  }
}

export function* handleUpdateJob(action) {
  try {
    const { data } = yield call(JobsApi.updateJob, action.payload);
    yield put(jobActions.updateJob.success(data));
    antMessage.success('Job updated successfully.');
  } catch (error) {
    yield put(jobActions.updateJob.failure({ error }));
    antMessage.error(error.message, 5);
  }
}

export function* handleCreateJob(action) {
  try {
    const { id, data } = yield call(JobsApi.createJob, action.payload);
    yield put(jobActions.createJob.success({ id, data }));
    antMessage.success('Job created successfully.');
  } catch (error) {
    yield put(jobActions.createJob.failure({ error }));
    antMessage.error(error.message, 8);
  }
}
export function* handleDeleteJob(action) {
  try {
    const { data } = yield call(JobsApi.deleteJob, action.payload);
    yield put(jobActions.deleteJob.success(data));
    antMessage.success('Job deleted successfully.');
  } catch (error) {
    yield put(jobActions.deleteJob.failure({ error }));
    antMessage.error(error.message, 8);
  }
}

export function* handleCreateMediaJobs(action) {
  try {
    const { id, data } = yield call(JobsApi.createMediaJobs, action.payload.data);
    yield put(jobActions.createMediaJobs.success({ id, data }));
    antMessage.success('Jobs created successfully.');
  } catch (error) {
    yield put(jobActions.createMediaJobs.failure({ error }));
    antMessage.error(error.message, 8);
  }
}

export function* handleCreateWebsiteJobs(action) {
  try {
    const { id, data } = yield call(JobsApi.createWebsiteJob, action.payload.data);
    yield put(jobActions.createWebsiteJob.success({ id, data }));
    antMessage.success('Jobs created successfully.');
  } catch (error) {
    yield put(jobActions.createWebsiteJob.failure({ error }));
    antMessage.error(error.message, 8);
  }
}

export function* handleCreateSocialJobs(action) {
  try {
    const { id, data } = yield call(JobsApi.createSocialJob, action.payload.data);
    yield put(jobActions.createSocialJob.success({ id, data }));
    antMessage.success('Jobs created successfully.');
  } catch (error) {
    yield put(jobActions.createSocialJob.failure({ error }));
    antMessage.error(error.message, 8);
  }
}

export function* handleBunchJobs(action) {
  try {
    const { data } = yield call(JobsApi.editBunchJobs, action.payload);
    yield put(jobActions.fetchJobs.success({ results: data }));
    yield put(navActions.seData({ type: 'job', data: data }));
  } catch (error) {
    yield put(jobActions.fetchJobs.failure({ error }));
  }
}
export function* handleRefreshJob(action) {
  try {
    const { data } = yield call(JobsApi.refreshJob, action.payload);
    yield put(jobActions.refreshJob.success({ results: data }));
    yield put(navActions.seData({ type: 'job', data }));
  } catch (error) {
    yield put(jobActions.refreshJob.failure({ error }));
  }
}

export function* handleLockJob(action) {
  try {
    const { data } = yield call(JobsApi.lockJob, action.payload);
    // yield put(jobActions.refreshJob.success({ results: data }));
    // yield put(navActions.seData({ type: 'job', data }));
  } catch (error) {
    // yield put(jobActions.refreshJob.failure({ error }));
  }
}
export function* handleUnlockJob(action) {
  try {
    const { data } = yield call(JobsApi.unlockJob, action.payload);
    // yield put(jobActions.refreshJob.success({ results: data }));
    // yield put(navActions.seData({ type: 'job', data }));
  } catch (error) {
    // yield put(jobActions.refreshJob.failure({ error }));
  }
}
export function* handleLockUnlockJob(action) {
  try {
    const { data } = yield call(JobsApi.lockUnlockJob, action.payload);
    // yield put(jobActions.refreshJob.success({ results: data }));
    // yield put(navActions.seData({ type: 'job', data }));
  } catch (error) {
    // yield put(jobActions.refreshJob.failure({ error }));
  }
}

export function* handleExportVideo(action) {
  try {
    const data = yield call(JobsApi.exportVideo, action.payload);
    if (data.data == 'ok') antMessage.success('Video Exporting in Progress');
  } catch (error) {}
}

export function* handleBulkEscalateJobs(action) {
  try {
    const { data } = yield call(JobsApi.bulkEsclateJobs, action.payload);
    yield put(jobActions.bulkEscalateJobs.success({ results: data }));
    antMessage.success('bulk jobs updated');
  } catch (error) {
    yield put(jobActions.bulkEscalateJobs.failure({ error }));
  }
}

export function* updateJob() {
  yield takeLatest(UPDATE_JOB.REQUEST, handleUpdateJob);
}

export function* fetchJobs() {
  yield takeLatest(FETCH_JOBS.REQUEST, handleFetchJobs);
  yield takeLatest(FETCH_JOBS_BY_HASHTAG.REQUEST, handleFetchJobsByHashtag);
  yield takeLatest(EDIT_BUNCH_JOBS.REQUEST, handleBunchJobs);
  yield takeLatest(REFRESH_JOB.REQUEST, handleRefreshJob);
}

export function* getJobById() {
  yield takeLatest(GET_JOB_BY_ID.REQUEST, handleGetJobById);
}
//updateByField
export function* createJob() {
  yield takeLatest(CREATE_JOB.REQUEST, handleCreateJob);
}
export function* deleteJob() {
  yield takeLatest(DELETE_JOB.REQUEST, handleDeleteJob);
}

export function* createMediaJobs() {
  yield takeLatest(CREATE_MEDIA_JOBS.REQUEST, handleCreateMediaJobs);
}

export function* createWebsiteJobs() {
  yield takeLatest(CREATE_WEBSITE_JOB.REQUEST, handleCreateWebsiteJobs);
}

export function* createSocialJobs() {
  yield takeLatest(CREATE_SOCIAL_JOB.REQUEST, handleCreateSocialJobs);
}

export function* exportVideo() {
  yield takeLatest(EXPORT_VIDEO.REQUEST, handleExportVideo);
}

export function* bulkEscalateJobs() {
  yield takeLatest(BULK_ESCALATE_JOBS.REQUEST, handleBulkEscalateJobs);
}
export function* lockJob() {
  yield takeLatest(LOCK_JOB.REQUEST, handleLockJob);
}

export function* unlockJob() {
  yield takeLatest(UN_LOCK_JOB.REQUEST, handleUnlockJob);
}
export function* lockUnlockJob() {
  yield takeLatest(LOCK_UN_LOCK_JOB.REQUEST, handleLockUnlockJob);
}
