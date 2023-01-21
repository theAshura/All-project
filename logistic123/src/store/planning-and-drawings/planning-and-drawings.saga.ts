import { call, put, takeLatest, all, select } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { State } from 'store/reducer';
import { CreatePlanningAndDrawingsParams } from 'models/api/planning-and-drawings/planning-and-drawings.model';
import {
  createPlanningAndDrawingsActionsApi,
  deletePlanningAndDrawingsActionsApi,
  getPlanningAndDrawingsDetailActionsApi,
  getListPlanningAndDrawingsActionsApi,
  getListPlanningAndDrawingsBodyActionsApi,
  getListPlanningAndDrawingsMasterActionsApi,
  updatePlanningAndDrawingsDetailActionsApi,
} from 'api/planning-and-drawings.api';
import {
  createPlanningAndDrawingsActions,
  deletePlanningAndDrawingsActions,
  getPlanningAndDrawingsDetailActions,
  getListPlanningAndDrawingsActions,
  getListPlanningAndDrawingsBodyActions,
  getListPlanningAndDrawingsMasterActions,
  updatePlanningAndDrawingsActions,
} from './planning-and-drawings.action';

function* getListPlanningAndDrawingsSaga(action) {
  try {
    const {
      isRefreshLoading,
      handleSuccess,
      paramsList,
      isLeftMenu,
      ...other
    } = action.payload;
    const response = yield call(getListPlanningAndDrawingsActionsApi, other);
    const { data } = response;

    yield put(getListPlanningAndDrawingsActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListPlanningAndDrawingsActions.failure());
  }
}

function* getListPlanningAndDrawingsMasterSaga(action) {
  try {
    const {
      isRefreshLoading,
      handleSuccess,
      paramsList,
      isLeftMenu,
      ...other
    } = action.payload;
    const response = yield call(
      getListPlanningAndDrawingsMasterActionsApi,
      other,
    );

    const { data } = response;
    yield put(getListPlanningAndDrawingsMasterActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListPlanningAndDrawingsMasterActions.failure());
  }
}

function* getListPlanningAndDrawingsBodySaga(action) {
  try {
    const {
      isRefreshLoading,
      handleSuccess,
      paramsList,
      isLeftMenu,
      ...other
    } = action.payload;
    const response = yield call(
      getListPlanningAndDrawingsBodyActionsApi,
      other,
    );

    const { data } = response;
    yield put(getListPlanningAndDrawingsBodyActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListPlanningAndDrawingsBodyActions.failure());
  }
}

function* createPlanningAndDrawingsSaga(action) {
  try {
    const params: CreatePlanningAndDrawingsParams = {
      ...action.payload,
      isNew: undefined,
      resetForm: undefined,
    };
    yield call(createPlanningAndDrawingsActionsApi, params);
    yield put(createPlanningAndDrawingsActions.success());
    action?.payload?.afterCreate?.();
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createPlanningAndDrawingsActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createPlanningAndDrawingsActions.failure(undefined));
    }
  }
}

function* deletePlanningAndDrawingsSaga(action) {
  try {
    const { params, ListPlanningAndDrawings } = yield select(
      (state: State) => state.injury,
    );
    yield call(deletePlanningAndDrawingsActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      ListPlanningAndDrawings.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deletePlanningAndDrawingsActions.success(newParams));
    action.payload?.handleSuccess();
    toastSuccess('You have deleted successfully');
  } catch (e) {
    toastError(e);
    yield put(deletePlanningAndDrawingsActions.failure());
  }
}

function* getPlanningAndDrawingsDetailSaga(action) {
  try {
    const response = yield call(
      getPlanningAndDrawingsDetailActionsApi,
      action.payload,
    );
    const { data } = response;

    yield put(getPlanningAndDrawingsDetailActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getPlanningAndDrawingsDetailActions.failure());
  }
}

function* updatePlanningAndDrawingsSaga(action) {
  try {
    yield call(updatePlanningAndDrawingsDetailActionsApi, action.payload);
    toastSuccess('You have updated successfully');
    action.payload?.afterUpdate();

    yield put(updatePlanningAndDrawingsActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updatePlanningAndDrawingsActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updatePlanningAndDrawingsActions.failure(undefined));
    }
  }
}

export default function* PlanningAndDrawingsSaga() {
  yield all([
    yield takeLatest(
      createPlanningAndDrawingsActions.request,
      createPlanningAndDrawingsSaga,
    ),
    yield takeLatest(
      getListPlanningAndDrawingsActions.request,
      getListPlanningAndDrawingsSaga,
    ),
    yield takeLatest(
      getListPlanningAndDrawingsMasterActions.request,
      getListPlanningAndDrawingsMasterSaga,
    ),
    yield takeLatest(
      getListPlanningAndDrawingsBodyActions.request,
      getListPlanningAndDrawingsBodySaga,
    ),
    yield takeLatest(
      deletePlanningAndDrawingsActions.request,
      deletePlanningAndDrawingsSaga,
    ),
    yield takeLatest(
      getPlanningAndDrawingsDetailActions.request,
      getPlanningAndDrawingsDetailSaga,
    ),
    yield takeLatest(
      updatePlanningAndDrawingsActions.request,
      updatePlanningAndDrawingsSaga,
    ),
  ]);
}
