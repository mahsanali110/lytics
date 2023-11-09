import { put, takeLatest, call } from 'redux-saga/effects';
import { message as antMessage } from 'antd';
import { useDispatch } from 'react-redux';
import {
  GET_MARKER_BY_ID,
  UPDATE_MARKER,
  markerEditActions,
  UPDATE_GUEST_SENTIMENT,
  UPDATE_ANAYSIS_SENTIMENT,
  UPDATE_ANCHOR_SENTIMENT,
  UPDATE_SUMMARY_SENTIMENT,
} from './actions';

import JobsAPI from 'services/jobs';

export function* handleGetMarkerById(action) {
  try {
    const { data } = yield call(JobsAPI.getJobById, action.payload);
    yield put(markerEditActions.getDataById.success(data));
  } catch (error) {
    yield put(markerEditActions.getDataById.failure({ error }));
  }
}
// const dispatch = useDispatch()

export function* handleUpdateMarker(action) {
  try {
    const { id, data } = yield call(JobsAPI.updateJob, action.payload);
    yield put(markerEditActions.updateMarker.success(data));
    antMessage.success('Job updated successfully.');
  } catch (error) {
    yield put(markerEditActions.updateMarker.failure({ error }));
    antMessage.error(error.message, 2);
  }
}
export function* handleUpdateSentiment(action) {
  console.log(action.payload);
  try {
    const { data } = yield call(JobsAPI.randomAPI, action.payload);
    console.log(data);
    yield put(markerEditActions.getGuestSentiment.success({ updateSentiment: data }));
    antMessage.success('Sentiment updated successfully.');
  } catch (error) {
    yield put(markerEditActions.updateMarker.failure({ error }));
    antMessage.error(error,5);
  }
}

export function* handleAnalysisSentiment(action) {
  console.log(action.payload);
  try {
    const { data } = yield call(JobsAPI.randomAPI, action.payload);
    console.log(data);
    yield put(markerEditActions.getAnalysisSentiment.success({ analysisSentiments: data }));
    const { updateAnalysis } = markerEditActions;
    yield put(updateAnalysis({ field: 'scale', value: data.value, index: data.index }));
    antMessage.success('Sentiment updated successfully.');
  } catch (error) {
    yield put(markerEditActions.getAnalysisSentiment.failure({ error }));
    antMessage.error(error,5);
  }
}
export function* handleAnchorSentiment(action) {
  console.log(action.payload);
  try {
    const { data } = yield call(JobsAPI.randomAPI, action.payload);
    console.log(data);
    yield put(markerEditActions.anchorSentiment.success({ anchorSentiments: data }));
    const { updateAnchor } = markerEditActions;
    yield put(updateAnchor({ field: 'sentiment', value: data.value, index: data.index }));
    antMessage.success('Sentiment updated successfully.');
  } catch (error) {
    yield put(markerEditActions.anchorSentiment.failure({ error }));
    antMessage.error(error,5);
  }
}
export function* handleSummarySentiment(action) {
  console.log('saga');
  console.log(action.payload);
  try {
    const { data } = yield call(JobsAPI.randomAPI, action.payload);
    console.log(data);
    yield put(markerEditActions.summarySentiment.success({ summarySentiments: data }));
    yield put({
      type: 'UPDATE_PARTICIPANT',
      payload: {
        field: 'sentiment',
        value: data.value,
        index: data.participantIndex,
        segIndex: data.index,
      },
    });
    // const { updateSummary } = markerEditActions
    // yield put(updateSummary({ field: 'sentiment', value: data.value, index: data.index }));
    // antMessage.success('Sentiment updated successfully.');
  } catch (error) {
    yield put(markerEditActions.summarySentiment.failure({ error }));
    antMessage.error(error,5);
  }
}
export function* updateMarker() {
  yield takeLatest(UPDATE_MARKER.REQUEST, handleUpdateMarker);
}
export function* updateSentiment() {
  yield takeLatest(UPDATE_GUEST_SENTIMENT.REQUEST, handleUpdateSentiment);
}
export function* handleAnalysis() {
  yield takeLatest(UPDATE_ANAYSIS_SENTIMENT.REQUEST, handleAnalysisSentiment);
}
export function* handleAnchor() {
  yield takeLatest(UPDATE_ANCHOR_SENTIMENT.REQUEST, handleAnchorSentiment);
}
export function* handleSummary() {
  yield takeLatest(UPDATE_SUMMARY_SENTIMENT.REQUEST, handleSummarySentiment);
}
export function* getMarkerById() {
  yield takeLatest(GET_MARKER_BY_ID.REQUEST, handleGetMarkerById);
}
