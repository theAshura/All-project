import { call, put, all, takeLatest, select } from '@redux-saga/core/effects';
import { MessageErrorResponse } from 'models/store/user/user.model';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { State } from 'store/reducer';

import {
  getInspectionFollowUpApi,
  deleteInspectionFollowUpApi,
  ediInspectionFollowUpApi,
} from '../../api/inspection-follow-up.api';
import {
  getInspectionFollowUpAction,
  editInspectionFollowUpAction,
  deleteInspectionFollowUpActions,
} from './inspection-follow-up.action';

function* handleGetInspectionFollowUp(
  action: ReturnType<typeof getInspectionFollowUpAction.request>,
) {
  try {
    const { isRefreshLoading, paramsList, isLeftMenu, ...other } =
      action.payload;

    const response = yield call(getInspectionFollowUpApi, other);
    yield put(getInspectionFollowUpAction.success(response.data));
  } catch (e) {
    toastError(e);
    yield put(getInspectionFollowUpAction.failure());
  }
}

function* handleDeleteInspectionFollowUp(action) {
  try {
    const { params, listGroup } = yield select((state: State) => state.group);
    yield call(deleteInspectionFollowUpApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listGroup.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    toastSuccess('You have deleted successfully');

    yield put(deleteInspectionFollowUpActions.success(newParams));
    action.payload?.getList();
  } catch (e) {
    toastError(e);
    yield put(deleteInspectionFollowUpActions.failure());
  }
}

function* handleInspectionFollowUp(
  action: ReturnType<typeof editInspectionFollowUpAction.request>,
) {
  try {
    yield call(ediInspectionFollowUpApi, action.payload);
    yield put(editInspectionFollowUpAction.success());
    if (action.payload?.afterCreate) {
      action.payload?.afterCreate();
    }
    toastSuccess('You have updated successfully');
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    if (e?.statusCode === 400) {
      const message1: MessageErrorResponse[] = e?.errorList || [];
      const message2: MessageErrorResponse[] =
        e?.message?.map((i) => ({
          fieldName: i?.field,
          message: i?.message[0],
        })) || [];

      const messageTotal: MessageErrorResponse[] = [...message1, ...message2];
      yield put(editInspectionFollowUpAction.failure(messageTotal || []));
    } else {
      yield put(editInspectionFollowUpAction.failure(e));
    }
  }
}

export default function* inspectionFollowUpSaga() {
  yield all([
    yield takeLatest(
      getInspectionFollowUpAction.request,
      handleGetInspectionFollowUp,
    ),
    yield takeLatest(
      editInspectionFollowUpAction.request,
      handleInspectionFollowUp,
    ),
    yield takeLatest(
      deleteInspectionFollowUpActions.request,
      handleDeleteInspectionFollowUp,
    ),
  ]);
}
