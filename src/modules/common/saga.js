import { put, takeLatest, call } from 'redux-saga/effects';
import { message as antMessage } from 'antd';

import actions, {
  FETCH_THEMES,
  FETCH_HOSTS,
  FETCH_GUESTS,
  FETCH_PROGRAM_NAMES,
  FETCH_PROGRAM_TYPES,
  FETCH_TOPICS,
  CREATE_HASHTAG,
  FETCH_HASHTAGS,
  FETCH_TOP_HASHTAGS,
} from './actions';
import API from 'services/common';
import hashtagAPI from 'services/hashtag';

export function* handleFetchThemes() {
  try {
    const { data } = yield call(API.fetchThemes);
    yield put(actions.fetchThemes.success({ themes: data.results ?? [] }));
  } catch (error) {
    yield put(actions.fetchThemes.failure(error));
  }
}

export function* handleFetchTopics() {
  try {
    const { data } = yield call(API.fetchTopics);
    yield put(actions.fetchTopics.success({ topics: data.results ?? [] }));
  } catch (error) {
    yield put(actions.fetchTopics.failure(error));
  }
}

export function* handleFetchHosts() {
  try {
    const { data } = yield call(API.fetchHosts);
    yield put(actions.fetchHosts.success({ hosts: data.results }));
  } catch (error) {
    yield put(actions.fetchHosts.failure(error));
  }
}

export function* handleFetchGuess() {
  try {
    const { data } = yield call(API.fetchGuests);
    yield put(actions.fetchGuests.success({ guests: data.results }));
  } catch (error) {
    yield put(actions.fetchGuests.failure(error));
  }
}

export function* handleFetchProgramNames() {
  try {
    const { data } = yield call(API.fetchProgramNames);
    yield put(actions.fetchProgramNames.success({ programNames: data.results }));
  } catch (error) {
    yield put(actions.fetchProgramNames.failure(error));
  }
}

export function* handleFetchProgramTypes() {
  try {
    const { data } = yield call(API.fetchProgramTypes);
    yield put(actions.fetchProgramTypes.success({ programTypes: data.results }));
  } catch (error) {
    yield put(actions.fetchProgramTypes.failure(error));
  }
}

export function* handleCreateHashtag({ payload }) {
  try {
    const { data } = yield call(hashtagAPI.addHashtag, payload);
    yield put(actions.createHashtag.success({ hashtag: data }));
    yield antMessage.success('Hashtag added to collection successfuly', 2);
  } catch (error) {
    yield put(actions.createHashtag.failure());
    yield antMessage.error('Failed to add hashtag', 2);
  }
}

export function* handleGetHashtags() {
  try {
    const { data } = yield call(hashtagAPI.getHashtags);
    yield put(actions.fetchHashtags.success({ hashtags: data.results }));
  } catch (error) {
    yield put(actions.fetchHashtags.failure(error));
    // yield antMessage.error('Unable to fetch hashtags', 2);
  }
}
export function* handleGetTopHashtags() {
  try {
    const { data } = yield call(hashtagAPI.getTopHashtags);
    console.log(data);
    yield put(actions.fetchTopHashtags.success({ topHashtags: data }));
  } catch (error) {
    yield put(actions.fetchTopHashtags.failure(error));
    // yield antMessage.error('Unable to fetch hashtags', 2);
  }
}

export function* fetchHosts() {
  yield takeLatest(FETCH_HOSTS.REQUEST, handleFetchHosts);
}

export function* fetchThemes() {
  yield takeLatest(FETCH_THEMES.REQUEST, handleFetchThemes);
}

export function* fetchTopics() {
  yield takeLatest(FETCH_TOPICS.REQUEST, handleFetchTopics);
}

export function* fetchGuests() {
  yield takeLatest(FETCH_GUESTS.REQUEST, handleFetchGuess);
}

export function* fetchProgramNames() {
  yield takeLatest(FETCH_PROGRAM_NAMES.REQUEST, handleFetchProgramNames);
}

export function* fetchProgramTypes() {
  yield takeLatest(FETCH_PROGRAM_TYPES.REQUEST, handleFetchProgramTypes);
}

export default function* hashtagWatcher() {
  yield takeLatest(CREATE_HASHTAG.REQUEST, handleCreateHashtag);
  yield takeLatest(FETCH_HASHTAGS.REQUEST, handleGetHashtags);
  yield takeLatest(FETCH_TOP_HASHTAGS.REQUEST, handleGetTopHashtags);
}
