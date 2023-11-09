import { call, put, takeLatest } from 'redux-saga/effects';
import { message as antMessage } from 'antd';

import settingsActions from '../settings/actions';
import { REQUEST } from '../common/actions';
import companyApi from '../../services/company';
import companyActions, {
  GET_COMPANIES,
  ADD_COMPANY,
  GET_COMPANY,
  UPDATE_COMPANY,
  DELETE_COMPANY,
} from './action';

export function* handleGetCompanies({ payload }) {
  try {
    const {
      data: { results, ...pagination },
    } = yield call(companyApi.getCompanies, payload);
    yield put(companyActions.getCompanies.success({ companies: results, pagination }));
  } catch (error) {
    yield put(companyActions.getCompanies.failure(error));
    // antMessage.error(error.message, 5);
  }
}
export function* handleAddCompany({ payload }) {
  try {
    console.log({ guestPayload: payload });
    const { data } = yield call(companyApi.addCompany, payload);
    yield put(companyActions.addCompany.success(data));
    yield put(settingsActions.setFormVisibility({ showForm: false, formType: 'ADD' }));
  } catch (error) {
    yield put(companyActions.addCompany.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleGetCompany({ payload }) {
  try {
    const { data } = yield call(companyApi.getCompany, payload);
    yield put(companyActions.getCompany.success({ formDetails: data }));
    yield put(settingsActions.setFormVisibility({ showForm: true, formType: 'EDIT' }));
    window.scrollTo(0, 40);
  } catch (error) {
    yield put(companyActions.getCompany.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleUpdateCompany({ payload }) {
  try {
    const { data } = yield call(companyApi.updateCompany, payload);
    yield put(companyActions.updateCompany.success({ guestId: payload.guestId, data }));
    yield put(settingsActions.setFormVisibility({ showForm: false, formType: 'ADD' }));
  } catch (error) {
    yield put(companyActions.updateCompany.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleDeleteCompany({ payload }) {
  try {
    // yield call(companyApi.deleteCompany, payload);
    // yield put(companyActions.deleteCompany.success(payload));

    const data = yield call(companyApi.deleteCompany, payload);
    if (data.data === false) {
      antMessage.warning("Company cannot be deleted because it's been used by other services", 3);
      yield put(companyActions.deleteCompany.success());
    } else {
      yield put(companyActions.deleteCompany.success(payload));
    }
  } catch (error) {
    yield put(companyActions.deleteCompany.failure(error));
    antMessage.error(error.message, 5);
  }
}

export default function* companyWatcher() {
  yield takeLatest(GET_COMPANIES[REQUEST], handleGetCompanies);
  yield takeLatest(ADD_COMPANY[REQUEST], handleAddCompany);
  yield takeLatest(GET_COMPANY[REQUEST], handleGetCompany);
  yield takeLatest(UPDATE_COMPANY[REQUEST], handleUpdateCompany);
  yield takeLatest(DELETE_COMPANY[REQUEST], handleDeleteCompany);
}
