import { put, takeLatest, call } from 'redux-saga/effects';

import { GET_TALKSHOW_REPORT, pdfReport } from './action';
import reportApi from 'services/report';
export function* handleGetReport({ payload }) {
  try {
    const { data } = yield call(reportApi.getReportApi, payload);
    yield put(pdfReport.getTalkShowReport.success({ report: data }));
  } catch (error) {
    yield put(pdfReport.getTalkShowReport.failure(error));
  }
}

export function* handleReport() {
  yield takeLatest(GET_TALKSHOW_REPORT.REQUEST, handleGetReport);
}
