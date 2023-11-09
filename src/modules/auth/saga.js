import { call, take, put, select, takeLatest } from 'redux-saga/effects';
import { message as antMessage } from 'antd';
import { push } from 'connected-react-router';
import authActions, {
  CHECK_INTERNET,
  SIGNUP,
  SIGNIN,
  SIGNOUT,
  FORGOT_PASSWORD,
  CHANGE_PASSWORD,
  RESET_PASSWORD,
} from './actions';
import { action, REQUEST } from '../common/actions';
import {
  signup,
  signin,
  signout,
  checkInternet,
  forgotPassword,
  changePassword,
  resetPassword,
} from '../../services/auth';
import { unSetSessionCookies, setSessionCookies } from '../common/utils';
import React from 'react';
import { Alert, Button, Space } from 'antd';

const forcedLogin = action => {
  action.payload.forced = 'true';
  handleSigninSubmit(action);
};

export function* handleSignupSubmit() {
  while (true) {
    try {
      const { payload } = yield take(SIGNUP[REQUEST]);
      const data = yield call(signup, payload);
      yield put(authActions.signup.success(data));
    } catch (error) {}
  }
}

export function* handleInternetCheck(action) {
  sessionStorage.removeItem('internet');
  try {
    const { data } = yield call(checkInternet, action.payload);
    yield put(authActions.checkInternet.success(data));
    sessionStorage.removeItem('internet');
    data === true
      ? sessionStorage.setItem('internet', data)
      : sessionStorage.setItem('internet', 'false');
  } catch (error) {
    sessionStorage.removeItem('internet');
    sessionStorage.setItem('internet', 'false');
    yield put(authActions.checkInternet.failure(error));
    console.error('internet not available: ', error.message);
  }
}

export function* handleSigninRequest(action) {
  try {
    const { data } = yield call(signin, action.payload);
    yield put(authActions.signin.success(data));
    setSessionCookies({ user: data.user, tokens: data.tokens });
  } catch (error) {
    if (error.message === 'Request failed with status code 400') {
    } else if (error.message === 'Request failed with status code 401') {
    } else if (error.message === 'Request failed with status code 503') {
      antMessage.error('Maximum Active Sessions');
    } else if (error.message === 'Request failed with status code 502') {
      antMessage.error('Your account has been suspended. Contact Admin');
    } else {
      antMessage.error('Interval Server Error');
    }
    yield put(authActions.signin.failure(error));
  }
}

export function* handleSigninSubmit() {
  yield takeLatest(SIGNIN.REQUEST, handleSigninRequest);
}

export function* handleInternetKey() {
  yield takeLatest(CHECK_INTERNET.REQUEST, handleInternetCheck);
}

export function* handleSignout() {
  while (true) {
    try {
      const { payload } = yield take(SIGNOUT[REQUEST]);
      yield call(signout, 'true');

      unSetSessionCookies();
      yield put(authActions.signout.success());
      window.location.href = '/';
    } catch (error) {
      const { code, message } = error;
      yield put(authActions.signout.success({ code, message }));
    }
  }
}

export function* handleForgotPassword() {
  while (true) {
    try {
      const { payload } = yield take(FORGOT_PASSWORD[REQUEST]);
      const data = yield call(forgotPassword, payload);
      yield put(authActions.forgotPassword.success(data));
    } catch (error) {
      const { code, message } = error;
      yield put(authActions.forgotPassword.failure({ code, message }));
      antMessage.error(message, 5);
    }
  }
}

export function* handleChangePassword() {
  while (true) {
    try {
      const { payload } = yield take(CHANGE_PASSWORD[REQUEST]);
      const data = yield call(changePassword, payload);
      yield put(authActions.changePassword.success(data));
      antMessage.success('Your password is changed!', 1);
      setTimeout(() => (window.location.href = '/dashboard'), 1000);
    } catch (error) {
      const { code, message } = error;
      yield put(authActions.changePassword.failure({ code, message }));
      antMessage.error(message, 5);
    }
  }
}

export function* handleResetPassword() {
  while (true) {
    try {
      const { payload } = yield take(RESET_PASSWORD[REQUEST]);
      const data = yield call(resetPassword, payload);
      yield put(authActions.resetPassword.success(data));
      antMessage.success('Your password is changed!', 1);
      setTimeout(() => (window.location.href = '/login'), 1000);
    } catch (error) {
      const { code, message } = error;
      yield put(authActions.resetPassword.failure({ code, message }));
      antMessage.error(message, 5);
    }
  }
}
