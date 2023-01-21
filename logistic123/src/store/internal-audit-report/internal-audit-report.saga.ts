import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';
import { getUrlImageApi } from 'api/support.api';
import { AvatarType } from 'models/common.model';
import { State } from '../reducer';

import {
  getInternalAuditReportDetailActions,
  getListInternalAuditReportActions,
  updateInternalAuditReportActions,
  deleteInternalAuditReportActions,
  getListInspectionFollowUpActions,
  getInspectionFollowUpDetailActions,
} from './internal-audit-report.action';
import {
  getInternalAuditReportDetailActionsApi,
  getListInternalAuditReportsActionsApi,
  deleteInternalAuditReportActionsApi,
  updateInternalAuditReportPermissionDetailActionsApi,
  getListInspectionFollowUpApiRequest,
  getInspectionFollowUpDetailApiRequest,
} from '../../api/internal-audit-report.api';

function* getListInternalAuditReportsSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      isLeftMenu,
      handleSuccess,
      ...other
    } = action.payload;

    const response = yield call(getListInternalAuditReportsActionsApi, other);
    const { data } = response;
    yield put(getListInternalAuditReportActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListInternalAuditReportActions.failure());
  }
}

function* deleteInternalAuditReportsSaga(action) {
  try {
    const { params, listInternalAuditReports } = yield select(
      (state: State) => state.auditType,
    );
    yield call(deleteInternalAuditReportActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listInternalAuditReports.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteInternalAuditReportActions.success(newParams));
    toastSuccess('You have deleted successfully');

    action.payload?.getListInternalAuditReport();
  } catch (e) {
    toastError(e);
    yield put(deleteInternalAuditReportActions.failure());
  }
}

function* getInternalAuditReportDetailSaga(action) {
  try {
    let avatar: AvatarType;
    const response = yield call(
      getInternalAuditReportDetailActionsApi,
      action.payload,
    );
    if (response?.data?.background) {
      const responseImage = yield call(
        getUrlImageApi,
        response?.data?.background,
      );
      avatar = {
        id: response?.data?.background,
        url: responseImage?.data?.link,
      };
    }
    const { data } = response;

    yield put(getInternalAuditReportDetailActions.success({ ...data, avatar }));
  } catch (e) {
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.AUDIT_TYPE);
    }
    toastError(e);
    yield put(getInternalAuditReportDetailActions.failure());
  }
}

function* updateInternalAuditReportSaga(action) {
  try {
    yield call(
      updateInternalAuditReportPermissionDetailActionsApi,
      action.payload,
    );
    toastSuccess('You have updated successfully');
    history.push(AppRouteConst.AUDIT_TYPE);
    yield put(updateInternalAuditReportActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      if (!e?.errorList) {
        toastError(e);
      }
      yield put(updateInternalAuditReportActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateInternalAuditReportActions.failure(undefined));
    }
  }
}

function* getListInspectionFollowUpSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      isLeftMenu,
      handleSuccess,
      ...other
    } = action.payload;

    const response = yield call(getListInspectionFollowUpApiRequest, other);
    const { data } = response;
    yield put(getListInspectionFollowUpActions.success(data));
    if (handleSuccess) handleSuccess();
  } catch (e) {
    toastError(e);
    yield put(getListInspectionFollowUpActions.failure());
  }
}

function* getInspectionFollowUpDetailSaga(action) {
  try {
    const response = yield call(
      getInspectionFollowUpDetailApiRequest,
      action.payload,
    );

    const { data } = response;

    yield put(getInspectionFollowUpDetailActions.success(data));
  } catch (e) {
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.AUDIT_TYPE);
    }
    toastError(e);
    yield put(getInspectionFollowUpDetailActions.failure());
  }
}

export default function* InternalAuditReportAndPermissionSaga() {
  yield all([
    yield takeLatest(
      deleteInternalAuditReportActions.request,
      deleteInternalAuditReportsSaga,
    ),
    yield takeLatest(
      getListInternalAuditReportActions.request,
      getListInternalAuditReportsSaga,
    ),
    // yield takeLatest(createInternalAuditReportActions.request, createInternalAuditReportSaga),
    yield takeLatest(
      getInternalAuditReportDetailActions.request,
      getInternalAuditReportDetailSaga,
    ),
    yield takeLatest(
      updateInternalAuditReportActions.request,
      updateInternalAuditReportSaga,
    ),
    yield takeLatest(
      getListInspectionFollowUpActions.request,
      getListInspectionFollowUpSaga,
    ),
    yield takeLatest(
      getInspectionFollowUpDetailActions.request,
      getInspectionFollowUpDetailSaga,
    ),
  ]);
}
