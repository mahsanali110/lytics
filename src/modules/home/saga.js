import { put, takeLatest, call } from 'redux-saga/effects';

import { GET_HOME_DATA, actions } from './actions';
import homeApi from '../../services/home';

export function* handleGetHomeData(action) {
  try {
    const { data } = yield call(homeApi.getHomeData, action.payload);
    yield put(actions.getHomeData.success(data));
  } catch (error) {
    yield put(actions.getHomeData.failure(error));
  }
}

export function* handleGetHomeDataTakeLatest() {
  yield takeLatest(GET_HOME_DATA.REQUEST, handleGetHomeData);
}
