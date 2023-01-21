import { call, put, takeLatest, all, select } from '@redux-saga/core/effects';
import {
  getAllActionsApi,
  getListRolesApi,
  deleteRoleApi,
  getPermissionsApi,
  createRoleApi,
  getRolePermissionDetailApi,
  updateRolePermissionDetailApi,
} from 'api/role.api';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { ActionsType } from 'models/store/role/role.model';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';
import { State } from 'store/reducer';

import {
  getAllActions,
  getListRolesActions,
  deleteRoleActions,
  getPermissionsActions,
  createRoleActions,
  getRolePermissionDetailActions,
  updateRoleActions,
} from './role.action';

function* getAllActionsSaga() {
  try {
    const response = yield call(getAllActionsApi) || [];
    const data: ActionsType[] = response?.data?.map((action) => ({
      id: action.id,
      name: action.name,
    }));
    yield put(getAllActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getAllActions.failure());
  }
}

function* getListRolesSaga(action) {
  try {
    const { isRefreshLoading, paramsList, isLeftMenu, ...other } =
      action.payload;

    const response = yield call(getListRolesApi, other);
    const { data } = response;
    yield put(getListRolesActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListRolesActions.failure());
  }
}

function* deleteRolesSaga(action) {
  try {
    const { params, listCharterOwners } = yield select(
      (state: State) => state.charterOwner,
    );
    yield call(deleteRoleApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listCharterOwners.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    toastSuccess('You have deleted successfully');

    yield put(deleteRoleActions.success(newParams));
    action.payload?.getListRole();
  } catch (e) {
    toastError(e);
    yield put(deleteRoleActions.failure());
  }
}

function* getPermissionsSaga(action) {
  try {
    const response = yield call(getPermissionsApi, action.payload);
    const { data } = response;
    yield put(getPermissionsActions.success(data?.data));
  } catch (e) {
    toastError(e);
    yield put(getPermissionsActions.failure());
  }
}

function* createRoleSaga(action) {
  try {
    yield call(createRoleApi, action.payload);
    yield put(createRoleActions.success());
    toastSuccess('You have created successfully');
    history.push(AppRouteConst.ROLE);
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(createRoleActions.failure(e.errorList));
    } else {
      toastError(e);
      yield put(createRoleActions.failure(undefined));
    }
  }
}

function* getRolePermissionDetailSaga(action) {
  try {
    const response = yield call(getRolePermissionDetailApi, action.payload);
    const { data } = response;
    yield put(getRolePermissionDetailActions.success(data));
  } catch (e) {
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.ROLE);
    }
    toastError(e);
    yield put(getRolePermissionDetailActions.failure());
  }
}

function* updateRolePermissionDetailSaga(action) {
  try {
    yield call(updateRolePermissionDetailApi, action.payload);
    toastSuccess('You have updated successfully');
    history.push(AppRouteConst.ROLE);
    yield put(updateRoleActions.success());
  } catch (e) {
    if (e?.statusCode === 400) {
      yield put(updateRoleActions.failure(e.errorList));
    } else {
      toastError(e);
      yield put(updateRoleActions.failure(undefined));
    }
  }
}

export default function* roleAndPermissionSaga() {
  yield all([
    yield takeLatest(getAllActions.request, getAllActionsSaga),
    yield takeLatest(deleteRoleActions.request, deleteRolesSaga),
    yield takeLatest(getListRolesActions.request, getListRolesSaga),
    yield takeLatest(getPermissionsActions.request, getPermissionsSaga),
    yield takeLatest(createRoleActions.request, createRoleSaga),
    yield takeLatest(
      getRolePermissionDetailActions.request,
      getRolePermissionDetailSaga,
    ),
    yield takeLatest(updateRoleActions.request, updateRolePermissionDetailSaga),
  ]);
}
