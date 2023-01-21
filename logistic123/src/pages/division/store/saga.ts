import { all, call, put, takeLatest } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import {
  getListDivisionActionsApi,
  deleteDivisionActionsApi,
} from '../utils/api';
import { getListDivisionActions, deleteDivisionActions } from './action';

function* getListDivision(action) {
  try {
    const { handleSuccess, isLeftMenu, ...params } = action.payload;
    const response = yield call(getListDivisionActionsApi, params);

    const { data } = response;
    handleSuccess?.();
    yield put(getListDivisionActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListDivisionActions.failure());
  }
}

function* deleteDivisionSaga(action) {
  try {
    yield call(deleteDivisionActionsApi, action.payload?.id);

    yield put(deleteDivisionActions.success());
    toastSuccess('You have deleted successfully');
    if (action.payload?.handleSuccess) action.payload?.handleSuccess();
  } catch (e) {
    toastError(e);
    yield put(deleteDivisionActions.failure());
  }
}

export default function* DivisionSaga() {
  yield all([
    yield takeLatest(getListDivisionActions.request, getListDivision),
    yield takeLatest(deleteDivisionActions.request, deleteDivisionSaga),
  ]);
}
