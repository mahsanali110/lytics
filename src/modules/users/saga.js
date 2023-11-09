import { call, put, takeLatest } from 'redux-saga/effects';
import { message as antMessage } from 'antd';

import Settings from '../settings/actions';
import { REQUEST } from '../common/actions';
import usersApi from '../../services/users';
import usersActions, {
  GET_ROLES,
  GET_CHANNELS,
  GET_USERS,
  ADD_USER,
  GET_USER,
  UPDATE_USER,
  DELETE_USER,
} from './actions';
import { setUserData, unSetUserData } from 'modules/common/utils';

export function* handleGetRoles({ payload }) {
  try {
    const { data } = yield call(usersApi.getRoles, payload);
    yield put(usersActions.getRoles.success({ roles: data.results }));
  } catch (error) {
    yield put(usersActions.getRoles.failure(error));
    // antMessage.error(error.message, 5);
  }
}

export function* handleGetChannels({ payload }) {
  try {
    const { data } = yield call(usersApi.getChannels, payload);
    yield put(usersActions.getChannels.success({ channels: data.results }));
  } catch (error) {
    yield put(usersActions.getChannels.failure(error));
    // antMessage.error(error.message, 5);
  }
}

export function* handleGetUsers({ payload }) {
  try {
    const { data } = yield call(usersApi.getUsers, payload);
    yield put(usersActions.getUsers.success({ users: data.results }));
  } catch (error) {
    yield put(usersActions.getUsers.failure(error));
    antMessage.error(error.message, 5);
  }
}
export function* handleAddUser({ payload }) {
  try {
    const { data } = yield call(usersApi.addUser, payload);

    yield put(usersActions.addUser.success(data));
    yield put(Settings.setFormVisibility({ showForm: false, formType: 'ADD' }));
  } catch (error) {
    yield put(usersActions.addUser.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleGetUser({ payload }) {
  try {
    const { data } = yield call(usersApi.getUser, payload);
    yield put(usersActions.getUser.success({ formDetails: data }));
    yield put(Settings.setFormVisibility({ showForm: true, formType: 'EDIT' }));
    window.scrollTo(0, 40);
  } catch (error) {
    yield put(usersActions.getUser.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleUpdateUser({ payload }) {
  try {
    const { data } = yield call(usersApi.updateUser, payload);
    yield put(usersActions.updateUser.success({ userId: payload.userId, data }));
    antMessage.success('User updated successfully!', 3);
    yield put(Settings.setFormVisibility({ showForm: false, formType: 'ADD' }));
  } catch (error) {
    yield put(usersActions.updateUser.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleDeleteUser({ payload }) {
  try {
    yield call(usersApi.deleteUser, payload);
    yield put(usersActions.deleteUser.success(payload));
  } catch (error) {
    yield put(usersActions.deleteUser.failure(error));
    antMessage.error(error.message, 5);
  }
}

export default function* usersWatcher() {
  yield takeLatest(GET_CHANNELS[REQUEST], handleGetChannels);
  yield takeLatest(GET_ROLES[REQUEST], handleGetRoles);
  yield takeLatest(GET_USERS[REQUEST], handleGetUsers);
  yield takeLatest(ADD_USER[REQUEST], handleAddUser);
  yield takeLatest(GET_USER[REQUEST], handleGetUser);
  yield takeLatest(UPDATE_USER[REQUEST], handleUpdateUser);
  yield takeLatest(DELETE_USER[REQUEST], handleDeleteUser);
}
