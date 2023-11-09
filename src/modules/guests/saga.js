import { call, put, takeLatest } from 'redux-saga/effects';
import { message as antMessage } from 'antd';

import settingsActions from '../settings/actions';
import { REQUEST } from '../common/actions';
import guestsApi from '../../services/guests';
import guestsActions, {
  GET_ASSOCIATIONS,
  GET_GUESTS,
  ADD_GUEST,
  GET_GUEST,
  UPDATE_GUEST,
  DELETE_GUEST,
} from './actions';

export function* handleGetAssociations({ payload }) {
  try {
    const {
      data: { results, ...pagination },
    } = yield call(guestsApi.getAssociations, payload);
    yield put(guestsActions.getAssociations.success({ associations: results, pagination }));
  } catch (error) {
    yield put(guestsActions.getAssociations.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleGetGuests({ payload }) {
  try {
    const {
      data: { results, ...pagination },
    } = yield call(guestsApi.getGuests, payload);
    yield put(guestsActions.getGuests.success({ guests: results, pagination }));
  } catch (error) {
    yield put(guestsActions.getGuests.failure(error));
    // antMessage.error(error.message, 5);
  }
}
export function* handleAddGuest({ payload }) {
  try {
    console.log({ guestPayload: payload });
    const { data } = yield call(guestsApi.addGuest, payload);
    yield put(guestsActions.addGuest.success(data));
    yield put(settingsActions.setFormVisibility({ showForm: false, formType: 'ADD' }));
  } catch (error) {
    yield put(guestsActions.addGuest.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleGetGuest({ payload }) {
  try {
    const { data } = yield call(guestsApi.getGuest, payload);
    yield put(guestsActions.getGuest.success({ formDetails: data }));
    yield put(settingsActions.setFormVisibility({ showForm: true, formType: 'EDIT' }));
    window.scrollTo(0, 40);
  } catch (error) {
    yield put(guestsActions.getGuest.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleUpdateGuest({ payload }) {
  try {
    const { data } = yield call(guestsApi.updateGuest, payload);
    yield put(guestsActions.updateGuest.success({ guestId: payload.guestId, data }));
    yield put(settingsActions.setFormVisibility({ showForm: false, formType: 'ADD' }));
  } catch (error) {
    yield put(guestsActions.updateGuest.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleDeleteGuest({ payload }) {
  try {
    // yield call(guestsApi.deleteGuest, payload);
    // yield put(guestsActions.deleteGuest.success(payload));

    const data = yield call(guestsApi.deleteGuest, payload);
    if (data.data === false) {
      antMessage.warning("Guest cannot be deleted because it's been used by other services", 3);
      yield put(guestsActions.deleteGuest.success());
    } else {
      yield put(guestsActions.deleteGuest.success(payload));
    }
  } catch (error) {
    yield put(guestsActions.deleteGuest.failure(error));
    antMessage.error(error.message, 5);
  }
}

export default function* guestsWatcher() {
  yield takeLatest(GET_ASSOCIATIONS[REQUEST], handleGetAssociations);
  yield takeLatest(GET_GUESTS[REQUEST], handleGetGuests);
  yield takeLatest(ADD_GUEST[REQUEST], handleAddGuest);
  yield takeLatest(GET_GUEST[REQUEST], handleGetGuest);
  yield takeLatest(UPDATE_GUEST[REQUEST], handleUpdateGuest);
  yield takeLatest(DELETE_GUEST[REQUEST], handleDeleteGuest);
}
