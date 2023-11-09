import {
  ADD_THEME,
  DELETE_THEME,
  GET_THEME,
  GET_THEMES,
  UPDATE_THEME,
  RESET_FORM_DETAIL,
} from './actions';

const initialState = {
  themeRecords: [],
  limit: 10,
  page: 1,
  totalPages: 1,
  totalResults: 0,
  formDetails: {
    name: '',
    description: '',
    subTheme: [],
  },
  loading: false,
  error: false,
};

function themesReducer(state = initialState, { type, payload }) {
  switch (type) {
    case RESET_FORM_DETAIL:
      return { ...state, formDetails: initialState.formDetails };
    case UPDATE_THEME.REQUEST:
    case GET_THEME.REQUEST:
    case DELETE_THEME.REQUEST:
    case GET_THEMES.REQUEST:
      return { ...state, loading: true, ...payload, themesError: false };
    case ADD_THEME.REQUEST:
      return { ...state, loading: true, error: false };
    case GET_THEME.SUCCESS:
    case GET_THEMES.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        ...payload,
      };
    case ADD_THEME.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        themeRecords: [...state.themeRecords, payload],
      };
    case DELETE_THEME.SUCCESS: {
      return {
        ...state,
        loading: false,
        error: false,
        themeRecords: [...state.themeRecords.filter(theme => theme.id !== payload)],
      };
    }
    case UPDATE_THEME.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        themeRecords: [
          ...state.themeRecords.map(theme => {
            if (theme.id === payload.themeId) return payload.data;
            else return theme;
          }),
        ],
      };
    case GET_THEME.FAILURE:
    case DELETE_THEME.FAILURE:
    case GET_THEMES.FAILURE:
      return { ...state, loading: false, themesError: payload.message };
    case ADD_THEME.FAILURE:
    case UPDATE_THEME.FAILURE:
      return {
        ...state,
        loading: false,
        error: payload.message,
      };

    default:
      return state;
  }
}

export default themesReducer;
