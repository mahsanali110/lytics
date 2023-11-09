import { call, put, takeLatest } from '@redux-saga/core/effects';
import { REQUEST } from '../common/actions';
import topicActions, {
  ADD_TOPIC,
  DELETE_TOPIC,
  GET_TOPIC,
  GET_TOPICS,
  UPDATE_TOPIC,
} from './actions';
import topicApi from '../../services/topics';
import settingsActions from 'modules/settings/actions';
export function* handleAddTopic({ payload }) {
  try {
    const { data } = yield call(topicApi.addTopic, payload);
    yield put(topicActions.addTopic.success(data));
    yield put(settingsActions.setFormVisibility({ showForm: false, formType: 'ADD' }));
  } catch (error) {
    yield put(topicActions.addTopic.failure(error));
    antMessage.error(error.message, 5);
  }
}
export function* handleGetTopics({ payload }) {
  try {
    const {
      data: { results, ...pagination },
    } = yield call(topicApi.getTopics, payload);

    yield put(topicActions.getTopics.success({ topicRecords: results, pagination }));
  } catch (error) {
    yield put(topicActions.getTopics.failure(error));
    // antMessage.error(error.message, 5);
  }
}
export function* handleDeleteTopic({ payload }) {
  try {
    yield call(topicApi.deleteTopic, payload);
    yield put(topicActions.deleteTopic.success(payload));
  } catch (error) {
    yield put(topicActions.deleteTopic.failure(error));
    antMessage.error(error.message, 5);
  }
}
export function* handleGetTopic({ payload }) {
  try {
    const { data } = yield call(topicApi.getTopic, payload);
    yield put(topicActions.getTopic.success({ formDetails: data }));
    yield put(settingsActions.setFormVisibility({ showForm: true, formType: 'EDIT' }));
  } catch (error) {
    yield put(topicActions.getTopic.failure(error));
    antMessage.error(error.message, 5);
  }
}
export function* handleUpdateTopic({ payload }) {
  try {
    const { data } = yield call(topicApi.updateTopic, payload);
    yield put(topicActions.updateTopic.success({ topicId: payload.topicId, data }));
    yield put(settingsActions.setFormVisibility({ showForm: false, formType: 'ADD' }));
  } catch (error) {
    yield put(topicActions.updateTopic.failure(error));
    antMessage.error(error.message, 5);
  }
}
export default function* topicsWatcher() {
  yield takeLatest(ADD_TOPIC[REQUEST], handleAddTopic);
  yield takeLatest(DELETE_TOPIC[REQUEST], handleDeleteTopic);
  yield takeLatest(UPDATE_TOPIC[REQUEST], handleUpdateTopic);
  yield takeLatest(GET_TOPICS[REQUEST], handleGetTopics);
  yield takeLatest(GET_TOPIC[REQUEST], handleGetTopic);
}
