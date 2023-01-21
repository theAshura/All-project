import {
  call,
  put,
  takeLatest,
  takeEvery,
  all,
} from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import {
  getListSummaryWebServicesActionsApi,
  updateVesselSummaryActionsApi,
  getVesselSummaryActionsApi,
  getListSummaryAttachmentsAndRemarksActionsApi,
  createSummaryAttachmentAndRemarkActionsApi,
  updateSummaryAttachmentAndRemarkActionsApi,
  deleteSummaryAttachmentAndRemarkActionsApi,
  getListVesselFeedbackAndRemarkActionsApi,
  createVesselFeedbackAndRemarkActionsApi,
  updateVesselFeedbackAndRemarkActionsApi,
  deleteFeedbackAndRemarkActionsApi,
  getVesselSummaryByTabActionsApi,
  deleteSummaryWebServicesActionsApi,
  updateSummaryWebServicesActionsApi,
  createSummaryWebServicesActionsApi,
} from '../utils/api/summary.api';
import {
  getVesselSummaryActions,
  updateVesselSummaryActions,
  getSummaryAttachmentsAndRemarksActions,
  updateSummaryAttachmentsAndRemarksActions,
  createSummaryAttachmentsAndRemarksActions,
  deleteSummaryAttachmentsAndRemarksActions,
  getFeedbackAndRemarksActions,
  createFeedbackAndRemarksActions,
  updateFeedbackAndRemarksActions,
  deleteFeedbackAndRemarksActions,
  getSummaryByTabActions,
  getSummaryWebServicesActions,
  updateSummaryWebServicesActions,
  createSummaryWebServicesActions,
  deleteSummaryWebServicesActions,
} from './vessel-summary.action';

function* getFeedbackAndRemarksSaga(action) {
  try {
    const response = yield call(
      getListVesselFeedbackAndRemarkActionsApi,
      action.payload,
    );
    const { data } = response;
    yield put(getFeedbackAndRemarksActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getFeedbackAndRemarksActions.failure());
  }
}

function* createFeedbackAndRemarksSaga(action) {
  try {
    const { handleSuccess, ...other } = action.payload;
    yield call(createVesselFeedbackAndRemarkActionsApi, other);
    handleSuccess?.();
    yield put(createFeedbackAndRemarksActions.success());
    toastSuccess('You have created successfully');
  } catch (e) {
    toastError(e);
    yield put(createFeedbackAndRemarksActions.failure(e));
  }
}

function* updateFeedbackAndRemarksSaga(action) {
  try {
    const { handleSuccess, ...other } = action.payload;
    yield call(updateVesselFeedbackAndRemarkActionsApi, other);
    handleSuccess?.();
    yield put(updateFeedbackAndRemarksActions.success());
    toastSuccess('You have updated successfully');
  } catch (e) {
    toastError(e);
    yield put(updateFeedbackAndRemarksActions.failure(e));
  }
}

function* deleteFeedbackAndRemarkSaga(action) {
  try {
    const { handleSuccess, ...other } = action.payload;
    yield call(deleteFeedbackAndRemarkActionsApi, other);
    toastSuccess('You have deleted successfully');
    handleSuccess?.();
    yield put(deleteFeedbackAndRemarksActions.success());
  } catch (e) {
    toastError(e);
    yield put(deleteFeedbackAndRemarksActions.failure(e));
  }
}

function* getSummaryAttachmentsAndRemarksSaga(action) {
  try {
    const response = yield call(
      getListSummaryAttachmentsAndRemarksActionsApi,
      action.payload,
    );
    const { data } = response;
    yield put(getSummaryAttachmentsAndRemarksActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getSummaryAttachmentsAndRemarksActions.failure());
  }
}

function* createVesselFeedbackAndRemarkSaga(action) {
  try {
    const { handleSuccess, ...other } = action.payload;
    yield call(createSummaryAttachmentAndRemarkActionsApi, other);
    handleSuccess?.();
    yield put(createSummaryAttachmentsAndRemarksActions.success());
    toastSuccess('You have created successfully');
  } catch (e) {
    toastError(e);
    yield put(createSummaryAttachmentsAndRemarksActions.failure(e));
  }
}

function* updateSummaryAttachmentAndRemarkSaga(action) {
  try {
    const { handleSuccess, isDelete, ...other } = action.payload;
    yield call(updateSummaryAttachmentAndRemarkActionsApi, other);
    handleSuccess?.();
    yield put(updateSummaryAttachmentsAndRemarksActions.success());
    if (isDelete) {
      toastSuccess('You have deleted successfully');
    } else {
      toastSuccess('You have updated successfully');
    }
  } catch (e) {
    toastError(e);
    yield put(updateSummaryAttachmentsAndRemarksActions.failure(e));
  }
}

