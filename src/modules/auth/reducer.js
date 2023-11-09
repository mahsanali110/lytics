import {
  CHECK_INTERNET,
  SIGNUP,
  SIGNIN,
  SIGNOUT,
  FORGOT_PASSWORD,
  CHANGE_PASSWORD,
  RESET_PASSWORD,
  SAVE_PRESET,
  GET_ALL_PRESET,
  GET_SINGLE_PRESET,
  UPDATE_PRESET,
  DELETE_PRESET,
} from './actions';
import { getUserId, getUser } from '../common/utils';
import { action } from 'modules/common/actions';

const initialState = {
  isLoggedIn: !!getUserId(),
  user: getUser(),
  loading: false,
  error: false,
  checkInternet: false,
};

function authReducer(state = initialState, { type, payload }) {
  switch (type) {
    case CHECK_INTERNET.SUCCESS:
      return {
        ...state,
        checkInternet: payload,
      };
    case SIGNUP.REQUEST:
      return { ...state, loading: true, error: false, isLoggedIn: false };

    case SIGNUP.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        data: payload.data,
        username: payload.data.user.username,
      };

    case SIGNUP.FAILURE:
      return {
        ...state,
        loading: false,
        error: payload.message,
        isLoggedIn: false,
      };

    case SIGNIN.REQUEST:
      return {
        ...state,
        username: payload,
        loading: true,
        error: false,
        isLoggedIn: false,
      };

    case SIGNIN.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        user: payload.user,
        isLoggedIn: true,
        mfaFormType: '',
        loginVisible: false,
      };

    case SIGNIN.FAILURE:
      return {
        ...state,
        loading: false,
        error: payload.message,
        isLoggedIn: false,
        user: payload.user,
        // mfaFormType: payload.mfaFormType ? 'signin' : ''
      };

    case SIGNOUT.REQUEST:
      return { ...state, loading: true, error: false };

    case SIGNOUT.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        isLoggedIn: false,
      };

    case SIGNOUT.FAILURE:
      return {
        ...state,
        loading: false,
        isLoggedIn: false,
        error: payload.message,
      };

    case FORGOT_PASSWORD.REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
        username: payload.email,
      };

    case FORGOT_PASSWORD.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        changePasswordVisible: true,
        forgotPasswordVisible: false,
        isForgotForm: true,
        data:payload.data
      };

    case FORGOT_PASSWORD.FAILURE:
      return {
        ...state,
        loading: false,
        error: payload.message,
      };

    case CHANGE_PASSWORD.REQUEST:
      return { ...state, loading: true, error: false };

    case CHANGE_PASSWORD.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        changePasswordVisible: false,
      };

    case CHANGE_PASSWORD.FAILURE:
      return {
        ...state,
        loading: false,
        error: payload.message,
      };
    
      case RESET_PASSWORD.REQUEST:
      return { ...state, loading: true, error: false };

    case RESET_PASSWORD.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
      };

    case RESET_PASSWORD.FAILURE:
      return {
        ...state,
        loading: false,
        error: payload.message,
      };

    default:
      return state;
  }
}

export default authReducer;
