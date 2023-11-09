import { SET_DATA, UPDATE_LINK } from './actions';

const INITIAL_STATE = { index: 0, current: '', next: '', prev: '' };

const handleNav = (data, index) => ({
  index,
  current: data[index]?.id ?? '',
  next: data[index + 1]?.id ?? '',
  prev: data[index - 1]?.id ?? '',
});

export default (state = {}, { type, payload }) => {
  switch (type) {
    case SET_DATA:
      return { ...state, [payload.type]: { data: payload.data ?? payload, nav: INITIAL_STATE } };

    case UPDATE_LINK:
      return {
        ...state,
        [payload.type]: {
          ...state[payload.type],
          nav: handleNav(state[payload.type]?.data, payload.index),
        },
      };

    default:
      return state;
  }
};
