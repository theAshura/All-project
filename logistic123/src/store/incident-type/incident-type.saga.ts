import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';
import { checkExitResponse } from 'models/api/incident-type/incident-type.model';
import { State } from '../reducer';

import {
  getIncidentTypeDetailActions,
  getListIncidentTypeActions,
  updateIncidentTypeActions,
  deleteIncidentTypeActions,
  createIncidentTypeActions,
  checkExitCodeAction,
} from './incident-type.action';
import {
  getIncidentTypeDetailActionsApi,
  getListIncidentTypesActionsApi,
  deleteIncidentTypeActionsApi,
  createIncidentTypeActionsApi,
  updateIncidentTypeDetailActionsApi,
  checkExitCodeApi,
} from '../../api/incident-type.api';

function* getListIncidentTypesSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      isLeftMenu,
      handleSuccess,
      ...other
    } = action.payload;
    const response = yield call(getListIncidentTypesActionsApi, other);
    const { data } = response;
    yield put(getListIncidentTypeActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListIncidentTypeActions.failure());
  }
}

function* deleteIncidentTypesSaga(action) {
  try {
    const { params, listIncidentTypes } = yield select(
      (state: State) => state.incidentType,
    );
    yield call(deleteIncidentTypeActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listIncidentTypes.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteIncidentTypeActions.success(newParams));
    toastSuccess('You have deleted successfully');

    action.payload?.getListIncidentType();
  } catch (e) {
    toastError(e);
    yield put(deleteIncidentTypeActions.failure());
  }
}

function* createIncidentTypeSaga(action) {
  try {
    const { isNew, resetForm, ...params } = action.payload;

    yield call(createIncidentTypeActionsApi, params);
    yield put(createIncidentTypeActions.success());
    yield put(getListIncidentTypeActions.request({}));
    if (action.payload?.afterCreate) {
      action.payload?.afterCreate();
    }
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createIncidentTypeActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createIncidentTypeActions.failure(undefined));
    }
  }
}

function* getIncidentTypeDetailSaga(action) {
  try {
    const response = yield call(
      getIncidentTypeDetailActionsApi,
      action.payload,
    );
    const { data } = response;

    yield put(getIncidentTypeDetailActions.success(data));
  } catch (e) {
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.AUDIT_TYPE);
    }
    toastError(e);
    yield put(getIncidentTypeDetailActions.failure());
  }
}

function* updateIncidentTypeSaga(action) {
  try {
    yield call(updateIncidentTypeDetailActionsApi, action.payload);
    put(updateIncidentTypeActions.success());
    if (action.payload?.afterCreate) {
      action.payload?.afterCreate();
    }
    toastSuccess('You have updated successfully');
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e);
      }
      yield put(updateIncidentTypeActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateIncidentTypeActions.failure(undefined));
    }
  }
}

function* checkExitCodeSaga(action) {
  try {
    const { isExistField } = yield select((state: State) => state.incidentType);
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

export default function* IncidentTypeAndSaga() {
  yield all([
    yield takeLatest(
      deleteIncidentTypeActions.request,
      deleteIncidentTypesSaga,
    ),
    yield takeLatest(
      getListIncidentTypeActions.request,
      getListIncidentTypesSaga,
    ),
    yield takeLatest(createIncidentTypeActions.request, createIncidentTypeSaga),
    yield takeLatest(
      getIncidentTypeDetailActions.request,
      getIncidentTypeDetailSaga,
    ),
    yield takeLatest(updateIncidentTypeActions.request, updateIncidentTypeSaga),
    yield takeLatest(checkExitCodeAction.request, checkExitCodeSaga),
  ]);
}
