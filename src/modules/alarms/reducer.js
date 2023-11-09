import {
  RESET_FORM_DETAILS,
  GET_ALARMS,
  ADD_ALARM,
  GET_ALARM,
  UPDATE_ALARM,
  DELETE_ALARM,
} from './actions';

const initialState = {
  alarms: [],
  thresholdProgram: 1,
  thresholdDay: 1,
  formDetails: {
    queryWord: '',
    language: '',
  },
  loading: false,
  error: false,
};

function alarmReducer(state = initialState, { type, payload }) {
  switch (type) {
    case RESET_FORM_DETAILS:
      return { ...state, formDetails: initialState.formDetails };

    case GET_ALARMS.REQUEST:
      return { ...state, loading: true, ...payload, alarmsError: false };
    case ADD_ALARM.REQUEST:
    case GET_ALARM.REQUEST:
    case UPDATE_ALARM.REQUEST:
    case DELETE_ALARM.REQUEST:
      return { ...state, loading: true, error: false };

    case GET_ALARMS.SUCCESS:
    case GET_ALARM.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        ...payload,
      };

    case ADD_ALARM.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        alarms: [payload.formDetails, ...state.alarms],
      };

    case UPDATE_ALARM.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        alarms: [
          ...state.alarms.map(alarm => {
            if (alarm.id === payload.alarmId) return payload.data;
            else return alarm;
          }),
        ],
      };

    case DELETE_ALARM.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        alarms: [...state.alarms.filter(alarm => alarm.id !== payload)],
      };

    case GET_ALARMS.FAILURE:
      return { ...state, loading: false, alarmsError: payload.message };
    case ADD_ALARM.FAILURE:
    case GET_ALARM.FAILURE:
    case UPDATE_ALARM.FAILURE:
    case DELETE_ALARM.FAILURE:
      return {
        ...state,
        loading: false,
        error: payload.message,
      };

    default:
      return state;
  }
}

export default alarmReducer;
