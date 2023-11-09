import {
  RESET_FORM_DETAILS,
  GET_COMPANIES,
  ADD_COMPANY,
  GET_COMPANY,
  UPDATE_COMPANY,
  DELETE_COMPANY,
} from './action';

const initialState = {
  formDetails: {
    name: '',
    companyId: '',
    contact: '',
    maxUsers: '0',
    maxTopics: '0',
    maxTvChannels: '0',
    maxPrints: '0',
    maxWebsites: '0',
    maxSocialMedia: '0',
    maxOnlineVideos: '0',
    maxKeyWords: '0',
  },
  companies: [],
  logoPath: null,
  loading: false,
  error: false,
};

function companyReducer(state = initialState, { type, payload }) {
  switch (type) {
    case RESET_FORM_DETAILS:
      return { ...state, formDetails: initialState.formDetails };

    case GET_COMPANIES.REQUEST:
      return { ...state, loading: true, ...payload, companiesError: false };
    case ADD_COMPANY.REQUEST:
    case GET_COMPANY.REQUEST:
    case UPDATE_COMPANY.REQUEST:
    case DELETE_COMPANY.REQUEST:
      return { ...state, loading: true, error: false };

    case GET_COMPANIES.SUCCESS:
    case GET_COMPANY.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        ...payload,
      };

    case ADD_COMPANY.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        companies: [payload, ...state.companies],
      };

    case UPDATE_COMPANY.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        companies: [
          ...state.companies.map(company => {
            if (company.id === payload.companyId) return payload.data;
            else return company;
          }),
        ],
      };

    case DELETE_COMPANY.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        companies: [...state.companies.filter(company => company.id !== payload)],
      };

    case GET_COMPANIES.FAILURE:
      return { ...state, loading: false, companiesError: payload.message };
    case ADD_COMPANY.FAILURE:
    case GET_COMPANY.FAILURE:
    case UPDATE_COMPANY.FAILURE:
    case DELETE_COMPANY.FAILURE:
      return {
        ...state,
        loading: false,
        error: payload.message,
      };

    default:
      return state;
  }
}

export default companyReducer;
