import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import {
  getPlansAndDrawingDetailActionsApi,
  getListPlansAndDrawingMasterActionsApi,
  deletePlansAndDrawingActionsApi,
  createPlansAndDrawingActionsApi,
  updatePlansAndDrawingDetailActionsApi,
} from 'api/plans-and-drawings.api';
import { State } from '../reducer';

import {
  getPlansAndDrawingDetailActions,
  getListPlansAndDrawingMasterActions,
  updatePlansAndDrawingMasterActions,
  deletePlansAndDrawingActions,
  createPlansAndDrawingActions,
} from './plans-and-drawings.action';

function* getListPlansAndDrawingsMasterSaga(action) {
  try {
    const {
      isRefreshLoading,
      handleSuccess,
      paramsList,
      isLeftMenu,
      ...other
    } = action.payload;

    const response = yield call(getListPlansAndDrawingMasterActionsApi, other);
    const { data } = response;
    if (action.payload?.handleSuccess) {
      action.payload?.handleSuccess();
    }

    yield put(getListPlansAndDrawingMasterActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListPlansAndDrawingMasterActions.failure());
  }
}

function* deletePlansAndDrawingsSaga(action) {
  try {
    const { params, listPlanningAndDrawings } = yield select(
      (state: State) => state.plansAndDrawing,
    );
    yield call(deletePlansAndDrawingActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listPlanningAndDrawings.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    action.payload?.handleSuccess();
    yield put(deletePlansAndDrawingActions.success(newParams));
    toastSuccess('You have deleted successfully');
  } catch (e) {
    toastError(e);
    yield put(deletePlansAndDrawingActions.failure());
  }
}

function* createPlansAndDrawingSaga(action) {
  try {
    const { isNew, handleSuccess, ...params } = action.payload;

    yield call(createPlansAndDrawingActionsApi, params);
    action.payload?.handleSuccess();
    yield put(createPlansAndDrawingActions.success());
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createPlansAndDrawingActions.failure(e));
    } else {
      toastError(e);
      yield put(createPlansAndDrawingActions.failure(undefined));
    }
  }
}

function* getPlansAndDrawingDetailSaga(action) {
  try {
    const response = yield call(
      getPlansAndDrawingDetailActionsApi,
      action.payload,
    );
    const { data } = response;
    yield put(getPlansAndDrawingDetailActions.success(data));
  } catch (e) {
    if (e?.message) {
      toastError(e);
    }
    toastError(e);
    yield put(getPlansAndDrawingDetailActions.failure());
  }
}

function* updatePlansAndDrawingSaga(action) {
  try {
    const { handleSuccess, ...params } = action.payload;
    yield call(updatePlansAndDrawingDetailActionsApi, params);
    yield put(updatePlansAndDrawingMasterActions.success());
    action.payload?.handleSuccess();
    toastSuccess('You have updated successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updatePlansAndDrawingMasterActions.failure(e));
    } else {
      toastError(e);
      yield put(updatePlansAndDrawingMasterActions.failure(undefined));
    }
  }
}

export default function* PlansAndDrawingSaga() {
  yield all([
    yield takeLatest(
      deletePlansAndDrawingActions.request,
      deletePlansAndDrawingsSaga,
    ),
    yield takeLatest(
      getListPlansAndDrawingMasterActions.request,
      getListPlansAndDrawingsMasterSaga,
    ),
    yield takeLatest(
      createPlansAndDrawingActions.request,
      createPlansAndDrawingSaga,
    ),
    yield takeLatest(
      getPlansAndDrawingDetailActions.request,
      getPlansAndDrawingDetailSaga,
    ),
    yield takeLatest(
      updatePlansAndDrawingMasterActions.request,
      updatePlansAndDrawingSaga,
    ),
  ]);
}
