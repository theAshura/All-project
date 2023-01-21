import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';

import {
  createReportOfFindingActionsApi,
  deleteReportOfFindingActionsApi,
  getListReportOfFindingsActionsApi,
  getReportOfFindingDetailActionsApi,
  updateReportOfFindingDetailActionsApi,
} from 'api/report-of-finding.api';
import { CreateReportOfFindingParams } from 'models/api/report-of-finding/report-of-finding.model';
import { MessageErrorResponse } from 'models/store/MessageError.model';
import { State } from '../reducer';
import {
  createReportOfFindingActions,
  deleteReportOfFindingActions,
  getListReportOfFindingActions,
  getReportOfFindingDetailActions,
  updateReportOfFindingActions,
} from './report-of-finding.action';

function* getListReportOfFindingSaga(action) {
  try {
    const {
      isRefreshLoading,
      handleSuccess,
      paramsList,
      isLeftMenu,
      ...other
    } = action.payload;
    const response = yield call(getListReportOfFindingsActionsApi, other);
    const { data } = response;
    yield put(getListReportOfFindingActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListReportOfFindingActions.failure());
  }
}

function* deleteReportOfFindingSaga(action) {
  try {
    const { params, listReportOfFindings } = yield select(
      (state: State) => state.charterOwner,
    );
    yield call(deleteReportOfFindingActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listReportOfFindings.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    toastSuccess('You have deleted successfully');
    yield put(deleteReportOfFindingActions.success(newParams));
    action.payload?.getListReportOfFinding();
  } catch (e) {
    toastError(e);
    yield put(deleteReportOfFindingActions.failure());
  }
}

function* createReportOfFindingSaga(action) {
  try {
    const params: CreateReportOfFindingParams = {
      ...action.payload,
    };
    yield call(createReportOfFindingActionsApi, params);
    yield put(createReportOfFindingActions.success());
    toastSuccess('You have created successfully');
    history.push(AppRouteConst.REPORT_OF_FINDING);
  } catch (e) {
    if (e?.statusCode === 400) {
      const message1: MessageErrorResponse[] = e?.errorList || [];
      const message2: MessageErrorResponse[] =
        (e &&
          e.message &&
          e?.message?.map((i) => ({
            fieldName: i?.field,
            message: i?.message[0],
          }))) ||
        [];
      const messageTotal: MessageErrorResponse[] = [...message1, ...message2];

      yield put(createReportOfFindingActions.failure(messageTotal || []));
    } else {
      toastError(e);
      yield put(createReportOfFindingActions.failure(undefined));
    }
  }
}

function* getReportOfFindingDetailSaga(action) {
  try {
    const response = yield call(
      getReportOfFindingDetailActionsApi,
      action.payload,
    );
    const { data } = response;
    yield put(getReportOfFindingDetailActions.success(data));
  } catch (e) {
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.REPORT_OF_FINDING);
    }
    toastError(e);
    yield put(getReportOfFindingDetailActions.failure());
  }
}

function* updateReportOfFindingSaga(action) {
  try {
    const response = yield call(
      updateReportOfFindingDetailActionsApi,
      action.payload,
    );
    const { data } = response;
    toastSuccess(data?.message);
    history.push(AppRouteConst.REPORT_OF_FINDING);
    yield put(updateReportOfFindingActions.success());
  } catch (e) {
    toastError(e);
    if (e?.statusCode === 400) {
      yield put(updateReportOfFindingActions.failure(e?.errorList));
    } else {
      yield put(updateReportOfFindingActions.failure(undefined));
    }
  }
}

export default function* ReportOfFindingSaga() {
  yield all([
    yield takeLatest(
      deleteReportOfFindingActions.request,
      deleteReportOfFindingSaga,
    ),
    yield takeLatest(
      getListReportOfFindingActions.request,
      getListReportOfFindingSaga,
    ),
    yield takeLatest(
      createReportOfFindingActions.request,
      createReportOfFindingSaga,
    ),
    yield takeLatest(
      getReportOfFindingDetailActions.request,
      getReportOfFindingDetailSaga,
    ),
    yield takeLatest(
      updateReportOfFindingActions.request,
      updateReportOfFindingSaga,
    ),
  ]);
}
