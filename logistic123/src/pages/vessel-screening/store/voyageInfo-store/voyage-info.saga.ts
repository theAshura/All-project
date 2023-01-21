import { toastError } from 'helpers/notification.helper';
import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import {
  getListVoyageInfoActionsApi,
  getVoyageInfoDetailActionsApi,
} from 'pages/vessel-screening/utils/api/voyage-info.api';
import {
  getListVoyageInfoActions,
  getVoyageInfoDetailActions,
} from './voyage-info.action';

function* getListVoyageInfoSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      handleSuccess,
      isLeftMenu,
      ...other
    } = action.payload;
    const response = yield call(getListVoyageInfoActionsApi, other);

    const { data } = response;
    handleSuccess?.();
    yield put(getListVoyageInfoActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListVoyageInfoActions.failure());
  }
}

function* getVoyageInfoDetailSaga(action) {
  try {
    const response = yield call(getVoyageInfoDetailActionsApi, action.payload);
    const { data } = response;

    yield put(getVoyageInfoDetailActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getVoyageInfoDetailActions.failure());
  }
}

export default function* VoyageInfoMasterSaga() {
  yield all([
    yield takeLatest(getListVoyageInfoActions.request, getListVoyageInfoSaga),
    yield takeLatest(
      getVoyageInfoDetailActions.request,
      getVoyageInfoDetailSaga,
    ),
  ]);
}
