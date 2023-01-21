import { all, call, put, takeLatest } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import {
  getListCompanyTypeActionsApi,
  deleteCompanyTypeActionsApi,
} from '../utils/api';
import { getListCompanyTypeActions, deleteCompanyTypeActions } from './action';

function* getListInspection(action) {
  try {
    const { handleSuccess, isLeftMenu, ...other } = action.payload;
    const response = yield call(getListCompanyTypeActionsApi, other);

    const { data } = response;

    yield put(getListCompanyTypeActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListCompanyTypeActions.failure());
  }
}

function* deleteDivisionSaga(action) {
  try {
    yield call(deleteCompanyTypeActionsApi, action.payload?.id);

    yield put(deleteCompanyTypeActions.success());
    toastSuccess('You have deleted successfully');
    if (action.payload?.handleSuccess) action.payload?.handleSuccess();
  } catch (e) {
    toastError(e);
    yield put(deleteCompanyTypeActions.failure());
  }
}

export default function* DivisionSaga() {
  yield all([
    yield takeLatest(getListCompanyTypeActions.request, getListInspection),
    yield takeLatest(deleteCompanyTypeActions.request, deleteDivisionSaga),
  ]);
}
