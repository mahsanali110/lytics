import {
  RESET_FORM_DETAILS,
  GET_GROUPS,
  ADD_GROUP,
  GET_GROUP,
  UPDATE_GROUP,
  DELETE_GROUP,
} from './actions';

import { convertComp, makeCompanyMap } from './utils';

const initialState = {
  formDetails: {
    name: '',
  },
  groups: [],
  logoPath: null,
  loading: false,
  error: false,
  groupCompanyMap: {},
};

function groupsReducer(state = initialState, { type, payload }) {
  switch (type) {
    case RESET_FORM_DETAILS:
      return { ...state, formDetails: initialState.formDetails };

    case GET_GROUPS.REQUEST:
      return { ...state, loading: true, ...payload, groupError: false };
    case ADD_GROUP.REQUEST:
    case GET_GROUP.REQUEST:
    case UPDATE_GROUP.REQUEST:
    case DELETE_GROUP.REQUEST:
      return { ...state, loading: true, error: false };

    case GET_GROUPS.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        groupCompanyMap: makeCompanyMap(payload.groups),
        ...payload,
      };
    case GET_GROUP.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        formDetails: convertComp(payload.formDetails),
      };

    case ADD_GROUP.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        groups: [payload, ...state.groups],
      };

    case UPDATE_GROUP.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        groups: [
          ...state.groups.map(group => {
            if (group.id === payload.groupId) return payload.data;
            else return group;
          }),
        ],
      };

    case DELETE_GROUP.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        groups: [...state.groups.filter(group => group.id !== payload)],
      };

    case GET_GROUPS.FAILURE:
      return { ...state, loading: false, groupError: payload.message };
    case ADD_GROUP.FAILURE:
    case GET_GROUP.FAILURE:
    case UPDATE_GROUP.FAILURE:
    case DELETE_GROUP.FAILURE:
      return {
        ...state,
        loading: false,
        error: payload.message,
      };

    default:
      return state;
  }
}

export default groupsReducer;
