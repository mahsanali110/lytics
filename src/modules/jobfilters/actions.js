const ADD_STATUS_REQUEST = 'ADD_STATUS_REQUEST';
const ADD_STATUS_SUCCESS = 'ADD_STATUS_SUCCESS';
const ADD_STATUS_FAILURE = 'ADD_STATUS_FAILURE';
const ADD_PAGE_REQUEST = 'ADD_PAGE_REQUEST';
const ADD_PAGE_SUCCESS = 'ADD_PAGE_SUCCESS';
const ADD_PAGE_FAILURE = 'ADD_PAGE_FAILURE';
const ADD_DATE_REQUEST = 'ADD_DATE_REQUEST';
const ADD_DATE_SUCCESS = 'ADD_DATE_SUCCESS';
const ADD_DATE_FAILURE = 'ADD_DATE_FAILURE';
const ADD_CURRENT_FILTER_DATA_REQUEST = 'ADD_CURRENT_FILTER_DATA_REQUEST';
const ADD_CURRENT_FILTER_DATA_SUCCESS = 'ADD_CURRENT_FILTER_DATA_SUCCESS';
const ADD_CURRENT_FILTER_DATA_FAILURE = 'ADD_CURRENT_FILTER_DATA_FAILURE';
const SET_DEFAULT_VALUES_REQUEST = 'SET_DEFAULT_VALUES_REQUEST';
const jobfilters = {
  addstatus: {
    request: data => {
      return { type: ADD_STATUS_REQUEST, payload: data };
    },
    success: data => {
      return { type: ADD_STATUS_SUCCESS, payload: data };
    },
    failure: error => {
      return { type: ADD_STATUS_FAILURE, payload: error };
    },
  },
  addPage: {
    request: data => {
      return { type: ADD_PAGE_REQUEST, payload: data };
    },
    success: data => {
      return { type: ADD_PAGE_SUCCESS, payload: data };
    },
    failure: error => {
      return { type: ADD_PAGE_FAILURE, payload: error };
    },
  },
  addDate: {
    request: data => {
      return { type: ADD_DATE_REQUEST, payload: data };
    },
    success: data => {
      return { type: ADD_DATE_SUCCESS, payload: data };
    },
    failure: error => {
      return { type: ADD_DATE_FAILURE, payload: error };
    },
  },
  addcurrentFilterData: {
    request: data => {
      return { type: ADD_CURRENT_FILTER_DATA_REQUEST, payload: data };
    },
    success: data => {
      return { type: ADD_CURRENT_FILTER_DATA_SUCCESS, payload: data };
    },
    failure: error => {
      return { type: ADD_CURRENT_FILTER_DATA_FAILURE, payload: data };
    },
  },
  setDefaultValues: {
    request: data => {
      return { type: SET_DEFAULT_VALUES_REQUEST, payload: data };
    },
  },
};
export default jobfilters;
