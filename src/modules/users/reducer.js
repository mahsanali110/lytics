import {
  RESET_FORM_DETAILS,
  GET_CHANNELS,
  GET_ROLES,
  GET_USERS,
  ADD_USER,
  GET_USER,
  UPDATE_USER,
  DELETE_USER,
} from './actions';

import { convertCompObjectToId } from './utils';

const initialState = {
  users: [],
  formDetails: {
    firstName: '',
    lastName: '',
    title: '',
    userName: '',
    password: '',
    email: '',
    phoneNo: '',
    hideMedia: false,
    // suspended:false,
    subscription: {
      TV: [],
      print: [],
      websites: [],
      socialMedia: [],
      onlineVideos: [],
    },
    topics: [],
    keyWords: [],
    intelligence: {
      transcription: false,
      translation: false,
      sentiments: false,
      speakerRecognition: false,
    },
    reportTiming: 1,
    graphs: {
      topTopics: false,
      topGuests: false,
    },
    pannels: [
      {
        label: 'Library',
        name: 'library',
        isAssigned: true,
        template: { name: '' },
        path: '/libraries',
      },
      {
        label: 'Media Manager',
        name: 'mediamanager',
        isAssigned: true,
        template: { name: '' },
        path: '/mediamanager',
      },
      {
        label: 'Multiview',
        name: 'multiview',
        isAssigned: true,
        template: { name: '' },
        path: '/clientMultiview',
      },
      {
        label: 'Dashboard',
        name: 'dashboard',
        isAssigned: true,
        template: { name: '' },
        path: '/clientDashboard',
      },
      {
        label: 'Report',
        name: 'report',
        isAssigned: true,
        template: { name: '' },
        path: '/clientReports',
      },
      {
        label: 'Newsboard',
        name: 'newsboard',
        isAssigned: true,
        template: { name: '' },
        path: '/news-board',
      },
      {
        label: 'Newsboardnew',
        name: 'newsboardnew',
        isAssigned: true,
        template: { name: '' },
        path: '/news-board-new',
      },
    ],
  },
  roles: [],
  channels: [],
  loading: false,
  error: false,
};

function usersReducer(state = initialState, { type, payload }) {
  switch (type) {
    case RESET_FORM_DETAILS:
      return { ...state, formDetails: initialState.formDetails };

    case GET_CHANNELS.REQUEST:
      return { ...state, loading: true, ...payload, channelsError: false };
    case GET_ROLES.REQUEST:
      return { ...state, loading: true, ...payload, rolesError: false };
    case GET_USERS.REQUEST:
    case ADD_USER.REQUEST:
    case GET_USER.REQUEST:
    case UPDATE_USER.REQUEST:
    case DELETE_USER.REQUEST:
      return { ...state, loading: true };

    case GET_CHANNELS.SUCCESS:
    case GET_ROLES.SUCCESS:
    case GET_USERS.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        ...payload,
      };

    case GET_USER.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        formDetails: convertCompObjectToId(payload.formDetails),
      };

    case ADD_USER.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        users: [payload, ...state.users],
      };

    case UPDATE_USER.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        users: [
          ...state.users.map(user => {
            if (user.id === payload.userId) return payload.data;
            else return user;
          }),
        ],
      };

    case DELETE_USER.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        users: [...state.users.filter(user => user.id !== payload)],
      };

    case GET_CHANNELS.FAILURE:
      return { ...state, loading: false, channelsError: payload.message };
    case GET_ROLES.FAILURE:
      return { ...state, loading: false, rolesError: payload.message };
    case GET_USERS.FAILURE:
    case ADD_USER.FAILURE:
    case GET_USER.FAILURE:
    case UPDATE_USER.FAILURE:
    case DELETE_USER.FAILURE:
      return {
        ...state,
        loading: false,
        error: payload.message,
      };

    default:
      return state;
  }
}

export default usersReducer;
