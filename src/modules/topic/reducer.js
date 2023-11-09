import {
  ADD_TOPIC,
  DELETE_TOPIC,
  GET_TOPIC,
  GET_TOPICS,
  UPDATE_TOPIC,
  RESET_FORM_DETAIL,
} from './actions';

const initialState = {
  topicRecords: [],
  limit: 10,
  page: 1,
  totalPages: 1,
  totalResults: 0,
  formDetails: {
    name: '',
    color: '',
    description: '',
    topic2: [],
  },
  loading: false,
  error: false,
};

function topicsReducer(state = initialState, { type, payload }) {
  switch (type) {
    case RESET_FORM_DETAIL:
      return { ...state, formDetails: initialState.formDetails };
    case UPDATE_TOPIC.REQUEST:
    case GET_TOPIC.REQUEST:
    case DELETE_TOPIC.REQUEST:
    case GET_TOPICS.REQUEST:
      return { ...state, loading: true, ...payload, topicsError: false };
    case ADD_TOPIC.REQUEST:
      return { ...state, loading: true, error: false };
    case GET_TOPIC.SUCCESS:
    case GET_TOPICS.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        ...payload,
      };
    case ADD_TOPIC.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        topicRecords: [...state.topicRecords, payload],
      };
    case DELETE_TOPIC.SUCCESS: {
      return {
        ...state,
        loading: false,
        error: false,
        topicRecords: [...state.topicRecords.filter(topic => topic.id !== payload)],
      };
    }
    case UPDATE_TOPIC.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        topicRecords: [
          ...state.topicRecords.map(topic => {
            if (topic.id === payload.topicId) return payload.data;
            else return topic;
          }),
        ],
      };
    case GET_TOPIC.FAILURE:
    case DELETE_TOPIC.FAILURE:
    case GET_TOPICS.FAILURE:
      return { ...state, loading: false, topicsError: payload.message };
    case ADD_TOPIC.FAILURE:
    case UPDATE_TOPIC.FAILURE:
      return {
        ...state,
        loading: false,
        error: payload.message,
      };

    default:
      return state;
  }
}

export default topicsReducer;
