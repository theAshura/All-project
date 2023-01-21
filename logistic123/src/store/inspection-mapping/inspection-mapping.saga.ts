import { call, put, takeLatest, all } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';

import { CreateInspectionMappingParams } from 'models/api/inspection-mapping/inspection-mapping.model';

import { State } from '../reducer';
import {
  getInspectionMappingDetailActions,
  getListInspectionMappingActions,
  updateInspectionMappingActions,
  deleteInspectionMappingActions,
  createInspectionMappingActions,
  getListNatureOfFindingActions,
} from './inspection-mapping.action';
import {
  getInspectionMappingDetailActionsApi,
  getListInspectionMappingsActionsApi,
  deleteInspectionMappingActionsApi,
  createInspectionMappingActionsApi,
  getListNatureOfFindingsActionsApi,
  updateInspectionMappingPermissionDetailActionsApi,
} from '../../api/inspection-mapping.api';

function* getListInspectionMappingsSaga(action) {
  try {
    const {
      isRefreshLoading,
      handleSuccess,
      paramsList,
      isLeftMenu,
      ...other
    } = action.payload;

    const response = yield call(getListInspectionMappingsActionsApi, other);
    const { data } = response;
    handleSuccess?.();
    yield put(getListInspectionMappingActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListInspectionMappingActions.failure());
  }
}

function* getListNatureOfFindingsSaga(action) {
  try {
    const {
      isRefreshLoading,
      handleSuccess,
      paramsList,
      isLeftMenu,
      ...other
    } = action.payload;

    const response = yield call(getListNatureOfFindingsActionsApi, other);
    const { data } = response;
    handleSuccess?.();
    yield put(getListNatureOfFindingActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListNatureOfFindingActions.failure());
  }
}

function* deleteInspectionMappingsSaga(action) {
  try {
    const { params, listInspectionMappings } = yield select(
      (state: State) => state.inspectionMapping,
    );
    yield call(deleteInspectionMappingActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listInspectionMappings.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteInspectionMappingActions.success(newParams));
    toastSuccess('You have deleted successfully');
    action.payload?.getListInspectionMapping();
  } catch (e) {
    toastError(e);
    yield put(deleteInspectionMappingActions.failure());
  }
}

function* createInspectionMappingSaga(action) {
  try {
    const isNew = action.payload?.isNew;
    const params: CreateInspectionMappingParams = {
      ...action.payload,
      isNew: undefined,
      resetForm: undefined,
    };
    yield call(createInspectionMappingActionsApi, params);
    yield put(createInspectionMappingActions.success());
    toastSuccess('You have created successfully');
    if (!isNew) {
      history.push(AppRouteConst.INSPECTION_MAPPING);
    } else {
      action.payload?.resetForm();
    }
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e?.message);
      }
      yield put(createInspectionMappingActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(createInspectionMappingActions.failure(undefined));
    }
  }
}

function* getInspectionMappingDetailSaga(action) {
  try {
    const response = yield call(
      getInspectionMappingDetailActionsApi,
      action.payload,
    );
    const { data } = response;

    yield put(getInspectionMappingDetailActions.success(data));
  } catch (e) {
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.INSPECTION_MAPPING);
    }
    toastError(e);
    yield put(getInspectionMappingDetailActions.failure());
  }
}

function* updateInspectionMappingSaga(action) {
  try {
    yield call(
      updateInspectionMappingPermissionDetailActionsApi,
      action.payload,
    );
    toastSuccess('You have updated successfully');
    history.push(AppRouteConst.INSPECTION_MAPPING);
    yield put(updateInspectionMappingActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      if (e?.message) {
        toastError(e?.message);
      }
      yield put(updateInspectionMappingActions.failure(e?.errorList));
    } else {
      toastError(e);
      yield put(updateInspectionMappingActions.failure(undefined));
    }
  }
}

export default function* InspectionMappingAndPermissionSaga() {
  yield all([
    yield takeLatest(
      deleteInspectionMappingActions.request,
      deleteInspectionMappingsSaga,
    ),
    yield takeLatest(
      getListInspectionMappingActions.request,
      getListInspectionMappingsSaga,
    ),
    yield takeLatest(
      createInspectionMappingActions.request,
      createInspectionMappingSaga,
    ),
    yield takeLatest(
      getInspectionMappingDetailActions.request,
      getInspectionMappingDetailSaga,
    ),
    yield takeLatest(
      updateInspectionMappingActions.request,
      updateInspectionMappingSaga,
    ),
    yield takeLatest(
      getListNatureOfFindingActions.request,
      getListNatureOfFindingsSaga,
    ),
  ]);
}
