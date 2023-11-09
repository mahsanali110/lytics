import { GET_WORK_ASSESSMENT } from './actions';

const initialState = {
  workAssessments: [],
  loading: false,
  error: false,
};

function workAssessmentReducer(state = initialState, { type, payload }) {
  switch (type) {
    case GET_WORK_ASSESSMENT.REQUEST:
      return { ...state, loading: true };

    case GET_WORK_ASSESSMENT.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        ...payload,
      };
    case GET_WORK_ASSESSMENT.FAILURE:
      return {
        ...state,
        loading: false,
        error: payload.message,
      };
    default:
      return state;
  }
}
export default workAssessmentReducer;
