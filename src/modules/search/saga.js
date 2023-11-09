import { put, takeLatest, call } from 'redux-saga/effects';

import { GET_SEARCH_DATA, searchActions } from './actions';
import searchApi from '../../services/search';

export function* handleGetSearchData(action) {
  try {
    const { data } = yield call(searchApi.getSearchedData, action.payload);
    yield put(searchActions.getSearchedData.success(data));
  } catch (error) {
    yield put(searchActions.getSearchedData.failure(error));
  }
}

export function* handleGetSearchedDataTakeLatest() {
  yield takeLatest(GET_SEARCH_DATA.REQUEST, handleGetSearchData);
}
