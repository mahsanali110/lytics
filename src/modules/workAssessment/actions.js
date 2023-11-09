import { REQUEST, SUCCESS, FAILURE, createRequestTypes, action } from '../common/actions';

export const GET_WORK_ASSESSMENT = createRequestTypes('GET_WORK_ASSESSMENT');

const workAssessmentActions = {
    getWorkAssesment: {
        request: ( data ) => action(GET_WORK_ASSESSMENT[REQUEST], { payload: data}),
        success: ( data ) => action(GET_WORK_ASSESSMENT[SUCCESS], { payload: data}),
        failure: ( data ) => action(GET_WORK_ASSESSMENT[FAILURE], { payload: error})
    }
}

export default workAssessmentActions;