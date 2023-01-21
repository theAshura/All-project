import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';

import { State } from 'store/reducer';
import {
  getTopicDetailActions,
  getListTopicActions,
  updateTopicActions,
  deleteTopicActions,
  createTopicActions,
} from './topic.action';
import {
  getTopicDetailActionsApi,
  getListTopicsActionsApi,
  deleteTopicActionsApi,
  createTopicActionsApi,
  updateTopicPermissionDetailActionsApi,
} from '../../api/topic.api';

function* getListTopicsSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      handleSuccess,
      isLeftMenu,
      ...other
    } = action.payload;

    const response = yield call(getListTopicsActionsApi, other);
    const { data } = response;
    handleSuccess?.();
    yield put(getListTopicActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListTopicActions.failure());
  }
}

function* deleteTopicsSaga(action) {
  try {
    const { params, listTopics } = yield select((state: State) => state.topic);

    yield call(deleteTopicActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listTopics.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteTopicActions.success(newParams));
    toastSuccess('You have deleted successfully');

    action.payload?.getListTopic();
  } catch (e) {
    toastError(e);
    yield put(deleteTopicActions.failure());
  }
}

function* createTopicSaga(action) {
  try {
    const { afterCreate, ...other } = action.payload;
    yield call(createTopicActionsApi, other);
    yield put(createTopicActions.success());
    yield put(getListTopicActions.request({}));
    if (action.payload?.afterCreate) {
      action.payload?.afterCreate();
    }
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createTopicActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createTopicActions.failure(undefined));
    }
  }
}

function* getTopicDetailSaga(action) {
  try {
    const response = yield call(getTopicDetailActionsApi, action.payload);
    const { data } = response;

    yield put(getTopicDetailActions.success(data));
  } catch (e) {
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.TOPIC);
    }
    toastError(e);
    yield put(getTopicDetailActions.failure());
  }
}

function* updateTopicSaga(action) {
  try {
    yield call(updateTopicPermissionDetailActionsApi, action.payload);
    toastSuccess('You have updated successfully');
    history.push(AppRouteConst.TOPIC);
    action.payload?.afterUpdate();
    yield put(updateTopicActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updateTopicActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateTopicActions.failure(undefined));
    }
  }
}

export default function* TopicAndPermissionSaga() {
  yield all([
    yield takeLatest(deleteTopicActions.request, deleteTopicsSaga),
    yield takeLatest(getListTopicActions.request, getListTopicsSaga),
    yield takeLatest(createTopicActions.request, createTopicSaga),
    yield takeLatest(getTopicDetailActions.request, getTopicDetailSaga),
    yield takeLatest(updateTopicActions.request, updateTopicSaga),
  ]);
}
