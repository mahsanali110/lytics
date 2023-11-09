import { call, put, takeLatest } from 'redux-saga/effects';
import { message as antMessage } from 'antd';

import settingsActions from '../settings/actions';
import { REQUEST } from '../common/actions';
import associationsApi from '../../services/associations';
import associationsActions, {
  GET_ASSOCIATIONS,
  ADD_ASSOCIATION,
  GET_ASSOCIATION,
  UPDATE_ASSOCIATION,
  DELETE_ASSOCIATION,
} from './actions';

export function* handleGetAssociations({ payload }) {
  try {
    const {
      data: { results, ...pagination },
    } = yield call(associationsApi.getAssociations, payload);
    yield put(associationsActions.getAssociations.success({ associations: results, pagination }));
  } catch (error) {
    yield put(associationsActions.getAssociations.failure(error));
    // antMessage.error(error.message, 5);
  }
}

export function* handleAddAssociation({ payload }) {
  try {
    const { data } = yield call(associationsApi.addAssociation, payload);
    yield put(associationsActions.addAssociation.success(data));
    yield put(settingsActions.setFormVisibility({ showForm: false, formType: 'ADD' }));
  } catch (error) {
    yield put(associationsActions.addAssociation.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleGetAssociation({ payload }) {
  try {
    const { data } = yield call(associationsApi.getAssociation, payload);
    yield put(associationsActions.getAssociation.success({ formDetails: data }));
    yield put(settingsActions.setFormVisibility({ showForm: true, formType: 'EDIT' }));
    window.scrollTo(0, 40);
  } catch (error) {
    yield put(associationsActions.getAssociation.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleUpdateAssociation({ payload }) {
  try {
    const { data } = yield call(associationsApi.updateAssociation, payload);
    yield put(
      associationsActions.updateAssociation.success({ associationId: payload.associationId, data })
    );
    yield put(settingsActions.setFormVisibility({ showForm: false, formType: 'ADD' }));
  } catch (error) {
    yield put(associationsActions.updateAssociation.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleDeleteAssociation({ payload }) {
  try {
    // yield call(associationsApi.deleteAssociation, payload);
    // yield put(associationsActions.deleteAssociation.success(payload));
    const data = yield call(associationsApi.deleteAssociation, payload);
    if (data.data === false) {
      antMessage.warning(
        "Association cannot be deleted because it's been used by other services",
        3
      );
      yield put(associationsActions.deleteAssociation.success());
    } else {
      yield put(associationsActions.deleteAssociation.success(payload));
    }
  } catch (error) {
    yield put(associationsActions.deleteAssociation.failure(error));
    antMessage.error(error.message, 5);
  }
}

export default function* associationsWatcher() {
  yield takeLatest(GET_ASSOCIATIONS[REQUEST], handleGetAssociations);
  yield takeLatest(ADD_ASSOCIATION[REQUEST], handleAddAssociation);
  yield takeLatest(GET_ASSOCIATION[REQUEST], handleGetAssociation);
  yield takeLatest(UPDATE_ASSOCIATION[REQUEST], handleUpdateAssociation);
  yield takeLatest(DELETE_ASSOCIATION[REQUEST], handleDeleteAssociation);
}
