import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import {
  createSurveyClassInfoActionsApi,
  deleteSurveyClassInfoActionsApi,
  getDetailSurveyClassInfoActionsApi,
  getListSurveyClassInfoActionsApi,
  updateSurveyClassInfoActionsApi,
} from 'api/survey-class-info.api';
import {
  createTemplateActionsApi,
  deleteTemplateActionsApi,
  getDetailTemplateActionApi,
  getListTemplateActionsApi,
  updateTemplateActionApi,
} from 'api/template.api';
import {
  getListSurveyClassInfoActions,
  createSurveyClassInfoActions,
  deleteSurveyClassInfoActions,
  getDetailSurveyClassInfo,
  updateSurveyClassInfoActions,
  getSurveyClassInfoListTemplateActions,
  updateSurveyClassInfoTemplateActions,
  getSurveyClassInfoTemplateDetailActions,
  createSurveyClassInfoTemplateActions,
  deleteSurveyClassInfoTemplateActions,
} from './survey-class-info.action';

function* getListSurveyClassInfoSaga(action) {
  try {
    const {
      isRefreshLoading,
      handleSuccess,
      paramsList,
      isLeftMenu,
      ...other
    } = action.payload;

    const response = yield call(getListSurveyClassInfoActionsApi, other);
    const { data } = response;
    yield put(getListSurveyClassInfoActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e?.message[0].message[0]);
    yield put(getListSurveyClassInfoActions.failure());
  }
}
function* createSurveyClassInfoSaga(action) {
  try {
    const response = yield call(
      createSurveyClassInfoActionsApi,
      action.payload,
    );

    yield put(createSurveyClassInfoActions.success());
    if (action.payload.afterCreate) {
      action.payload.afterCreate();
    }
    toastSuccess(response?.data?.message);
  } catch (e) {
    toastError(e?.message[0].message[0]);
    yield put(createSurveyClassInfoActions.failure());
  }
}
function* updateSurveyClassInfoSaga(action) {
  try {
    const response = yield call(
      updateSurveyClassInfoActionsApi,
      action.payload,
    );

    yield put(updateSurveyClassInfoActions.success());
    if (action.payload.afterUpdate) {
      action.payload.afterUpdate();
    }
    toastSuccess(response?.data?.message);
  } catch (e) {
    toastError(e?.message[0].message[0]);
    yield put(updateSurveyClassInfoActions.failure());
  }
}
function* deleteSurveyClassInfoSaga(action) {
  try {
    const response = yield call(
      deleteSurveyClassInfoActionsApi,
      action.payload,
    );

    yield put(deleteSurveyClassInfoActions.success());
    if (action.payload.afterDelete) {
      action.payload.afterDelete();
    }
    toastSuccess(response?.data?.message);
  } catch (e) {
    toastError(e?.message[0].message[0]);
    yield put(deleteSurveyClassInfoActions.failure());
  }
}
function* getDetailSurveyClassInfoSaga(action) {
  try {
    const response = yield call(
      getDetailSurveyClassInfoActionsApi,
      action.payload,
    );

    const { data } = response;
    yield put(getDetailSurveyClassInfo.success(data));
  } catch (e) {
    yield put(getDetailSurveyClassInfo.failure());
  }
}

// Template

function* getListTemplateSaga(action) {
  try {
    const response = yield call(getListTemplateActionsApi, action.payload);
    const { data } = response;
    yield put(getSurveyClassInfoListTemplateActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getSurveyClassInfoListTemplateActions.failure());
  }
}

function* deleteTemplateSaga(action) {
  try {
    yield call(deleteTemplateActionsApi, action.payload.ids);
    toastSuccess('You have deleted successfully');
    if (action.payload?.handleSuccess) {
      action.payload?.handleSuccess();
    }
    yield put(deleteSurveyClassInfoTemplateActions.success());
  } catch (e) {
    toastError(e);
    yield put(deleteSurveyClassInfoTemplateActions.failure());
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
      createSurveyClassInfoTemplateActions.success({
        gridTemplates: data?.gridTemplates,
        firstGridTemplateDetail: responseDetail?.data,
      }),
    );
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    yield put(createSurveyClassInfoTemplateActions.failure(e?.errorList || []));
  }
}

function* getTemplateDetailSaga(action) {
  try {
    const response = yield call(
      getDetailTemplateActionApi,
      action.payload.templateId,
    );
    const { data } = response;
    yield put(getSurveyClassInfoTemplateDetailActions.success(data));
  } catch (e) {
    toastError(e);

    yield put(getSurveyClassInfoTemplateDetailActions.failure());
  }
}

function* updateTemplateSaga(action) {
  try {
    yield call(updateTemplateActionApi, action.payload);
    toastSuccess('You have updated successfully');
    yield put(updateSurveyClassInfoTemplateActions.success(action.payload));
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    if (e?.message && e?.statusCode === 400) {
      toastError(e);
    }
    yield put(updateSurveyClassInfoTemplateActions.failure(e?.errorList || []));
  }
}

export default function* SurveyClassInfoSaga() {
  yield all([
    yield takeLatest(
      getListSurveyClassInfoActions.request,
      getListSurveyClassInfoSaga,
    ),
    yield takeLatest(
      createSurveyClassInfoActions.request,
      createSurveyClassInfoSaga,
    ),
    yield takeLatest(
      deleteSurveyClassInfoActions.request,
      deleteSurveyClassInfoSaga,
    ),
    yield takeLatest(
      getDetailSurveyClassInfo.request,
      getDetailSurveyClassInfoSaga,
    ),
    yield takeLatest(
      updateSurveyClassInfoActions.request,
      updateSurveyClassInfoSaga,
    ),
    yield takeLatest(
      getSurveyClassInfoListTemplateActions.request,
      getListTemplateSaga,
    ),
    yield takeLatest(
      deleteSurveyClassInfoTemplateActions.request,
      deleteTemplateSaga,
    ),
    yield takeLatest(
      createSurveyClassInfoTemplateActions.request,
      createTemplateSaga,
    ),
    yield takeLatest(
      getSurveyClassInfoTemplateDetailActions.request,
      getTemplateDetailSaga,
    ),
    yield takeLatest(
      updateSurveyClassInfoTemplateActions.request,
      updateTemplateSaga,
    ),
  ]);
}
