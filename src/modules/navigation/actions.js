import { action } from '../common/actions';

export const SET_DATA = 'SET_DATA';
export const UPDATE_LINK = 'UPDATE_LINK';

export default {
  seData: payload => action(SET_DATA, { payload }),
  updateLink: payload => action(UPDATE_LINK, { payload }),
};
