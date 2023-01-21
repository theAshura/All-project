import { all, call, put, takeLatest, select } from '@redux-saga/core/effects';
import {
  createDepartmentMasterActionsApi,
  deleteDepartmentMasterActionsApi,
  getDetailDepartmentMasterActionApi,
  getListDepartmentMasterActionsApi,
  updateDepartmentMasterActionApi,
} from 'api/department-master.api';

import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { State } from 'store/reducer';
import {
  createDepartmentMasterActions,
  deleteDepartmentMasterActions,
  getListDepartmentMasterActions,
  getDepartmentMasterDetailActions,
  updateDepartmentMasterActions,
} from './department-master.action';

function* getListDepartmentMasterSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      handleSuccess,
      isLeftMenu,
      ...other
    } = action.payload;

    const params = {
      ...other,
      country: action.payload?.country?.label,
    };
    const response = yield call(getListDepartmentMasterActionsApi, params);
    const { data } = response;
    handleSuccess?.();
    yield put(getListDepartmentMasterActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListDepartmentMasterActions.failure());
  }
}

function* deleteDepartmentMasterSaga(action) {
  try {
    const { params, listDepartmentMaster } = yield select(
      (state: State) => state.port,
    );
    yield call(deleteDepartmentMasterActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listDepartmentMaster.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    toastSuccess('You have deleted successfully');
    yield put(deleteDepartmentMasterActions.success(newParams));
    action.payload?.getListDepartmentMaster();
  } catch (e) {
    toastError(e);
    yield put(deleteDepartmentMasterActions.failure());
  }
}

function* createDepartmentMasterSaga(action) {
  try {
    const { afterCreate, ...other } = action.payload;
    yield call(createDepartmentMasterActionsApi, other);
    yield put(createDepartmentMasterActions.success());
    yield put(getListDepartmentMasterActions.request({}));
    if (action.payload?.afterCreate) {
      action.payload?.afterCreate();
    }
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    yield put(createDepartmentMasterActions.failure(e?.errorList || []));
  }
}

function* getDepartmentMasterDetailSaga(action) {
  try {
    const response = yield call(
      getDetailDepartmentMasterActionApi,
      action.payload,
    );
    const { data } = response;
    yield put(getDepartmentMasterDetailActions.success(data));
  } catch (e) {
    toastError(e);
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.DEPARTMENT_MASTER);
    }
    yield put(getDepartmentMasterDetailActions.failure());
  }
}

function* updateDepartmentMasterSaga(action) {
  try {
    yield call(
      updateDepartmentMasterActionApi,

      action.payload,
    );
    put(updateDepartmentMasterActions.success());
    history.push(AppRouteConst.DEPARTMENT_MASTER);
    action.payload?.afterUpdate();
    toastSuccess('You have updated successfully');
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    if (e?.message && e?.statusCode === 400) {
      toastError(e);
    }
    yield put(updateDepartmentMasterActions.failure(e?.errorList || []));
  }
}

export default function* DepartmentMasterSaga() {
  yield all([
    yield takeLatest(
      getListDepartmentMasterActions.request,
      getListDepartmentMasterSaga,
    ),
    yield takeLatest(
      deleteDepartmentMasterActions.request,
      deleteDepartmentMasterSaga,
    ),
    yield takeLatest(
      createDepartmentMasterActions.request,
      createDepartmentMasterSaga,
    ),
    yield takeLatest(
      getDepartmentMasterDetailActions.request,
      getDepartmentMasterDetailSaga,
    ),
    yield takeLatest(
      updateDepartmentMasterActions.request,
      updateDepartmentMasterSaga,
    ),
  ]);
}
