import { call, put, takeLatest, all } from '@redux-saga/core/effects';
// import { select } from 'redux-saga/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import {
  getLisAttachmentKitActionsApi,
  deleteAttachmentKitActionsApi,
  updateAttachmentKitActionsApi,
  getAttachmentKitDetailApi,
  createAttachmentKitActionsApi,
} from 'api/attachment-kit.api';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import {
  deleteAttachmentKitActions,
  getAttachmentKitDetailActions,
  getListAttachmentKitSActions,
  updateAttachmentKitActions,
  createAttachmentKitActions,
} from './attachment-kit.action';

function* getListAttachmentKitSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      handleSuccess,
      isLeftMenu,
      ...other
    } = action.payload;

    const response = yield call(getLisAttachmentKitActionsApi, other);
    const { data } = response;
    handleSuccess?.();
    yield put(getListAttachmentKitSActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListAttachmentKitSActions.failure());
  }
}

function* deleteAttachmentKitSaga(action) {
  try {
    yield call(deleteAttachmentKitActionsApi, action.payload?.id);

    yield put(deleteAttachmentKitActions.success());
    toastSuccess('You have deleted successfully');
    if (action.payload?.handleSuccess) action.payload?.handleSuccess();
  } catch (e) {
    toastError(e);
    yield put(deleteAttachmentKitActions.failure());
  }
}

function* createAttachmentKitSaga(action) {
  try {
    yield call(createAttachmentKitActionsApi, action.payload);

    yield put(createAttachmentKitActions.success());
    toastSuccess('You have created successfully');
    history.push(AppRouteConst.ATTACHMENT_KIT);
  } catch (e) {
    if (e?.statusCode === 400) {
      if (!e?.errorList?.length) {
        toastError(e);
      }
      yield put(createAttachmentKitActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createAttachmentKitActions.failure(undefined));
    }
  }
}

function* getAttachmentKitDetailSaga(action) {
  try {
    const response = yield call(getAttachmentKitDetailApi, action.payload);
    yield put(getAttachmentKitDetailActions.success(response.data));
  } catch (e) {
    toastError(e);
    yield put(getAttachmentKitDetailActions.failure());
  }
}

function* updateAttachmentKitDetailSaga(action) {
  try {
    yield call(updateAttachmentKitActionsApi, action.payload);
    yield put(updateAttachmentKitActions.success());
    history.push(AppRouteConst.ATTACHMENT_KIT);
    toastSuccess('You have updated successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      if (!e?.errorList?.length) {
        toastError(e);
      }
      yield put(updateAttachmentKitActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateAttachmentKitActions.failure(undefined));
    }
  }
}

export default function* AttachmentKitSaga() {
  yield all([
    yield takeLatest(
      deleteAttachmentKitActions.request,
      deleteAttachmentKitSaga,
    ),
    yield takeLatest(
      getListAttachmentKitSActions.request,
      getListAttachmentKitSaga,
    ),
    yield takeLatest(
      createAttachmentKitActions.request,
      createAttachmentKitSaga,
    ),
    yield takeLatest(
      getAttachmentKitDetailActions.request,
      getAttachmentKitDetailSaga,
    ),
    yield takeLatest(
      updateAttachmentKitActions.request,
      updateAttachmentKitDetailSaga,
    ),
  ]);
}
