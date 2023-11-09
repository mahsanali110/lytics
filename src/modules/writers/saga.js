import { call, put, take, takeLatest } from 'redux-saga/effects';
import { message as antMessage } from 'antd';

import settingsActions from '../settings/actions';
import { REQUEST } from '../common/actions';
import writersApi from '../../services/writers';
import writersActions, {
  GET_WRITERS,
  ADD_WRITER,
  GET_WRITER,
  UPDATE_WRITER,
  DELETE_WRITER,
} from './actions';

export function* handleGetWriters({ payload }) {
  try {
    const {
      data: { results, ...pagination },
    } = yield call(writersApi.getWriters, payload);
    yield put(writersActions.getWriters.success({ writers: results, pagination }));
  } catch (error) {
    yield put(writersActions.getWriters.failure(error));
    // antMessage.error(error.message, 5);
  }
}
export function* handleAddWriter({ payload }) {
  try {
    const { data } = yield call(writersApi.addWriter, payload);
    yield put(writersActions.addWriter.success(data));
    yield put(settingsActions.setFormVisibility({ showForm: false, formType: 'ADD' }));
  } catch (error) {
    yield put(writersActions.addWriter.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleGetWriter({ payload }) {
  try {
    const { data } = yield call(writersApi.getWriter, payload);
    yield put(writersActions.getWriter.success({ formDetails: data }));
    yield put(settingsActions.setFormVisibility({ showForm: true, formType: 'EDIT' }));
    window.scrollTo(0, 40);
  } catch (error) {
    yield put(writersActions.getWriter.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleUpdateWriter({ payload }) {
  try {
    const { data } = yield call(writersApi.updateWriter, payload);
    yield put(writersActions.updateWriter.success({ writerId: payload.writerId, data }));
    yield put(settingsActions.setFormVisibility({ showForm: false, formType: 'ADD' }));
  } catch (error) {
    yield put(writersActions.updateWriter.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleDeleteWriter({ payload }) {
  try {
    // yield call(writersApi.deleteWriter, payload);
    // yield put(writersActions.deleteWriter.success(payload));
    const data = yield call(writersApi.deleteWriter, payload);
    if (data.data === false) {
      antMessage.warning("Writer cannot be deleted because it's been used by other services", 3);
      yield put(writersActions.deleteWriter.success());
    } else {
      yield put(writersActions.deleteWriter.success(payload));
    }
  } catch (error) {
    yield put(writersActions.deleteWriter.failure(error));
    antMessage.error(error.message, 5);
  }
}

export default function* writersWatcher() {
  yield takeLatest(GET_WRITERS[REQUEST], handleGetWriters);
  yield takeLatest(ADD_WRITER[REQUEST], handleAddWriter);
  yield takeLatest(GET_WRITER[REQUEST], handleGetWriter);
  yield takeLatest(UPDATE_WRITER[REQUEST], handleUpdateWriter);
  yield takeLatest(DELETE_WRITER[REQUEST], handleDeleteWriter);
}
