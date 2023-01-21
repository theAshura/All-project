import { all, call, put, takeLatest, select } from '@redux-saga/core/effects';
import {
  createNatureOfFindingsMasterActionsApi,
  deleteNatureOfFindingsMasterActionsApi,
  getDetailNatureOfFindingsMasterActionApi,
  getListNatureOfFindingsMasterActionsApi,
  updateNatureOfFindingsMasterActionApi,
} from 'api/nature-of-findings-master.api';

import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { NatureOfFindingsMaster } from 'models/api/nature-of-findings-master/nature-of-findings-master.model';
import { State } from 'store/reducer';
import {
  createNatureOfFindingsMasterActions,
  deleteNatureOfFindingsMasterActions,
  getListNatureOfFindingsMasterActions,
  getNatureOfFindingsMasterDetailActions,
  updateNatureOfFindingsMasterActions,
} from './nature-of-findings-master.action';

function* getListNatureOfFindingsMasterSaga(action) {
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
    const response = yield call(
      getListNatureOfFindingsMasterActionsApi,
      params,
    );
    const { data } = response;
    yield put(getListNatureOfFindingsMasterActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListNatureOfFindingsMasterActions.failure());
  }
}

function* deleteNatureOfFindingsMasterSaga(action) {
  try {
    const { params, listNatureOfFindingsMaster } = yield select(
      (state: State) => state.port,
    );
    yield call(deleteNatureOfFindingsMasterActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listNatureOfFindingsMaster.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteNatureOfFindingsMasterActions.success(newParams));
    toastSuccess('You have deleted successfully');
    action.payload?.getListNatureOfFindingsMaster();
  } catch (e) {
    toastError(e);
    yield put(deleteNatureOfFindingsMasterActions.failure());
  }
}

function* createNatureOfFindingsMasterSaga(action) {
  try {
    const params: NatureOfFindingsMaster = {
      ...action.payload,
      isNew: undefined,
      resetForm: undefined,
    };
    yield call(createNatureOfFindingsMasterActionsApi, params);
    yield put(createNatureOfFindingsMasterActions.success());

    action.payload?.afterCreate();

    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    yield put(createNatureOfFindingsMasterActions.failure(e?.errorList || []));
  }
}

function* getNatureOfFindingsMasterDetailSaga(action) {
  try {
    const response = yield call(
      getDetailNatureOfFindingsMasterActionApi,
      action.payload,
    );
    const { data } = response;
    yield put(getNatureOfFindingsMasterDetailActions.success(data));
  } catch (e) {
    toastError(e);
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.NATURE_OF_FINDINGS_MASTER);
    }
    yield put(getNatureOfFindingsMasterDetailActions.failure());
  }
}

function* updateNatureOfFindingsMasterSaga(action) {
  try {
    yield call(
      updateNatureOfFindingsMasterActionApi,
      action.payload?.id,
      action.payload?.body,
    );
    put(updateNatureOfFindingsMasterActions.success());
    toastSuccess('You have updated successfully');
    action.payload?.afterUpdate();
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    if (e?.message && e?.statusCode === 400) {
      toastError(e);
    }
    yield put(updateNatureOfFindingsMasterActions.failure(e?.errorList || []));
  }
}

export default function* NatureOfFindingsMasterSaga() {
  yield all([
    yield takeLatest(
      getListNatureOfFindingsMasterActions.request,
      getListNatureOfFindingsMasterSaga,
    ),
    yield takeLatest(
      deleteNatureOfFindingsMasterActions.request,
      deleteNatureOfFindingsMasterSaga,
    ),
    yield takeLatest(
      createNatureOfFindingsMasterActions.request,
      createNatureOfFindingsMasterSaga,
    ),
    yield takeLatest(
      getNatureOfFindingsMasterDetailActions.request,
      getNatureOfFindingsMasterDetailSaga,
    ),
    yield takeLatest(
      updateNatureOfFindingsMasterActions.request,
      updateNatureOfFindingsMasterSaga,
    ),
  ]);
}
