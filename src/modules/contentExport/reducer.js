import {
  GET_EXPORT_JOB,
  CREATE_EXPORT_JOB,
  UPDATE_EXPORT_JOB,
  GET_EXPORT_BY_ID,
  DELETE_EXPORT_JOB,
  UPDATE_BY_FIELD,
  EXPORT_TO_DRIVE,
} from './action';

const initialState = {
  exportJobs: [],
  loading: false,
  error: false,
  job: {},
};

function contentExportReducer(state = initialState, { type, payload }) {
  switch (type) {
    case GET_EXPORT_JOB.REQUEST:
    case CREATE_EXPORT_JOB.REQUEST:
    case UPDATE_EXPORT_JOB.REQUEST:
    case DELETE_EXPORT_JOB.REQUEST:
      return { ...state, loading: true, error: false };

    case GET_EXPORT_JOB.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        exportJobs: payload,
      };
    case GET_EXPORT_BY_ID.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        job: payload,
      };

    case CREATE_EXPORT_JOB.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        exportJobs: [...state.exportJobs],
      };

    case UPDATE_EXPORT_JOB.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        exportJobs: state.exportJobs.map(job => (job.id === payload.id ? payload : job)),
        job: { ...payload },
      };

    case EXPORT_TO_DRIVE.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        exportJobs: state.exportJobs.map(job => (job.id === payload.id ? payload : job)),
        job: { ...payload },
      };

    //   case DELETE_ALARM.SUCCESS:
    //     return {
    //       ...state,
    //       loading: false,
    //       error: false,
    //       alarms: [...state.alarms.filter(alarm => alarm.id !== payload)],
    //     };
    case UPDATE_BY_FIELD:
      return { ...state, job: { ...state.job, [payload.field]: payload.value } };

    case GET_EXPORT_JOB.FAILURE:
    case GET_EXPORT_BY_ID.FAILURE:
    case CREATE_EXPORT_JOB.FAILURE:
    case UPDATE_EXPORT_JOB.FAILURE:
    case DELETE_EXPORT_JOB.FAILURE:
      return {
        ...state,
        loading: false,
        error: payload.message,
      };

    default:
      return state;
  }
}

export default contentExportReducer;
