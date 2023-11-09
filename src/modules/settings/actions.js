import { action } from '../common/actions';

export const SET_FORM_VISIBILITY = 'SET_FORM_VISIBILITY'
export const SET_FORM_DETAILS = 'SET_FORM_DETAILS'

const settingsActions = {
  setFormVisibility: (data) => action(SET_FORM_VISIBILITY, { payload: data }),
  setFormDetails: (data) => action(SET_FORM_DETAILS, { payload: data })
};

export default settingsActions;
