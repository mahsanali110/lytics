import _ from 'lodash';
import { GET_HOME_DATA } from './actions';

const initialState = {
  homeData: {},
};
const homeReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_HOME_DATA.REQUEST:
      return {
        ...state,
        homeData: {},
      };

    case GET_HOME_DATA.SUCCESS:
      return {
        ...state,
        homeData: payload,
      };

    case GET_HOME_DATA.FAILURE:
      return {
        ...state,
        error: payload.error,
      };

    default:
      return state;
  }
};

export default homeReducer;
