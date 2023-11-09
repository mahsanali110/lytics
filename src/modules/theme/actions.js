import { REQUEST, SUCCESS, FAILURE, createRequestTypes, action } from '../common/actions';
export const RESET_FORM_DETAIL = 'Themes/RESET_FORM_DETAIL';
export const ADD_THEME = createRequestTypes('Themes/ADD_THEME');
export const GET_THEMES = createRequestTypes('Themes/GET_THEMES');
export const UPDATE_THEME = createRequestTypes('Themes/UPDATE_THEME');
export const DELETE_THEME = createRequestTypes('Themes/DELETE_THEME');
export const GET_THEME = createRequestTypes('Themes/GET_THEME');

const themesActions = {
  resetFormDetails: () => action(RESET_FORM_DETAIL),
  addTheme: {
    request: data => action(ADD_THEME[REQUEST], { payload: data }),
    success: data => action(ADD_THEME[SUCCESS], { payload: data }),
    failure: error => action(ADD_THEME[FAILURE], { payload: error }),
  },
  getThemes: {
    request: data => action(GET_THEMES[REQUEST], { payload: data }),
    success: data => action(GET_THEMES[SUCCESS], { payload: data }),
    failure: error => action(GET_THEMES[FAILURE], { payload: error }),
  },
  getTheme: {
    request: data => action(GET_THEME[REQUEST], { payload: data }),
    success: data => action(GET_THEME[SUCCESS], { payload: data }),
    failure: error => action(GET_THEME[FAILURE], { payload: error }),
  },
  deleteTheme: {
    request: data => action(DELETE_THEME[REQUEST], { payload: data }),
    success: data => action(DELETE_THEME[SUCCESS], { payload: data }),
    failure: error => action(DELETE_THEME[FAILURE], { payload: error }),
  },
  updateTheme: {
    request: data => action(UPDATE_THEME[REQUEST], { payload: data }),
    success: data => action(UPDATE_THEME[SUCCESS], { payload: data }),
    failure: error => action(UPDATE_THEME[FAILURE], { payload: error }),
  },
};
export default themesActions;
