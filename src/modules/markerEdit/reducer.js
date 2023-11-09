import { UPDATE_BY_FIELD } from 'modules/jobs/actions';
import { DEFAULT_SEGMENT } from 'constants/options';
import { cloneDeep } from 'lodash';
import {
  updateSegmentTheme,
  updateSegmentTopic1,
  updateSegmentTopic2,
  updateSegmentTopic3,
  updateSegmentSummary,
  updateSegmentField,
  updateSegment,
  updateJobField,
} from './util';
import {
  ADD_GUEST,
  REMOVE_GUEST,
  UPDATE_GUEST,
  UPDATE_TREND,
  GET_MARKER_BY_ID,
  UPDATE_MARKER,
  ADD_THEME,
  UPDATE_THEME,
  REMOVE_THEME,
  UPDATE_ANCHOR,
  UPDATE_SUMMARY,
  UPDATE_ANALYSIS,
  UPDATE_GUEST_ANALYSIS,
  ADD_GUEST_ANALYSIS,
  REMOVE_GUEST_ANALYSIS,
  UPDATE_SEGMENT_TITLE,
  UPDATE_GUEST_SENTIMENT,
  UPDATE_ANAYSIS_SENTIMENT,
  UPDATE_ANCHOR_SENTIMENT,
  UPDATE_SUMMARY_SENTIMENT,
  UPDATE_SEGMENT_FIELD,
  CHANGE_SEGMENT_TOPIC1,
  CHANGE_SEGMENT_TOPIC2,
  CHANGE_SEGMENT_TOPIC3,
  UPDATE_HASHTAG,
  UPDATE_JOB_FIELD,
} from './actions';

import { CREATE_LIVE_JOB } from '../LiveClipping/actions';

import {
  removeFrom,
  updateArrOf,
  addGuestAnalysis,
  updateGuestAnalysis,
  removeGuestAnalysis,
} from './util';

const INITIAL_STATE = {
  guests: [],
  themes: [],
  segments: [cloneDeep(DEFAULT_SEGMENT)],
};

const markerEditReducer = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case UPDATE_GUEST_SENTIMENT.REQUEST:
    case GET_MARKER_BY_ID.REQUEST:
    case UPDATE_MARKER.REQUEST:
    case UPDATE_ANAYSIS_SENTIMENT.REQUEST:
    case UPDATE_ANCHOR_SENTIMENT.REQUEST:
    case UPDATE_SUMMARY_SENTIMENT.REQUEST:
      return { ...state, loading: payload.loading };

    case UPDATE_GUEST_SENTIMENT.SUCCESS:
    case UPDATE_ANAYSIS_SENTIMENT.SUCCESS:
    case UPDATE_ANCHOR_SENTIMENT.SUCCESS:
    case UPDATE_SUMMARY_SENTIMENT.SUCCESS:
      console.log(payload);
      return { ...state, loading: false, ...payload };
    case GET_MARKER_BY_ID.SUCCESS:
    case UPDATE_MARKER.SUCCESS:
      return {
        ...state,
        loading: false,
        ...payload,
        segments: payload.segments.length ? payload.segments : [cloneDeep(DEFAULT_SEGMENT)],
      };
    case 'CHANGE_SEGMENT_THEME':
      return {
        ...state,
        segments: updateSegmentTheme(
          [...state.segments],
          payload.index,
          payload.field,
          payload.value
        ),
      };

    case CHANGE_SEGMENT_TOPIC1:
      return {
        ...state,
        segments: updateSegmentTopic1([...state.segments], payload.index, payload.value),
      };

    case CHANGE_SEGMENT_TOPIC2:
      return {
        ...state,
        segments: updateSegmentTopic2([...state.segments], payload.index, payload.value),
      };

    case CHANGE_SEGMENT_TOPIC3:
      return {
        ...state,
        segments: updateSegmentTopic3([...state.segments], payload.index, payload.value),
      };

    case UPDATE_SEGMENT_FIELD:
      return {
        ...state,
        segments: updateSegmentField([...state.segments], { ...payload }),
      };

    case CREATE_LIVE_JOB.SUCCESS:
      return {
        ...state,
        segments: updateSegment([...state.segments], { ...payload }),
      };

    case 'UPDATE_PARTICIPANT':
      return {
        ...state,
        segments: updateSegmentSummary([...state.segments], payload),
      };

    case GET_MARKER_BY_ID.FAILURE:
    case UPDATE_ANAYSIS_SENTIMENT.FAILURE:
    case UPDATE_ANCHOR_SENTIMENT.FAILURE:
    case UPDATE_SUMMARY_SENTIMENT.FAILURE:
    case UPDATE_MARKER.FAILURE:
      return { ...state, loading: false, error: payload.error };

    // Guests
    case ADD_GUEST:
      return { ...state, guests: [...state.guests, payload] };

    case REMOVE_GUEST:
      return { ...state, guests: removeFrom([...state.guests], { index: payload }) };

    case UPDATE_GUEST:
      return { ...state, guests: updateArrOf([...state.guests], { ...payload }) };

    case UPDATE_SEGMENT_TITLE:
      return { ...state, segments: updateArrOf([...state.segments], { ...payload }) };

    // Theme
    case ADD_THEME:
      return { ...state, themes: [payload, ...state.themes] };

    case REMOVE_THEME:
      return { ...state, themes: removeFrom([...state.themes], { index: payload }) };

    case UPDATE_THEME:
      return { ...state, themes: updateArrOf([...state.themes], { ...payload }) };

    case UPDATE_BY_FIELD:
      return { ...state, [payload.field]: payload.value };

    // Segment Analysis
    case UPDATE_ANCHOR:
      return {
        ...state,
        segments: updateArrOf([...state.segments], {
          nestedKey: 'segmentAnalysis.anchor',
          ...payload,
        }),
      };
    case UPDATE_ANALYSIS:
      return {
        ...state,
        segments: updateArrOf([...state.segments], {
          nestedKey: 'segmentAnalysis.analysis',
          ...payload,
        }),
      };
    case UPDATE_TREND:
      const { key: field, ...rest } = payload;
      return {
        ...state,
        segments: updateArrOf([...state.segments], {
          field,
          nestedKey: 'segmentAnalysis.trend',
          ...rest,
        }),
      };
    case UPDATE_SUMMARY:
      return {
        ...state,
        segments: updateArrOf([...state.segments], {
          nestedKey: 'segmentAnalysis.summary',
          ...payload,
        }),
      };

    case UPDATE_HASHTAG:
      return {
        ...state,
        segments: updateArrOf([...state.segments], {
          ...payload,
        }),
      };

    // Guest Analysis
    case UPDATE_GUEST_ANALYSIS:
      return updateGuestAnalysis(state, payload);

    case ADD_GUEST_ANALYSIS:
      return addGuestAnalysis(state, payload);

    case REMOVE_GUEST_ANALYSIS:
      return removeGuestAnalysis(state, payload);

    case UPDATE_JOB_FIELD:
      return updateJobField(state, payload);

    default:
      return state;
  }
};
export default markerEditReducer;
