import { call, put, takeLatest, all, select } from '@redux-saga/core/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';

import {
  checkExitResponse,
  EventType,
} from 'models/api/event-type/event-type.model';
import { State } from 'store/reducer';
import {
  getEventTypeDetailActionsApi,
  getListEventTypesActionsApi,
  deleteEventTypeActionsApi,
  createEventTypeActionsApi,
  updateEventTypePermissionDetailActionsApi,
  getListCompanyActionsApi,
  checkExitCodeApi,
} from '../../api/event-type.api';
import {
  getEventTypeDetailActions,
  getListEventTypeActions,
  updateEventTypeActions,
  deleteEventTypeActions,
  createEventTypeActions,
  getListCompanyActions,
  checkExitCodeAction,
} from './event-type.action';

function* getListEventTypesSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      isLeftMenu,
      handleSuccess,
      ...other
    } = action.payload;
    const response = yield call(getListEventTypesActionsApi, other);

    const { data } = response;
    yield put(getListEventTypeActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListEventTypeActions.failure());
  }
}

function* getListCompanySaga(action) {
  try {
    const response = yield call(getListCompanyActionsApi, action.payload);

    const { data } = response;
    yield put(getListCompanyActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListCompanyActions.failure());
  }
}

function* deleteEventTypesSaga(action) {
  try {
    const { params, listEventTypes } = yield select(
      (state: State) => state.eventType,
    );
    yield call(deleteEventTypeActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listEventTypes.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteEventTypeActions.success(newParams));
    action.payload?.getListEventType();
    toastSuccess('You have deleted successfully');
  } catch (e) {
    toastError(e);
    yield put(deleteEventTypeActions.failure());
  }
}

function* createEventTypeSaga(action) {
  try {
    const params: EventType = {
      ...action.payload,
      isNew: undefined,
      resetForm: undefined,
    };
    yield call(createEventTypeActionsApi, params);
    yield put(createEventTypeActions.success());
    action.payload?.afterCreate();

    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createEventTypeActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createEventTypeActions.failure(undefined));
    }
  }
}

function* checkExitCodeSaga(action) {
  try {
    const { isExistField } = yield select((state: State) => state.eventType);
    const response = yield call(checkExitCodeApi, action.payload);
    if (action?.payload?.field === 'code') {
      const res: checkExitResponse = {
        isExistCode: response?.data?.isExist,
        isExistName: isExistField?.isExistName,
      };
      yield put(checkExitCodeAction.success(res));
    } else {
      const res: checkExitResponse = {
        isExistName: response?.data?.isExist,
        isExistCode: isExistField?.isExistCode,
      };
      yield put(checkExitCodeAction.success(res));
    }
  } catch (e) {
    toastError(e);
    yield put(checkExitCodeAction.failure(undefined));
  }
}

function* getEventTypeDetailSaga(action) {
  try {
    const response = yield call(getEventTypeDetailActionsApi, action.payload);
    const { data } = response;

    yield put(getEventTypeDetailActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getEventTypeDetailActions.failure());
  }
}

function* updateEventTypeSaga(action) {
  try {
    yield call(updateEventTypePermissionDetailActionsApi, action.payload);
    toastSuccess('You have updated successfully');
    action.payload?.afterUpdate();

    yield put(updateEventTypeActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updateEventTypeActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateEventTypeActions.failure(undefined));
    }
  }
}

export default function* EventTypeMasterSaga() {
  yield all([
    yield takeLatest(deleteEventTypeActions.request, deleteEventTypesSaga),
    yield takeLatest(getListCompanyActions.request, getListCompanySaga),
    yield takeLatest(getListEventTypeActions.request, getListEventTypesSaga),
    yield takeLatest(createEventTypeActions.request, createEventTypeSaga),
    yield takeLatest(getEventTypeDetailActions.request, getEventTypeDetailSaga),
    yield takeLatest(updateEventTypeActions.request, updateEventTypeSaga),
    yield takeLatest(checkExitCodeAction.request, checkExitCodeSaga),
  ]);
}
