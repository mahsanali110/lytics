import { createRequestTypes, action } from '../common/actions';

export const GET_SEARCH_DATA = createRequestTypes('GET_SEARCH_DATA');

export const searchActions = {
  getSearchedData: {
    request: data => action(GET_SEARCH_DATA.REQUEST, { payload: data }),
    success: data => {
      return action(GET_SEARCH_DATA.SUCCESS, { payload: data });
    },
    failure: error => {
      return action(GET_SEARCH_DATA.FAILURE, { payload: error });
    },
  },
};
