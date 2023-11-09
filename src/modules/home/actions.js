import { createRequestTypes, action } from '../common/actions';

export const GET_HOME_DATA = createRequestTypes('GET_HOME_DATA');

export const actions = {
  getHomeData: {
    request: (data) => action(GET_HOME_DATA.REQUEST, { payload: data }),
    success: (data) => {
      return action(GET_HOME_DATA.SUCCESS, { payload: data });
    },
    failure: (error) => {
      return action(GET_HOME_DATA.FAILURE, { payload: error });
    },
  },
};