function* deleteSummaryAttachmentsAndRemarksSaga(action) {
  try {
    const { handleSuccess, ...other } = action.payload;
    yield call(deleteSummaryAttachmentAndRemarkActionsApi, other);
    toastSuccess('You have deleted successfully');
    handleSuccess?.();
    yield put(deleteSummaryAttachmentsAndRemarksActions.success());
  } catch (e) {
    toastError(e);
    yield put(deleteSummaryAttachmentsAndRemarksActions.failure(e));
  }
}

function* getVesselSummarySaga(action) {
  try {
    const response = yield call(getVesselSummaryActionsApi, action.payload);
    const { data } = response;
    yield put(getVesselSummaryActions.success(data));
    action.payload?.handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getVesselSummaryActions.failure(e));
  }
}

function* updateVesselSummarySaga(action) {
  try {
    yield call(updateVesselSummaryActionsApi, action.payload);
    action.payload?.handleSuccess?.();
    yield put(updateVesselSummaryActions.success());
    toastSuccess('You have updated successfully');
  } catch (e) {
    toastError(e);
    yield put(updateVesselSummaryActions.failure(e));
  }
}

function* getSummaryByTabSaga(action) {
  try {
    const response = yield call(
      getVesselSummaryByTabActionsApi,
      action.payload,
    );
    const { data } = response;
    yield put(getSummaryByTabActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getSummaryByTabActions.failure(e));
  }
}

function* getSummaryWebServicesSaga(action) {
  try {
    const response = yield call(
      getListSummaryWebServicesActionsApi,
      action.payload,
    );
    const { data } = response;
    yield put(getSummaryWebServicesActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getSummaryWebServicesActions.failure());
  }
}

function* createSummaryWebServicesSaga(action) {
  try {
    const { handleSuccess, ...other } = action.payload;
    yield call(createSummaryWebServicesActionsApi, other);
    handleSuccess?.();
    yield put(createSummaryWebServicesActions.success());
    toastSuccess('You have created successfully');
  } catch (e) {
    toastError(e);
    yield put(createSummaryAttachmentsAndRemarksActions.failure(e));
  }
}

function* updateSummaryWebServicesSaga(action) {
  try {
    const { handleSuccess, isDelete, ...other } = action.payload;
    yield call(updateSummaryWebServicesActionsApi, other);
    handleSuccess?.();
    yield put(updateSummaryWebServicesActions.success());
    if (isDelete) {
      toastSuccess('You have deleted successfully');
    } else {
      toastSuccess('You have updated successfully');
    }
  } catch (e) {
    toastError(e);
    yield put(updateSummaryWebServicesActions.failure(e));
  }
}

function* deleteSummaryWebServicesSaga(action) {
  try {
    const { handleSuccess, ...other } = action.payload;
    yield call(deleteSummaryWebServicesActionsApi, other);
    toastSuccess('You have deleted successfully');
    handleSuccess?.();
    yield put(deleteSummaryWebServicesActions.success());
  } catch (e) {
    toastError(e);
    yield put(deleteSummaryWebServicesActions.failure(e));
  }
}

export default function* VesselSummarySaga() {
  yield all([
    yield takeLatest(
      getFeedbackAndRemarksActions.request,
      getFeedbackAndRemarksSaga,
    ),
    yield takeLatest(
      createFeedbackAndRemarksActions.request,
      createFeedbackAndRemarksSaga,
    ),
    yield takeLatest(
      updateFeedbackAndRemarksActions.request,
      updateFeedbackAndRemarksSaga,
    ),
    yield takeLatest(
      deleteFeedbackAndRemarksActions.request,
      deleteFeedbackAndRemarkSaga,
    ),
    yield takeLatest(
      getSummaryAttachmentsAndRemarksActions.request,
      getSummaryAttachmentsAndRemarksSaga,
    ),
    yield takeLatest(
      createSummaryAttachmentsAndRemarksActions.request,
      createVesselFeedbackAndRemarkSaga,
    ),
    yield takeLatest(
      updateSummaryAttachmentsAndRemarksActions.request,
      updateSummaryAttachmentAndRemarkSaga,
    ),
    yield takeLatest(
      deleteSummaryAttachmentsAndRemarksActions.request,
      deleteSummaryAttachmentsAndRemarksSaga,
    ),
    yield takeEvery(getVesselSummaryActions.request, getVesselSummarySaga),
    yield takeLatest(
      updateVesselSummaryActions.request,
      updateVesselSummarySaga,
    ),
    yield takeLatest(getSummaryByTabActions.request, getSummaryByTabSaga),

    yield takeLatest(
      getSummaryWebServicesActions.request,
      getSummaryWebServicesSaga,
    ),
    yield takeLatest(
      createSummaryWebServicesActions.request,
      createSummaryWebServicesSaga,
    ),
    yield takeLatest(
      updateSummaryWebServicesActions.request,
      updateSummaryWebServicesSaga,
    ),
    yield takeLatest(
      deleteSummaryWebServicesActions.request,
      deleteSummaryWebServicesSaga,
    ),
  ]);
}
