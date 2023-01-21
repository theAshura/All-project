import { all, call, put, takeLatest } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import {
  getListDivisionMappingActionsApi,
  deleteDivisionMappingActionsApi,
} from '../utils/api';
import {
  getListDivisionMappingActions,
  deleteDivisionMappingActions,
} from './action';

function* getListDivision(action) {
  try {
    const { handleSuccess, isLeftMenu, ...other } = action.payload;
    const response = yield call(getListDivisionMappingActionsApi, other);
    handleSuccess?.();
    const { data } = response;

    yield put(getListDivisionMappingActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListDivisionMappingActions.failure());
  }
}

function* deleteDivisionMappingSaga(action) {
  try {
    yield call(deleteDivisionMappingActionsApi, action.payload?.id);

    yield put(deleteDivisionMappingActions.success());
    toastSuccess('You have deleted successfully');
    if (action.payload?.handleSuccess) action.payload?.handleSuccess();
  } catch (e) {
    toastError(e);
    yield put(deleteDivisionMappingActions.failure());
  }
}

export default function* DivisionMappingSaga() {
  yield all([
    yield takeLatest(getListDivisionMappingActions.request, getListDivision),
    yield takeLatest(
      deleteDivisionMappingActions.request,
      deleteDivisionMappingSaga,
    ),
  ]);
}
