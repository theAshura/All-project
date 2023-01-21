import { all, call, put, takeLatest, select } from '@redux-saga/core/effects';
import {
  createWorkFlowActionsApi,
  deleteWorkFlowActionsApi,
  getDetailWorkFlowActionApi,
  getListAuditorsApi,
  getListWorkFlowActionsApi,
  getWorkFlowActiveUserPermissionApi,
  getWorkFlowPermissionStepApi,
  updateWorkFlowActionApi,
} from 'api/work-flow.api';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { State } from 'store/reducer';
import {
  createWorkFlowActions,
  deleteWorkFlowActions,
  getListAuditorsActions,
  getListWorkFlowActions,
  getWorkFlowActiveUserPermissionActions,
  getWorkFlowPermissionStepActions,
  getWorkFlowDetailActions,
  updateWorkFlowActions,
} from './work-flow.action';

function* getListWorkFlowSaga(action) {
  try {
    const { isRefreshLoading, tabKey, handleSuccess, paramsList, ...other } =
      action.payload;
    const response = yield call(getListWorkFlowActionsApi, other);
    const { data } = response;

    yield put(getListWorkFlowActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListWorkFlowActions.failure());
  }
}

function* deleteWorkFlowSaga(action) {
  try {
    const { params, listWorkFlows } = yield select(
      (state: State) => state.workFlow,
    );
    yield call(deleteWorkFlowActionsApi, action.payload?.id);
    action.payload?.handleSuccess();

    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listWorkFlows.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    toastSuccess('You have deleted successfully');
    yield put(deleteWorkFlowActions.success(newParams));
  } catch (e) {
    toastError(e);
    yield put(deleteWorkFlowActions.failure());
  }
}

function* createWorkFlowSaga(action) {
  try {
    const { resetForm, ...others } = action.payload;
    yield call(createWorkFlowActionsApi, others);
    yield put(createWorkFlowActions.success());
    toastSuccess('You have created successfully');
    if (action.payload?.resetForm) {
      action.payload?.resetForm();
    }
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    yield put(createWorkFlowActions.failure(e?.errorList || []));
  }
}

function* getWorkFlowDetailSaga(action) {
  try {
    const response = yield call(getDetailWorkFlowActionApi, action.payload);
    const { data } = response;
    yield put(getWorkFlowDetailActions.success(data));
  } catch (e) {
    toastError(e);
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.WORK_FLOW);
    }
    yield put(getWorkFlowDetailActions.failure());
  }
}

function* updateWorkFlowSaga(action) {
  try {
    yield call(updateWorkFlowActionApi, action.payload);
    put(updateWorkFlowActions.success());
    if (action.payload?.resetForm) {
      action.payload?.resetForm();
    }
    toastSuccess('You have updated successfully');
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    if (e?.message && e?.statusCode === 400) {
      toastError(e);
    }
    yield put(updateWorkFlowActions.failure(e?.errorList || []));
  }
}

function* getWorkFlowActiveUserPermissionSaga(action) {
  try {
    const { isRefreshLoading, tabKey, paramsList, ...other } = action.payload;
    const response = yield call(getWorkFlowActiveUserPermissionApi, other);
    const { data } = response;
    yield put(getWorkFlowActiveUserPermissionActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getWorkFlowActiveUserPermissionActions.failure());
  }
}

function* getListAuditorsSaga(action) {
  try {
    const { isRefreshLoading, tabKey, paramsList, ...other } = action.payload;
    const response = yield call(getListAuditorsApi, other);
    const { data } = response;
    yield put(getListAuditorsActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListAuditorsActions.failure());
  }
}

function* getWorkFlowPermissionStepSaga(action) {
  try {
    const { isRefreshLoading, tabKey, paramsList, ...other } = action.payload;
    const response = yield call(getWorkFlowPermissionStepApi, other);
    const { data } = response;
    yield put(getWorkFlowPermissionStepActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getWorkFlowPermissionStepActions.failure());
  }
}

export default function* workFlowSaga() {
  yield all([
    yield takeLatest(getListWorkFlowActions.request, getListWorkFlowSaga),
    yield takeLatest(deleteWorkFlowActions.request, deleteWorkFlowSaga),
    yield takeLatest(createWorkFlowActions.request, createWorkFlowSaga),
    yield takeLatest(getWorkFlowDetailActions.request, getWorkFlowDetailSaga),
    yield takeLatest(updateWorkFlowActions.request, updateWorkFlowSaga),
    yield takeLatest(
      getWorkFlowActiveUserPermissionActions.request,
      getWorkFlowActiveUserPermissionSaga,
    ),
    yield takeLatest(getListAuditorsActions.request, getListAuditorsSaga),
    yield takeLatest(
      getWorkFlowPermissionStepActions.request,
      getWorkFlowPermissionStepSaga,
    ),
  ]);
}
