import { put, call, takeLatest } from 'redux-saga/effects';
import { message as antMessage } from 'antd';

import {
  FETCH_TV_ONLINE_JOBS,
  FETCH_PRINT_WEB_JOBS,
  FETCH_SOCIAL_JOBS,
  FETCH_TICKER_JOBS,
  UPDATE_CURRENT_USER,
} from './actions';

import newsboardActions from './actions';
import { jobActions } from 'modules/jobs/actions';
import authActions from 'modules/auth/actions';
import NewsboardApi from '../../services/newsboard';
import usersApi from '../../services/users';
import { updateUserinLocalStorage } from '../common/utils';

function* fetchTvOnlineJobs({ payload }) {
  try {
    const { data } = yield call(NewsboardApi.fetchJobs, payload);
    yield put(newsboardActions.fetchTvOnlineJobs.success(data));
    if (data?.results?.length) {
      yield put(jobActions.getJobById.request(data.results[0].id));
    }
  } catch (err) {
    yield put(newsboardActions.fetchTvOnlineJobs.failure(err));
    antMessage.error(err.message, 3);
  }
}

function* fetchPrintWebJobs({ payload }) {
  try {
    const { data } = yield call(NewsboardApi.fetchJobs, payload);
    yield put(newsboardActions.fetchPrintWeb.success(data));
  } catch (err) {
    yield put(newsboardActions.fetchPrintWeb.failure(err));

    antMessage.error(err.message, 3);
  }
}

function* fetchSocialJobs({ payload }) {
  try {
    const { data } = yield call(NewsboardApi.fetchJobs, payload);
    yield put(newsboardActions.fetchSocialJobs.success(data));
  } catch (err) {
    yield put(newsboardActions.fetchSocialJobs.failure(err));
    antMessage.error(err.message, 3);
  }
}

function* fetchTickerJobs({ payload }) {
  try {
    const { data } = yield call(NewsboardApi.fetchJobs, payload);
    yield put(newsboardActions.fetchTickerJobs.success(data));
  } catch (err) {
    yield put(newsboardActions.fetchTickerJobs.failure(err));

    antMessage.error(err.message, 3);
  }
}

function* updateCurrentUser({ payload }) {
  try {
    const { data } = yield call(usersApi.updateUser, payload);
    yield put(authActions.signin.success({ user: data }));
    updateUserinLocalStorage(data);
  } catch (err) {
    antMessage.error(err.message, 3);
  }
}

export default function* newsBoardWatcher() {
  yield takeLatest(FETCH_TV_ONLINE_JOBS.REQUEST, fetchTvOnlineJobs);
  yield takeLatest(FETCH_PRINT_WEB_JOBS.REQUEST, fetchPrintWebJobs);
  yield takeLatest(FETCH_SOCIAL_JOBS.REQUEST, fetchSocialJobs);
  yield takeLatest(FETCH_TICKER_JOBS.REQUEST, fetchTickerJobs);
  yield takeLatest(UPDATE_CURRENT_USER.REQUEST, updateCurrentUser);
}
