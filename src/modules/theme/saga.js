import { call, put, takeLatest } from '@redux-saga/core/effects';
import { REQUEST } from '../common/actions';
import themesActions, {
  ADD_THEME,
  DELETE_THEME,
  GET_THEME,
  GET_THEMES,
  UPDATE_THEME,
} from './actions';
import themesApi from '../../services/themes';
import settingsActions from 'modules/settings/actions';
export function* handleAddTheme({ payload }) {
  try {
    const { data } = yield call(themesApi.addTheme, payload);
    yield put(themesActions.addTheme.success(data));
    yield put(settingsActions.setFormVisibility({ showForm: false, formType: 'ADD' }));
  } catch (error) {
    yield put(themesActions.addTheme.failure(error));
    antMessage.error(error.message, 5);
  }
}
export function* handleGetThemes({ payload }) {
  try {
    const {
      data: { results, ...pagination },
    } = yield call(themesApi.getThemes, payload);

    yield put(themesActions.getThemes.success({ themeRecords: results, pagination }));
  } catch (error) {
    yield put(themesActions.getThemes.failure(error));
    // antMessage.error(error.message, 5);
  }
}
export function* handleDeleteTheme({ payload }) {
  try {
    yield call(themesApi.deleteTheme, payload);
    yield put(themesActions.deleteTheme.success(payload));
  } catch (error) {
    yield put(themesActions.deleteTheme.failure(error));
    antMessage.error(error.message, 5);
  }
}
export function* handleGetTheme({ payload }) {
  try {
    const { data } = yield call(themesApi.getTheme, payload);
    yield put(themesActions.getTheme.success({ formDetails: data }));
    yield put(settingsActions.setFormVisibility({ showForm: true, formType: 'EDIT' }));
  } catch (error) {
    yield put(themesActions.getTheme.failure(error));
    antMessage.error(error.message, 5);
  }
}
export function* handleUpdateTheme({ payload }) {
  try {
    const { data } = yield call(themesApi.updateTheme, payload);
    yield put(themesActions.updateTheme.success({ themeId: payload.themeId, data }));
    yield put(settingsActions.setFormVisibility({ showForm: false, formType: 'ADD' }));
  } catch (error) {
    yield put(themesActions.updateTheme.failure(error));
    antMessage.error(error.message, 5);
  }
}
export default function* themesWatcher() {
  yield takeLatest(ADD_THEME[REQUEST], handleAddTheme);
  yield takeLatest(DELETE_THEME[REQUEST], handleDeleteTheme);
  yield takeLatest(UPDATE_THEME[REQUEST], handleUpdateTheme);
  yield takeLatest(GET_THEMES[REQUEST], handleGetThemes);
  yield takeLatest(GET_THEME[REQUEST], handleGetTheme);
}
