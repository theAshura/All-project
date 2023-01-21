import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import moment from 'moment-timezone';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';

import { State } from '../reducer';
import {
  getAuditTimeTableDetailActions,
  getListAuditTimeTableActions,
  updateAuditTimeTableActions,
  deleteAuditTimeTableActions,
  submitAuditTimeTableActions,
  createAuditTimeTableActions,
  getDataCalendarActions,
  recallActions,
  closeOutActions,
} from './audit-time-table.action';
import {
  getAuditTimeTableDetailActionsApi,
  getListAuditTimeTablesActionsApi,
  deleteAuditTimeTableActionsApi,
  createAuditTimeTableActionsApi,
  submitAuditTimeTableActionsApi,
  updateAuditTimeTablePermissionDetailActionsApi,
  getDataCalendarApi,
  recallApi,
  closeOutApi,
} from '../../api/audit-time-table.api';

function* getListAuditTimeTablesSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      handleSuccess,
      isLeftMenu,
      ...other
    } = action.payload;

    const response = yield call(getListAuditTimeTablesActionsApi, other);
    const { data } = response;
    yield put(getListAuditTimeTableActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListAuditTimeTableActions.failure());
  }
}

function* deleteAuditTimeTablesSaga(action) {
  try {
    const { params, listAuditTimeTables } = yield select(
      (state: State) => state.auditTimeTable,
    );
    yield call(deleteAuditTimeTableActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listAuditTimeTables.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    toastSuccess('You have deleted successfully');

    yield put(deleteAuditTimeTableActions.success(newParams));
    action.payload?.getListAuditTimeTable();
  } catch (e) {
    toastError(e);
    yield put(deleteAuditTimeTableActions.failure());
  }
}

function* createAuditTimeTableSaga(action) {
  try {
    const { afterCreate, ...params } = action.payload;
    yield call(createAuditTimeTableActionsApi, {
      ...params,
      actualFrom: moment(params?.actualFrom),
      actualTo: moment(params?.actualTo),
    });
    yield put(createAuditTimeTableActions.success());
    toastSuccess('You have created successfully');
    if (action.payload?.afterCreate) {
      action.payload?.afterCreate();
    }
    history.push(AppRouteConst.AUDIT_TIME_TABLE);
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createAuditTimeTableActions.failure(e?.errorList));
      toastError(e);
    } else {
      toastError(e);
      yield put(createAuditTimeTableActions.failure(undefined));
    }
  }
}

function* getAuditTimeTableDetailSaga(action) {
  try {
    const response = yield call(
      getAuditTimeTableDetailActionsApi,
      action.payload,
    );
    const { data } = response;
    yield put(getAuditTimeTableDetailActions.success(data));

    yield put(getDataCalendarActions.request({ id: action.payload }));
  } catch (e) {
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.AUDIT_TIME_TABLE);
    }
    toastError(e);
    yield put(getAuditTimeTableDetailActions.failure());
  }
}

function* updateAuditTimeTableSaga(action) {
  try {
    const { afterUpdate, ...params } = action.payload;
    yield call(updateAuditTimeTablePermissionDetailActionsApi, {
      ...params,
      data: {
        ...params.data,
        actualFrom: moment(params.data?.actualFrom),
        actualTo: moment(params.data?.actualTo),
      },
    });
    if (params.data?.isSubmit) {
      yield call(submitAuditTimeTableActionsApi, params.id);
    }
    toastSuccess('You have updated successfully');
    yield put(updateAuditTimeTableActions.success());
    history.push(AppRouteConst.AUDIT_TIME_TABLE);
  } catch (e) {
    if (e?.statusCode === 400) {
      toastError(e);
      yield put(updateAuditTimeTableActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateAuditTimeTableActions.failure(undefined));
    }
  }
}

function* submitAuditTimeTableSaga(action) {
  try {
    yield call(submitAuditTimeTableActionsApi, action.payload);
    toastSuccess('You have submitted successfully');
    history.push(AppRouteConst.AUDIT_TIME_TABLE);
    yield put(submitAuditTimeTableActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(submitAuditTimeTableActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(submitAuditTimeTableActions.failure(undefined));
    }
  }
}

function* getDataCalendarSaga(action) {
  try {
    const response = yield call(getDataCalendarApi, action.payload);
    const { data } = response;
    yield put(getDataCalendarActions.success(data?.data || []));
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(getDataCalendarActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(getDataCalendarActions.failure(undefined));
    }
  }
}

function* handleRecallSaga(action: ReturnType<typeof recallActions.request>) {
  try {
    yield call(recallApi, action.payload.id);
    toastSuccess('Recalled successfully');
    action.payload?.handleSuccess();
    yield put(recallActions.success());
  } catch (e) {
    toastError(e);
    yield put(recallActions.failure(e));
  }
}

function* handleCloseOutSaga(
  action: ReturnType<typeof closeOutActions.request>,
) {
  try {
    yield call(closeOutApi, action.payload);
    toastSuccess('Close Out successfully');
    history.push(AppRouteConst.AUDIT_TIME_TABLE);
    yield put(closeOutActions.success());
  } catch (e) {
    toastError(e);
    yield put(closeOutActions.failure(e));
  }
}

export default function* AuditTimeTableAndPermissionSaga() {
  yield all([
    yield takeLatest(
      deleteAuditTimeTableActions.request,
      deleteAuditTimeTablesSaga,
    ),
    yield takeLatest(
      getListAuditTimeTableActions.request,
      getListAuditTimeTablesSaga,
    ),
    yield takeLatest(
      createAuditTimeTableActions.request,
      createAuditTimeTableSaga,
    ),
    yield takeLatest(
      getAuditTimeTableDetailActions.request,
      getAuditTimeTableDetailSaga,
    ),
    yield takeLatest(
      updateAuditTimeTableActions.request,
      updateAuditTimeTableSaga,
    ),
    yield takeLatest(
      submitAuditTimeTableActions.request,
      submitAuditTimeTableSaga,
    ),
    yield takeLatest(getDataCalendarActions.request, getDataCalendarSaga),
    yield takeLatest(recallActions.request, handleRecallSaga),
    yield takeLatest(closeOutActions.request, handleCloseOutSaga),
  ]);
}
