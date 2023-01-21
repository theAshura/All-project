import {
  all,
  call,
  put,
  takeLatest,
  takeEvery,
} from '@redux-saga/core/effects';

import {
  getListTemplateActionsApi,
  deleteTemplateActionsApi,
  createTemplateActionsApi,
  getDetailTemplateActionApi,
  updateTemplateActionApi,
} from 'api/template.api';

import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import {
  createTemplateActions,
  createTemplateDictionaryActions,
  deleteTemplateActions,
  deleteTemplateDictionaryActions,
  getListTemplateActions,
  getListTemplateDictionaryActions,
  getTemplateDetailActions,
  getTemplateDetailDictionaryActions,
  updateTemplateActions,
  updateTemplateDictionaryActions,
} from './template.action';

function* getListTemplateSaga(action) {
  try {
    const response = yield call(getListTemplateActionsApi, action.payload);
    const { data } = response;
    yield put(getListTemplateActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListTemplateActions.failure());
  }
}

function* deleteTemplateSaga(action) {
  try {
    yield call(deleteTemplateActionsApi, action.payload.ids);
    toastSuccess('You have deleted successfully');
    action.payload?.getList?.();
    yield put(deleteTemplateActions.success());
  } catch (e) {
    toastError(e);
    yield put(deleteTemplateActions.failure());
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
      createTemplateActions.success({
        gridTemplates: data?.gridTemplates,
        firstGridTemplateDetail: responseDetail?.data,
      }),
    );
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    yield put(createTemplateActions.failure(e?.errorList || []));
  }
}

function* getTemplateDetailSaga(action) {
  try {
    const response = yield call(
      getDetailTemplateActionApi,
      action.payload.templateId,
    );
    const { data } = response;
    yield put(getTemplateDetailActions.success(data));
  } catch (e) {
    toastError(e);
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.SHORE_RANK);
    }
    yield put(getTemplateDetailActions.failure());
  }
}

function* updateTemplateSaga(action) {
  try {
    yield call(updateTemplateActionApi, action.payload);
    put(updateTemplateActions.success(action.payload));

    toastSuccess('You have updated successfully');
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    if (e?.message && e?.statusCode === 400) {
      toastError(e);
    }
    yield put(updateTemplateActions.failure(e?.errorList || []));
  }
}

// NOTED: New template sagas
function* getListTemplateDictionarySaga(action) {
  try {
    const response = yield call(getListTemplateActionsApi, action.payload);
    const { data } = response;
    yield put(
      getListTemplateDictionaryActions.success({
        ...data,
        templateName: action.payload.content,
      }),
    );
  } catch (e) {
    toastError(e);
    yield put(getListTemplateDictionaryActions.failure());
  }
}

function* deleteTemplateDictionarySaga(action) {
  try {
    yield call(deleteTemplateActionsApi, action.payload.ids);
    toastSuccess('You have deleted successfully');
    if (action.payload?.getList) {
      action.payload?.getList();
    }
    yield put(deleteTemplateDictionaryActions.success());
  } catch (e) {
    toastError(e);
    yield put(deleteTemplateDictionaryActions.failure());
  }
}

function* createTemplateDictionarySaga(action) {
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
      createTemplateDictionaryActions.success({
        templateName: action.payload.module,
        gridTemplates: data?.gridTemplates,
        firstGridTemplateDetail: responseDetail?.data,
      }),
    );
    action?.payload?.handleSuccess?.();
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    yield put(createTemplateDictionaryActions.failure(e?.errorList || []));
  }
}

function* getTemplateDetailDictionarySaga(action) {
  try {
    const response = yield call(
      getDetailTemplateActionApi,
      action.payload.templateId,
    );
    const { data } = response;
    yield put(
      getTemplateDetailDictionaryActions.success({
        ...data,
        templateName: action.payload.content,
      }),
    );
    action?.payload?.handleSuccess?.();
  } catch (e) {
    toastError(e);
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.SHORE_RANK);
    }
    yield put(getTemplateDetailDictionaryActions.failure());
  }
}

function* updateTemplateDictionarySaga(action) {
  try {
    yield call(updateTemplateActionApi, action.payload);
    yield put(updateTemplateDictionaryActions.success(action.payload));
    action?.payload?.handleSuccess?.();
    toastSuccess('You have updated successfully');
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    if (e?.message && e?.statusCode === 400) {
      toastError(e);
    }
    yield put(updateTemplateDictionaryActions.failure(e?.errorList || []));
  }
}

export default function* templateSaga() {
  yield all([
    yield takeLatest(getListTemplateActions.request, getListTemplateSaga),
    yield takeLatest(deleteTemplateActions.request, deleteTemplateSaga),
    yield takeLatest(createTemplateActions.request, createTemplateSaga),
    yield takeLatest(getTemplateDetailActions.request, getTemplateDetailSaga),
    yield takeLatest(updateTemplateActions.request, updateTemplateSaga),
    yield takeEvery(
      getListTemplateDictionaryActions.request,
      getListTemplateDictionarySaga,
    ),
    yield takeLatest(
      deleteTemplateDictionaryActions.request,
      deleteTemplateDictionarySaga,
    ),
    yield takeLatest(
      createTemplateDictionaryActions.request,
      createTemplateDictionarySaga,
    ),
    yield takeLatest(
      getTemplateDetailDictionaryActions.request,
      getTemplateDetailDictionarySaga,
    ),
    yield takeLatest(
      updateTemplateDictionaryActions.request,
      updateTemplateDictionarySaga,
    ),
  ]);
}
