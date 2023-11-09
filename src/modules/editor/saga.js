import { put, call, takeLatest } from 'redux-saga/effects';
import { message as antMessage } from 'antd';
import { EXPORT_VIDEO, CHECK_VIDEO_STATUS } from './actions';
import editorActions from './actions';
import editorApi from '../../services/editor';

function* handleExportVideo(action) {
  try {
    const { data } = yield call(editorApi.exportVideo, action.payload);
    yield put(editorActions.exportVideo.success(data));
    antMessage.success('Video clipping in progress', 2);
    console.log({ data });
  } catch (error) {
    yield put(editorActions.exportVideo.failure(error));
    antMessage.error(error.message, 2);
    console.log({ error });
  }
}

function* handleCheckVideoStatus(action) {
  try {
    const { data } = yield call(editorApi.checkVideoStatus, action.payload);

    yield put(editorActions.checkVideoStatus.success(data));
    // antMessage.success('Video clipping in progress', 2);
    console.log({ data: data[0] });
  } catch (error) {
    yield put(editorActions.checkVideoStatus.failure(error));
    antMessage.error(error.message, 2);
  }
}

export function* editorWatcher() {
  yield takeLatest(EXPORT_VIDEO.REQUEST, handleExportVideo);
  yield takeLatest(CHECK_VIDEO_STATUS.REQUEST, handleCheckVideoStatus);
}
