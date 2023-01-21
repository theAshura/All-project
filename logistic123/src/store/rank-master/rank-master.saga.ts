import { all, call, put, takeLatest, select } from '@redux-saga/core/effects';
import {
  createRankMasterActionsApi,
  deleteRankMasterActionsApi,
  getDetailRankMasterActionApi,
  getListRankMasterActionsApi,
  updateRankMasterActionApi,
} from 'api/rank-master.api';

import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { State } from 'store/reducer';
import {
  createRankMasterActions,
  deleteRankMasterActions,
  getListRankMasterActions,
  getRankMasterDetailActions,
  updateRankMasterActions,
} from './rank-master.action';

function* getListRankMasterSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      isLeftMenu,
      handleSuccess,
      ...other
    } = action.payload;

    const params = {
      ...other,
      country: action.payload?.country?.label,
    };
    const response = yield call(getListRankMasterActionsApi, params);
    const { data } = response;
    handleSuccess?.();
    yield put(getListRankMasterActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListRankMasterActions.failure());
  }
}

function* deleteRankMasterSaga(action) {
  try {
    const { params, listRankMaster } = yield select(
      (state: State) => state.port,
    );
    yield call(deleteRankMasterActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listRankMaster.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteRankMasterActions.success(newParams));
    toastSuccess('You have deleted successfully');
    action.payload?.getListRankMaster();
  } catch (e) {
    toastError(e);
    yield put(deleteRankMasterActions.failure());
  }
}

function* createRankMasterSaga(action) {
  try {
    const { afterCreate, ...other } = action.payload;
    yield call(createRankMasterActionsApi, other);
    yield put(createRankMasterActions.success());
    yield put(getListRankMasterActions.request({}));
    if (action.payload?.afterCreate) {
      action.payload?.afterCreate();
    }
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    yield put(createRankMasterActions.failure(e?.errorList || []));
  }
}

function* getRankMasterDetailSaga(action) {
  try {
    const response = yield call(getDetailRankMasterActionApi, action.payload);
    const { data } = response;
    yield put(getRankMasterDetailActions.success(data));
  } catch (e) {
    toastError(e);
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.RANK_MASTER);
    }
    yield put(getRankMasterDetailActions.failure());
  }
}

function* updateRankMasterSaga(action) {
  try {
    yield call(updateRankMasterActionApi, action.payload);
    put(updateRankMasterActions.success());
    history.push(AppRouteConst.RANK_MASTER);
    action.payload?.afterUpdate();
    toastSuccess('You have updated successfully');
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    if (e?.message && e?.statusCode === 400) {
      toastError(e);
    }
    yield put(updateRankMasterActions.failure(e?.errorList || []));
  }
}

export default function* RankMasterSaga() {
  yield all([
    yield takeLatest(getListRankMasterActions.request, getListRankMasterSaga),
    yield takeLatest(deleteRankMasterActions.request, deleteRankMasterSaga),
    yield takeLatest(createRankMasterActions.request, createRankMasterSaga),
    yield takeLatest(
      getRankMasterDetailActions.request,
      getRankMasterDetailSaga,
    ),
    yield takeLatest(updateRankMasterActions.request, updateRankMasterSaga),
  ]);
}
