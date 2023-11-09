import { call, put, takeLatest } from 'redux-saga/effects';
import { message as antMessage } from 'antd';

import settingsActions from '../settings/actions';
import { REQUEST } from '../common/actions';
import groupsApi from '../../services/groups';
import groupsActions, {
  GET_GROUPS,
  ADD_GROUP,
  GET_GROUP,
  UPDATE_GROUP,
  DELETE_GROUP,
} from './actions';

export function* handleGetGroups({ payload }) {
  try {
    const { data } = yield call(groupsApi.getGroups, payload);
    yield put(groupsActions.getGroups.success({ groups: data }));
  } catch (error) {
    yield put(groupsActions.getGroups.failure(error));
    // antMessage.error(error.message, 5);
  }
}
export function* handleAddGroup({ payload }) {
  try {
    const { data } = yield call(groupsApi.addGroup, payload);
    yield put(groupsActions.addGroup.success(data));
    yield put(settingsActions.setFormVisibility({ showForm: false, formType: 'ADD' }));
  } catch (error) {
    yield put(groupsActions.addGroup.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleGetGroup({ payload }) {
  try {
    const { data } = yield call(groupsApi.getGroup, payload);
    yield put(groupsActions.getGroup.success({ formDetails: data }));
    yield put(settingsActions.setFormVisibility({ showForm: true, formType: 'EDIT' }));
    window.scrollTo(0, 40);
  } catch (error) {
    yield put(groupsActions.getGroup.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleUpdateGroup({ payload }) {
  try {
    const { data } = yield call(groupsApi.updateGroup, payload);
    yield put(groupsActions.updateGroup.success({ groupId: payload.groupId, data }));
    yield put(settingsActions.setFormVisibility({ showForm: false, formType: 'ADD' }));
  } catch (error) {
    yield put(groupsActions.updateGroup.failure(error));
    antMessage.error(error.message, 5);
  }
}

export function* handleDeleteGroup({ payload }) {
  try {
    // yield call(groupsApi.deleteGroup, payload);
    // yield put(groupsActions.deleteGroup.success(payload));

    const data = yield call(groupsApi.deleteGroup, payload);
    if (data.data === false) {
      antMessage.warning("Group cannot be deleted because it's been used by other services", 3);
      yield put(groupsActions.deleteGroup.success());
    } else {
      yield put(groupsActions.deleteGroup.success(payload));
    }
  } catch (error) {
    yield put(groupsActions.deleteGroup.failure(error));
    antMessage.error(error.message, 5);
  }
}

export default function* groupsWatcher() {
  yield takeLatest(GET_GROUPS[REQUEST], handleGetGroups);
  yield takeLatest(ADD_GROUP[REQUEST], handleAddGroup);
  yield takeLatest(GET_GROUP[REQUEST], handleGetGroup);
  yield takeLatest(UPDATE_GROUP[REQUEST], handleUpdateGroup);
  yield takeLatest(DELETE_GROUP[REQUEST], handleDeleteGroup);
}
