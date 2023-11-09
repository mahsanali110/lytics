import { call, put, takeLatest } from 'redux-saga/effects';
import { message as antMessage } from 'antd';

import { REQUEST } from '../common/actions';
import workAssessmentApi from '../../services/workAssessment';

import workAssessmentActions, {
    GET_WORK_ASSESSMENT
} from './actions';

export function* handleGetWorkAssessment({ payload }) {
    try {
      const { data } = yield call(workAssessmentApi.getWorkAssessment, payload);
      yield put(workAssessmentActions.getWorkAssesment.success({ workAssessments: data }));
    } catch (error) {
      yield put(workAssessmentActions.getWorkAssesment.failure(error));
      antMessage.error(error.message, 5);
    }
}

export default function* workAssessmentWatcher() {
    yield takeLatest(GET_WORK_ASSESSMENT[REQUEST], handleGetWorkAssessment)
  }