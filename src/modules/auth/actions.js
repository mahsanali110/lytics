import { REQUEST, SUCCESS, FAILURE, createRequestTypes, action } from '../common/actions';
import { message as antMessage } from 'antd';

export const SIGNUP = createRequestTypes('SIGNUP');
export const CHECK_INTERNET = createRequestTypes('CHECK_INTERNET');
export const SIGNIN = createRequestTypes('SIGNIN');
export const CONFIRM_SIGNIN = createRequestTypes('CONFIRM_SIGNIN');
export const SIGNOUT = createRequestTypes('SIGNOUT');
export const FORGOT_PASSWORD = createRequestTypes('FORGOT_PASSWORD');

export const CHANGE_PASSWORD = createRequestTypes('CHANGE_PASSWORD');

export const RESET_PASSWORD = createRequestTypes('RESET_PASSWORD');

const authActions = {
  checkInternet: {
    request: data => action(CHECK_INTERNET[REQUEST], { payload: data }),
    success: data => {
      return action(CHECK_INTERNET[SUCCESS], { payload: data });
    },
    failure: error => {
      return action(CHECK_INTERNET[FAILURE], { payload: error });
    },
  },
  signup: {
    request: data => action(SIGNUP[REQUEST], { payload: data }),
    success: data => {
      return action(SIGNUP[SUCCESS], { payload: data });
    },
    failure: error => {
      return action(SIGNUP[FAILURE], { payload: error });
    },
  },

  signin: {
    request: data => action(SIGNIN[REQUEST], { payload: data }),
    success: data => {
      return action(SIGNIN[SUCCESS], { payload: data });
    },
    failure: error => {
      return action(SIGNIN[FAILURE], { payload: error });
    },
    saveUser: data => {
      return action(SIGNIN_SAVE_USER, { payload: data });
    },
  },

  signout: {
    request: data => {
      return action(SIGNOUT[REQUEST], { payload: data });
    },
    success: data => {
      return action(SIGNOUT[SUCCESS], { payload: data });
    },
    failure: error => {
      return action(SIGNOUT[FAILURE], { payload: error });
    },
  },

  forgotPassword: {
    request: data => action(FORGOT_PASSWORD[REQUEST], { payload: data }),
    success: data => {
      return action(FORGOT_PASSWORD[SUCCESS], { payload: data });
    },
    failure: error => {
      return action(FORGOT_PASSWORD[FAILURE], { payload: error });
    },
  },

  changePassword: {
    request: data => action(CHANGE_PASSWORD[REQUEST], { payload: data }),
    success: data => {
      return action(CHANGE_PASSWORD[SUCCESS], { payload: data });
    },
    failure: error => {
      return action(CHANGE_PASSWORD[FAILURE], { payload: error });
    },
  },

  resetPassword: {
    request: (data) => action(RESET_PASSWORD[REQUEST], { payload: data }),
    success: (data) => {
      return action(RESET_PASSWORD[SUCCESS], { payload: data });
    },
    failure: (error) => {
      return action(RESET_PASSWORD[FAILURE], { payload: error });
    },
  },
};

export default authActions;
