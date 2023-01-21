import { PLANNING_TAB } from 'constants/components/planning.const';
import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';
import { uploadFileApi } from 'api/support.api';
import {
  createPlanningAndRequestActionsApi,
  deletePlanningAndRequestActionsApi,
  getListPlanningAndRequestsActionsApi,
  getPlanningAndRequestDetailActionsApi,
  updatePlanningAndRequestDetailActionsApi,
  getListPlanningAndRequestGroupByAuditorsApi,
  getTotalUnplannedPlanningApi,
  getPlanningRequestAuditLogApiRequest,
} from 'api/planning-and-request.api';
import { PlanningAndRequest } from 'models/api/planning-and-request/planning-and-request.model';
import { State } from '../reducer';
import {
  createPlanningAndRequestActions,
  deletePlanningAndRequestActions,
  getTotalUnplannedPlanningActions,
  getListPlanningAndRequestActions,
  getPlanningAndRequestDetailActions,
  updatePlanningAndRequestActions,
  uploadFileActions,
  getPlanningAndRequestGroupByAuditorsAction,
  getListPlanningRequestAuditLogAction,
} from './planning-and-request.action';

function* getListPlanningAndRequestSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      isLeftMenu,
      handleSuccess,
      tab,
      unplanned,
      ...other
    } = action.payload;
    const params = tab === 'unplanned' ? { ...other, unplanned } : other;
    const response = yield call(getListPlanningAndRequestsActionsApi, params);
    const { data } = response;
    yield put(getListPlanningAndRequestActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListPlanningAndRequestActions.failure());
  }
}

function* deletePlanningAndRequestSaga(action) {
  try {
    const { params, listPlanningAndRequests } = yield select(
      (state: State) => state.charterOwner,
    );
    yield call(deletePlanningAndRequestActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listPlanningAndRequests.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    toastSuccess('You have deleted successfully');
    put(deletePlanningAndRequestActions.success(newParams));
    action.payload?.getListPlanningAndRequest();
  } catch (e) {
    toastError(e);
    yield put(deletePlanningAndRequestActions.failure());
  }
}

function* createPlanningAndRequestSaga(
  action: ReturnType<typeof createPlanningAndRequestActions.request>,
) {
  try {
    const params: PlanningAndRequest = {
      ...action.payload,
    };
    yield call(createPlanningAndRequestActionsApi, params);
    yield put(createPlanningAndRequestActions.success());
    toastSuccess('You have created successfully');
    if (params?.auditorIds?.length) {
      history.push(`${AppRouteConst.PLANNING}?tab=${PLANNING_TAB.planning}`);
    } else {
      history.push(`${AppRouteConst.PLANNING}?tab=${PLANNING_TAB.unplanned}`);
    }
  } catch (e) {
    toastError(e);
    yield put(createPlanningAndRequestActions.failure(undefined));
  }
}

function* getPlanningAndRequestDetailSaga(action) {
  try {
    const response = yield call(
      getPlanningAndRequestDetailActionsApi,
      action.payload,
    );
    const { data } = response;
    yield put(getPlanningAndRequestDetailActions.success(data));
  } catch (e) {
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.PLANNING);
    }
    toastError(e);
    yield put(getPlanningAndRequestDetailActions.failure());
  }
}

function* updatePlanningAndRequestSaga(action) {
  try {
    yield call(updatePlanningAndRequestDetailActionsApi, action.payload);

    history.push(`${AppRouteConst.PLANNING}?tab=planning`);

    put(updatePlanningAndRequestActions.success());
    toastSuccess('You have updated successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(updatePlanningAndRequestActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updatePlanningAndRequestActions.failure(undefined));
    }
  }
}

function* uploadFileSaga(action) {
  try {
    const response = yield call(uploadFileApi, action.payload);
    const { data } = response;
    yield put(
      uploadFileActions.success({
        id: data && data[0]?.id,
        url: data && data[0]?.link,
      }),
    );
  } catch (e) {
    toastError(e);
    yield put(uploadFileActions.failure());
  }
}

function* getListPlanningAndRequestGroupByAuditors(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      isLeftMenu,
      handleSuccess,
      ...other
    } = action.payload;
    const response = yield call(
      getListPlanningAndRequestGroupByAuditorsApi,
      other,
    );
    const { data } = response;
    yield put(getPlanningAndRequestGroupByAuditorsAction.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getPlanningAndRequestGroupByAuditorsAction.failure());
  }
}

function* getTotalUnplannedPlanningSaga() {
  try {
    const response = yield call(getTotalUnplannedPlanningApi);
    const { data } = response;
    yield put(getTotalUnplannedPlanningActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getTotalUnplannedPlanningActions.failure());
  }
}

function* getPlanningAuditLogSaga(action) {
  try {
    const response = yield call(
      getPlanningRequestAuditLogApiRequest,
      action.payload,
    );
    const { data } = response;
    yield put(getListPlanningRequestAuditLogAction.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListPlanningRequestAuditLogAction.failure());
  }
}

export default function* PlanningAndRequestSaga() {
  yield all([
    yield takeLatest(
      getTotalUnplannedPlanningActions.request,
      getTotalUnplannedPlanningSaga,
    ),
    yield takeLatest(
      deletePlanningAndRequestActions.request,
      deletePlanningAndRequestSaga,
    ),
    yield takeLatest(
      getListPlanningAndRequestActions.request,
      getListPlanningAndRequestSaga,
    ),
    yield takeLatest(
      createPlanningAndRequestActions.request,
      createPlanningAndRequestSaga,
    ),
    yield takeLatest(
      getPlanningAndRequestDetailActions.request,
      getPlanningAndRequestDetailSaga,
    ),
    yield takeLatest(
      updatePlanningAndRequestActions.request,
      updatePlanningAndRequestSaga,
    ),
    yield takeLatest(uploadFileActions.request, uploadFileSaga),
    yield takeLatest(
      getPlanningAndRequestGroupByAuditorsAction.request,
      getListPlanningAndRequestGroupByAuditors,
    ),
    yield takeLatest(
      getListPlanningRequestAuditLogAction.request,
      getPlanningAuditLogSaga,
    ),
  ]);
}
