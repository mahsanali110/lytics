import _ from 'lodash';
import { GET_SEARCH_DATA } from './actions';

const initialState = {
  searchedData: {},
};
const searchReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_SEARCH_DATA.REQUEST:
      return {
        ...state,
        searchedData: {},
      };

    case GET_SEARCH_DATA.SUCCESS:
      return {
        ...state,
        searchedData: payload,
      };

    case GET_SEARCH_DATA.FAILURE:
      return {
        ...state,
        error: payload.error,
      };

    default:
      return state;
  }
};

export default searchReducer;
