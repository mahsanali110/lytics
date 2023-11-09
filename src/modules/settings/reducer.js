import { SET_FORM_VISIBILITY, SET_FORM_DETAILS } from './actions';

const initialState = {
  formDetails: {},
  showForm: false,
  formType: 'ADD', // ADD|EDIT
};

function settingsReducer(state = initialState, { type, payload }) {
  switch (type) {
    case SET_FORM_VISIBILITY:
      return { ...state, ...payload };
    case SET_FORM_DETAILS:
      return { ...state, formDetails: payload };
    default:
      return state;
  }
}

export default settingsReducer;
