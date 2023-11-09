import { REQUEST, SUCCESS, FAILURE, createRequestTypes, action } from '../common/actions';
export const RESET_FORM_DETAIL = 'Topic/RESET_FORM_DETAIL';
export const ADD_TOPIC = createRequestTypes('Topic/ADD_TOPIC');
export const GET_TOPICS = createRequestTypes('Topic/GET_TOPICS');
export const UPDATE_TOPIC = createRequestTypes('Topic/UPDATE_TOPIC');
export const DELETE_TOPIC = createRequestTypes('Topic/DELETE_TOPIC');
export const GET_TOPIC = createRequestTypes('Topic/GET_TOPIC');

const topicActions = {
  resetFormDetails: () => action(RESET_FORM_DETAIL),
  addTopic: {
    request: data => action(ADD_TOPIC[REQUEST], { payload: data }),
    success: data => action(ADD_TOPIC[SUCCESS], { payload: data }),
    failure: error => action(ADD_TOPIC[FAILURE], { payload: error }),
  },
  getTopics: {
    request: data => action(GET_TOPICS[REQUEST], { payload: data }),
    success: data => action(GET_TOPICS[SUCCESS], { payload: data }),
    failure: error => action(GET_TOPICS[FAILURE], { payload: error }),
  },
  getTopic: {
    request: data => action(GET_TOPIC[REQUEST], { payload: data }),
    success: data => action(GET_TOPIC[SUCCESS], { payload: data }),
    failure: error => action(GET_TOPIC[FAILURE], { payload: error }),
  },
  deleteTopic: {
    request: data => action(DELETE_TOPIC[REQUEST], { payload: data }),
    success: data => action(DELETE_TOPIC[SUCCESS], { payload: data }),
    failure: error => action(DELETE_TOPIC[FAILURE], { payload: error }),
  },
  updateTopic: {
    request: data => action(UPDATE_TOPIC[REQUEST], { payload: data }),
    success: data => action(UPDATE_TOPIC[SUCCESS], { payload: data }),
    failure: error => action(UPDATE_TOPIC[FAILURE], { payload: error }),
  },
};
export default topicActions;
