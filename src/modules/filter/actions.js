// import { REQUEST, SUCCESS, FAILURE, createRequestTypes, action } from '../common/actions';
import {
  GET_FILTER_REQUEST,
  GET_FILTER_SUCCESS,
  GET_FILTER_FAILURE,
  ADD_FILTER_REQUEST,
  ADD_FILTER_SUCCESS,
  ADD_FILTER_FAILURE,
  UPDATE_FILTER_REQUEST,
  UPDATE_FILTER_SUCCESS,
  UPDATE_FILTER_FAILURE,
  DELETE_FILTER_REQUEST,
  DELETE_FILTER_SUCCESS,
  DELETE_FILTER_FAILURE,
} from './types';
import { REQUEST, SUCCESS, FAILURE, createRequestTypes, action } from '../common/actions';
export const SAVE_PRESET = createRequestTypes('SAVE_PRESET');
export const SET_DEFAULT_VALUES = createRequestTypes('SET_DEFAULT_VALUES');
export const GET_ALL_PRESET = createRequestTypes('GET_ALL_PRESET');
export const GET_SINGLE_PRESET = createRequestTypes('GET_SINGLE_PRESET');
export const UPDATE_PRESET = createRequestTypes('UPDATE_PRESET');
export const DELETE_PRESET = createRequestTypes('DELETE_PRESET');
const filterActions = {
  getFilters: {
    request: data => {
      return { type: GET_FILTER_REQUEST, payload: data };
    },
    success: data => {
      return { type: GET_FILTER_SUCCESS, payload: data };
    },
    failure: error => {
      return { type: GET_FILTER_FAILURE, payload: error };
    },
  },
  addFilter: {
    request: data => {
      return { type: ADD_FILTER_REQUEST, payload: data };
    },
    success: data => {
      return { type: ADD_FILTER_SUCCESS, payload: data };
    },
    failure: error => {
      return { type: ADD_FILTER_FAILURE, payload: error };
    },
  },
  updateFilter: {
    request: data => {
      return { type: UPDATE_FILTER_REQUEST, payload: data };
    },
    success: data => {
      return { type: UPDATE_FILTER_SUCCESS, payload: data };
    },
    failure: error => {
      return { type: UPDATE_FILTER_FAILURE, payload: error };
    },
  },
  deleteFilter: {
    request: data => {
      return { type: DELETE_FILTER_REQUEST, payload: data };
    },
    success: data => {
      return { type: DELETE_FILTER_SUCCESS, payload: data };
    },
    failure: error => {
      return { type: DELETE_FILTER_FAILURE, payload: error };
    },
  },
  savePreset: {
    request: data => action(SAVE_PRESET[REQUEST], { payload: data }),
    success: data => action(SAVE_PRESET[SUCCESS], { payload: data }),
    failure: error => action(SAVE_PRESET[FAILURE], { payload: error }),
  },
  getAllPreset: {
    request: data => action(GET_ALL_PRESET[REQUEST], { payload: data }),
    success: data => action(GET_ALL_PRESET[SUCCESS], { payload: data }),
    failure: error => action(GET_ALL_PRESET[FAILURE], { payload: error }),
  },
  getSinglePreset: {
    request: data => action(GET_SINGLE_PRESET[REQUEST], { payload: data }),
    success: data => action(GET_SINGLE_PRESET[SUCCESS], { payload: data }),
    failure: error => action(GET_SINGLE_PRESET[FAILURE], { payload: error }),
  },
  updatePreset: {
    request: data => action(UPDATE_PRESET[REQUEST], { payload: data }),
    success: data => action(UPDATE_PRESET[SUCCESS], { payload: data }),
    failure: error => action(UPDATE_PRESET[FAILURE], { payload: error }),
  },
  deletePreset: {
    request: data => action(DELETE_PRESET[REQUEST], { payload: data }),
    success: data => action(DELETE_PRESET[SUCCESS], { payload: data }),
    failure: error => action(DELETE_PRESET[FAILURE], { payload: error }),
  },
  defaultPreset: {
    request: data => action(SET_DEFAULT_VALUES[REQUEST], { payload: data }),
  },
};
export default filterActions;
