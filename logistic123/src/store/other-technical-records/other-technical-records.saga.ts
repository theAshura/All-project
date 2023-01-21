import {
  createTemplateActionsApi,
  deleteTemplateActionsApi,
  getDetailTemplateActionApi,
  getListTemplateActionsApi,
  updateTemplateActionApi,
} from 'api/template.api';
import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import {
  createOtherTechnicalRecordsActionsApi,
  deleteOtherTechnicalRecordsActionsApi,
  getDetailOtherTechnicalRecordsActionsApi,
  getListOtherTechnicalRecordsActionsApi,
  updateOtherTechnicalRecordsActionsApi,
} from 'api/other-technical-records.api';
import {
  getListOtherTechnicalRecordsActions,
  createOtherTechnicalRecordsActions,
  deleteOtherTechnicalRecordsActions,
  getDetailOtherTechnicalRecords,
  updateOtherTechnicalRecordsActions,
  getListOtherTechnicalRecordsTemplateActions,
  deleteOtherTechnicalRecordsTemplateActions,
  createOtherTechnicalRecordsTemplateActions,
  getOtherTechnicalRecordsTemplateDetailActions,
  updateOtherTechnicalRecordsTemplateActions,
} from './other-technical-records.action';

function* getListOtherTechnicalRecordsSaga(action) {
  try {
    const {
      isRefreshLoading,
      handleSuccess,
      paramsList,
      isLeftMenu,
      ...other
    } = action.payload;

    const response = yield call(getListOtherTechnicalRecordsActionsApi, other);
    const { data } = response;
    yield put(getListOtherTechnicalRecordsActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListOtherTechnicalRecordsActions.failure());
  }
}
function* createOtherTechnicalRecordsSaga(action) {
  try {
    yield call(createOtherTechnicalRecordsActionsApi, action.payload);

    yield put(createOtherTechnicalRecordsActions.success());
    if (action.payload.handleSuccess) {
      action.payload.handleSuccess();
    }
    toastSuccess('You have created successfully');
  } catch (e) {
    toastError(e);
    yield put(createOtherTechnicalRecordsActions.failure());
  }
}
function* updateOtherTechnicalRecordsSaga(action) {
  try {
    yield call(updateOtherTechnicalRecordsActionsApi, action.payload);

    yield put(updateOtherTechnicalRecordsActions.success());
    if (action.payload.handleSuccess) {
      action.payload.handleSuccess();
    }
    toastSuccess('You have updated successfully');
  } catch (e) {
    toastError(e);
    yield put(updateOtherTechnicalRecordsActions.failure());
  }
}
function* deleteOtherTechnicalRecordsSaga(action) {
  try {
    yield call(deleteOtherTechnicalRecordsActionsApi, action.payload);

    yield put(deleteOtherTechnicalRecordsActions.success());
    if (action.payload.handleSuccess) {
      action.payload.handleSuccess();
    }
    toastSuccess('You have deleted successfully');
  } catch (e) {
    toastError(e);
    yield put(deleteOtherTechnicalRecordsActions.failure());
  }
}
function* getDetailOtherTechnicalRecordsSaga(action) {
  try {
    const response = yield call(
      getDetailOtherTechnicalRecordsActionsApi,
      action.payload,
    );

    const { data } = response;
    yield put(getDetailOtherTechnicalRecords.success(data));
  } catch (e) {
    yield put(getDetailOtherTechnicalRecords.failure());
  }
}

// Template

function* getListTemplateSaga(action) {
  try {
    const response = yield call(getListTemplateActionsApi, action.payload);
    const { data } = response;
    yield put(getListOtherTechnicalRecordsTemplateActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListOtherTechnicalRecordsTemplateActions.failure());
  }
}

function* deleteTemplateSaga(action) {
  try {
    yield call(deleteTemplateActionsApi, action.payload.ids);
    toastSuccess('You have deleted successfully');
    if (action.payload?.handleSuccess) {
      action.payload?.handleSuccess();
    }
    yield put(deleteOtherTechnicalRecordsTemplateActions.success());
  } catch (e) {
    toastError(e);
    yield put(deleteOtherTechnicalRecordsTemplateActions.failure());
  }
}

function* createTemplateSaga(action) {
  try {
    yield call(createTemplateActionsApi, action.payload);
    const response = yield call(getListTemplateActionsApi, {
      content: action.payload.module,
    });
    const { data } = response;
    const length = data?.gridTemplates?.data?.length || 0;
    const responseDetail =
      length > 0
        ? yield call(
            getDetailTemplateActionApi,
            data?.gridTemplates?.data[length - 1]?.id || '',
          )
        : null;
    yield put(
      createOtherTechnicalRecordsTemplateActions.success({
        gridTemplates: data?.gridTemplates,
        firstGridTemplateDetail: responseDetail?.data,
      }),
    );
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    yield put(
      createOtherTechnicalRecordsTemplateActions.failure(e?.errorList || []),
    );
  }
}

function* getTemplateDetailSaga(action) {
  try {
    const response = yield call(
      getDetailTemplateActionApi,
      action.payload.templateId,
    );
    const { data } = response;
    yield put(getOtherTechnicalRecordsTemplateDetailActions.success(data));
  } catch (e) {
    toastError(e);

    yield put(getOtherTechnicalRecordsTemplateDetailActions.failure());
  }
}

function* updateTemplateSaga(action) {
  try {
    yield call(updateTemplateActionApi, action.payload);
    toastSuccess('You have updated successfully');
    yield put(
      updateOtherTechnicalRecordsTemplateActions.success(action.payload),
    );
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    if (e?.message && e?.statusCode === 400) {
      toastError(e);
    }
    yield put(
      updateOtherTechnicalRecordsTemplateActions.failure(e?.errorList || []),
    );
  }
}

export default function* OtherTechnicalRecordsSaga() {
  yield all([
    yield takeLatest(
      getListOtherTechnicalRecordsActions.request,
      getListOtherTechnicalRecordsSaga,
    ),
    yield takeLatest(
      createOtherTechnicalRecordsActions.request,
      createOtherTechnicalRecordsSaga,
    ),
    yield takeLatest(
      deleteOtherTechnicalRecordsActions.request,
      deleteOtherTechnicalRecordsSaga,
    ),
    yield takeLatest(
      getDetailOtherTechnicalRecords.request,
      getDetailOtherTechnicalRecordsSaga,
    ),
    yield takeLatest(
      updateOtherTechnicalRecordsActions.request,
      updateOtherTechnicalRecordsSaga,
    ),
    yield takeLatest(
      getListOtherTechnicalRecordsTemplateActions.request,
      getListTemplateSaga,
    ),
    yield takeLatest(
      deleteOtherTechnicalRecordsTemplateActions.request,
      deleteTemplateSaga,
    ),
    yield takeLatest(
      createOtherTechnicalRecordsTemplateActions.request,
      createTemplateSaga,
    ),
    yield takeLatest(
      getOtherTechnicalRecordsTemplateDetailActions.request,
      getTemplateDetailSaga,
    ),
    yield takeLatest(
      updateOtherTechnicalRecordsTemplateActions.request,
      updateTemplateSaga,
    ),
  ]);
}
