import { RESET_FORM_DETAILS, CREATE_JOB } from './actions';

const initialState = {
  formDetails: {},
  loading: false,
  error: false,
};

function printClipperReducer(state = initialState, { type, payload }) {
  switch (type) {
    case RESET_FORM_DETAILS:
      return { ...state, formDetails: { ...initialState.formDetails } };

    case CREATE_JOB.REQUEST:
      return {
        ...state,
        loading: true,
      };

    case CREATE_JOB.SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case CREATE_JOB.FAILURE:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}

export default printClipperReducer;
