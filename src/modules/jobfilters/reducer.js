import { filterJobSources, readyJobStates } from 'constants/index';
import moment from 'moment';
const format = 'YYYY-MM-DDTHH:mm:ss';
const initialState = {
  statuses: [],
  filterPage: '',
  startDate: moment().format(format),
  endDate: moment().format(format),
  source: filterJobSources, // ! Must be up-to-date with new sources
  jobState:readyJobStates,
  limit: 30,
  searchText: '',
  escalation: [],
  association: [],
  channel: [],
  hosts: [],
  guest: [],
  programType: [],
};
const ADD_STATUS_REQUEST = 'ADD_STATUS_REQUEST';
const ADD_PAGE_REQUEST = 'ADD_PAGE_REQUEST';
const ADD_DATE_REQUEST = 'ADD_DATE_REQUEST';
const ADD_CURRENT_FILTER_DATA_REQUEST = 'ADD_CURRENT_FILTER_DATA_REQUEST';
const ADD_CURRENT_FILTER_DATA_SUCCESS = 'ADD_CURRENT_FILTER_DATA_SUCCESS';
const ADD_CURRENT_FILTER_DATA_FAILURE = 'ADD_CURRENT_FILTER_DATA_FAILURE';
const SET_DEFAULT_VALUES_REQUEST = 'SET_DEFAULT_VALUES_REQUEST';
export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_STATUS_REQUEST:
      return { ...state, statuses: action.payload };
    case ADD_PAGE_REQUEST:
      return { ...state, filterPage: action.payload };
    case ADD_DATE_REQUEST:
      return { ...state, startDate: action.payload[0], endDate: action.payload[1] };
    case ADD_CURRENT_FILTER_DATA_REQUEST:
      return { ...state, ...action.payload, loading: false, error: false };
    case ADD_CURRENT_FILTER_DATA_SUCCESS:
      return { ...state };
    case ADD_CURRENT_FILTER_DATA_FAILURE:
      return { ...state, ...action.payload, loading: false, error: false };
    case SET_DEFAULT_VALUES_REQUEST:
      return {
        ...state,
        startDate: '',
        endDate: '',
        source: '',
        limit: '',
        searchText: '',
        guest: '',
        escalation: '',
        association: '',
        page: '',
        jobState: [],
        channel: '',
        hosts: '',
        programType: '',
        jobState: [],
      };
    default:
      return { ...state };
  }
};
