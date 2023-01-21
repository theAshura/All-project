import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import {
  getListReportTemplatesActionsApi,
  getReportTemplateDetailActionsApi,
  deleteReportTemplateActionsApi,
  createReportTemplateActionsApi,
  getVersionNumberActionApi,
  updateReportTemplateDetailActionsApi,
} from 'api/report-template.api';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';

import { ReportTemplate } from 'models/api/report-template/report-template.model';
import {
  getReportTemplateDetailActions,
  getListReportTemplateActions,
  updateReportTemplateActions,
  deleteReportTemplateActions,
  createReportTemplateActions,
  getVersionNumberActions,
} from './report-template.action';

function* getListReportTemplatesSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      handleSuccess,
      isLeftMenu,
      ...other
    } = action.payload;
    const response = yield call(getListReportTemplatesActionsApi, other);
    const { data } = response;
    handleSuccess?.();
    yield put(getListReportTemplateActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListReportTemplateActions.failure());
  }
}

function* getVersionNumberSaga(action) {
  try {
    const response = yield call(getVersionNumberActionApi, action.payload);
    const { data } = response;
    yield put(getVersionNumberActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getVersionNumberActions.failure());
  }
}

function* deleteReportTemplatesSaga(action) {
  try {
    yield call(deleteReportTemplateActionsApi, action.payload?.id);

    yield put(deleteReportTemplateActions.success());
    toastSuccess('You have deleted successfully');

    action.payload?.getListReportTemplate();
  } catch (e) {
    toastError(e);
    yield put(deleteReportTemplateActions.failure());
  }
}

function* createReportTemplateSaga(action) {
  try {
    const isNew = action.payload?.isNew;
    const params: ReportTemplate = {
      ...action.payload,
      isNew: undefined,
      resetForm: undefined,
    };
    yield call(createReportTemplateActionsApi, params);
    yield put(createReportTemplateActions.success());
    toastSuccess('You have created successfully');
    if (!isNew) {
      history.push(AppRouteConst.REPORT_TEMPLATE);
    } else {
      action.payload?.resetForm();
    }
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createReportTemplateActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createReportTemplateActions.failure(undefined));
    }
  }
}

function* getReportTemplateDetailSaga(action) {
  try {
    const response = yield call(
      getReportTemplateDetailActionsApi,
      action.payload,
    );
    const { data } = response;

    yield put(getReportTemplateDetailActions.success(data));
  } catch (e) {
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.REPORT_TEMPLATE);
    }
    toastError(e);
    yield put(getReportTemplateDetailActions.failure());
  }
}

function* updateReportTemplateSaga(action) {
  try {
    yield call(updateReportTemplateDetailActionsApi, action.payload);
    toastSuccess('You have updated successfully');
    history.push(AppRouteConst.REPORT_TEMPLATE);
    yield put(updateReportTemplateActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(updateReportTemplateActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateReportTemplateActions.failure(undefined));
    }
  }
}

export default function* ReportTemplateAndPermissionSaga() {
  yield all([
    yield takeLatest(
      deleteReportTemplateActions.request,
      deleteReportTemplatesSaga,
    ),
    yield takeLatest(
      getListReportTemplateActions.request,
      getListReportTemplatesSaga,
    ),
    yield takeLatest(getVersionNumberActions.request, getVersionNumberSaga),
    yield takeLatest(
      createReportTemplateActions.request,
      createReportTemplateSaga,
    ),
    yield takeLatest(
      getReportTemplateDetailActions.request,
      getReportTemplateDetailSaga,
    ),
    yield takeLatest(
      updateReportTemplateActions.request,
      updateReportTemplateSaga,
    ),
  ]);
}
