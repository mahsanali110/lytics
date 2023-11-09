import { put, takeLatest, call } from 'redux-saga/effects';
import { message as antMessage } from 'antd';
import libraryJobsActions, {
  CREATE_LIBRARY_JOB,
  FETCH_LIBRARY_JOBS_COMPANY,
  FETCH_LIBRARY_JOBS_PERSONAL,
  GET_JOB_BY_ID_LIBRARY,
  SHARE_JOB,
  YOUTUBE_POST,
} from './actions';
import libraryJobApi from '../../services/libraryjobs';
import { jobActions } from 'modules/jobs/actions';
import editorActions from 'modules/editor/actions';

function* handleCreateLibraryJob(action) {
  try {
    const { id, data } = yield call(libraryJobApi.createJob, action.payload);
    yield put(libraryJobsActions.createJob.success({ id, data }));
    antMessage.success('Job created successfully.');
  } catch (error) {
    yield put(libraryJobsActions.createJob.failure({ error }));
    antMessage.error(error.message, 8);
  }
}

function* handleFetchLibraryJobsCompany(action) {
  try {
    const { data } = yield call(libraryJobApi.fetchJobs, action.payload);

    yield put(libraryJobsActions.fetchJobsCompany.success(data));
  } catch (error) {
    yield put(libraryJobsActions.fetchJobsCompany.failure(error));
    antMessage.error(error.message, 8);
  }
}

function* handleFetchLibraryJobsPersonal(action) {
  try {
    const { data } = yield call(libraryJobApi.fetchJobs, action.payload);

    yield put(libraryJobsActions.fetchJobsPersonal.success(data));
  } catch (error) {
    yield put(libraryJobsActions.fetchJobsPersonal.failure(error));
    antMessage.error(error.message, 8);
  }
}

function* handleGetJobById(action) {
  try {
    const { data } = yield call(libraryJobApi.getJobById, action.payload);
    yield put(jobActions.getJobById.success(data));
    yield put(libraryJobsActions.getJobById.success());
  } catch (error) {
    yield put(libraryJobsActions.getJobById.failure(error));
    yield antMessage.error(error.message, 2);
  }
}

function* handleShareJob(action) {
  try {
    const { data } = yield call(libraryJobApi.shareJob, action.payload);
    yield put(libraryJobsActions.shareJob.success(data));
    yield put(editorActions.updateByField({ field: 'shareToLens', value: false }));
    yield antMessage.success('Job shared success fully');
  } catch (error) {
    yield put(libraryJobsActions.shareJob.failure(error));
    yield put(editorActions.updateByField({ field: 'shareToLens', value: false }));

    yield antMessage.error(error.message, 2);
  }
}

function* handleYoutubePost({ payload }) {
  try {
    const { data } = yield call(libraryJobApi.youtubePost, payload);
    yield put(libraryJobsActions.youtubePost.success(data));
    yield antMessage.success('Youtube post success');
  } catch (error) {
    yield put(libraryJobsActions.youtubePost.failure(error));
    yield antMessage.error(error.message, 2);
  }
}

export function* libraryJobsWatcher() {
  yield takeLatest(CREATE_LIBRARY_JOB.REQUEST, handleCreateLibraryJob);
  yield takeLatest(FETCH_LIBRARY_JOBS_COMPANY.REQUEST, handleFetchLibraryJobsCompany);
  yield takeLatest(FETCH_LIBRARY_JOBS_PERSONAL.REQUEST, handleFetchLibraryJobsPersonal);
  yield takeLatest(GET_JOB_BY_ID_LIBRARY.REQUEST, handleGetJobById);
  yield takeLatest(SHARE_JOB.REQUEST, handleShareJob);
  yield takeLatest(YOUTUBE_POST.REQUEST, handleYoutubePost);
}
