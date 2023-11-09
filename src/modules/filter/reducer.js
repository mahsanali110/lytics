import {
  GET_FILTER_REQUEST,
  GET_FILTER_SUCCESS,
  GET_FILTER_FAILURE,
  ADD_FILTER_REQUEST,
  ADD_FILTER_SUCCESS,
  ADD_FILTER_FAILURE,
  UPDATE_FILTER_REQUEST,
  UPDATE_FILTER_SUCCESS,
  UPDATE_FILTER_FAILURE,
  DELETE_FILTER_REQUEST,
  DELETE_FILTER_SUCCESS,
  DELETE_FILTER_FAILURE,
} from './types';
import {
  SAVE_PRESET,
  GET_ALL_PRESET,
  GET_SINGLE_PRESET,
  UPDATE_PRESET,
  DELETE_PRESET,
  SET_DEFAULT_VALUES,
} from './actions';
const initialState = {
  allFilters: [],
  filter: {},
  loading: false,
  error: false,
  presets: [],
  singlePreset: {},
  appliedPresetValue: {},
  defaultPreset: {},
};
function filterReducer(state = initialState, action) {
  switch (action.type) {
    // Preset Request
    case SAVE_PRESET.REQUEST:
    case GET_ALL_PRESET.REQUEST:
    case GET_SINGLE_PRESET.REQUEST:
    case UPDATE_PRESET.REQUEST:
    case DELETE_PRESET.REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
      };
    case SET_DEFAULT_VALUES.REQUEST:
      return {
        ...state,
        appliedPresetValue: action.payload,
        error: false,
      };
    case SAVE_PRESET.SUCCESS:
      return {
        ...state,
        presets: [...state.presets, action.payload],
        singlePreset: action.payload,
      };
    case GET_ALL_PRESET.SUCCESS:
      return {
        ...state,
        presets: action.payload,
        defaultPreset: action.payload.find(p => p.byDefaultSave === true),
      };
    case GET_SINGLE_PRESET.SUCCESS:
      return { ...state, singlePreset: action.payload };
    case UPDATE_PRESET.SUCCESS:
      return {
        ...state,
        presets: action.payload,
        defaultPreset: action.payload.find(p => p.byDefaultSave === true),
        singlePreset: action.payload.find(p => p.byDefaultSave === true),
        // [
        //   ...state.presets.map(prst => (prst.id === action.payload._id ? action.payload : prst)),
        // ],
      };
    case DELETE_PRESET.SUCCESS:
      return {
        ...state,
        presets: [...state.presets.filter(fltr => fltr.id !== action.payload.id)],
      };
    case SAVE_PRESET.FAILURE:
    case GET_ALL_PRESET.FAILURE:
    case GET_SINGLE_PRESET.FAILURE:
    case UPDATE_PRESET.FAILURE:
    case DELETE_PRESET.FAILURE:
      return { ...state, loading: false, error: action.payload.message };

    case GET_FILTER_REQUEST:
    case ADD_FILTER_REQUEST:
    case UPDATE_FILTER_REQUEST:
    case DELETE_FILTER_REQUEST:
      return { ...state, loading: true, error: false };
    case GET_FILTER_SUCCESS:
      return { ...state, allFilters: [...state.allFilters, action.payload] };
    case GET_FILTER_FAILURE:
      return '';

    case ADD_FILTER_SUCCESS:
      return { ...state, allFilters: [...state.allFilters, action.payload.data] };
    case ADD_FILTER_FAILURE:
      return '';

    case UPDATE_FILTER_SUCCESS:
      return '';
    case UPDATE_FILTER_FAILURE:
      return '';

    case DELETE_FILTER_SUCCESS:
      return '';
    case DELETE_FILTER_FAILURE:
      return '';
    default:
      return state;
  }
}
export default filterReducer;
