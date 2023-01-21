import { call, put, all, takeLatest, select } from '@redux-saga/core/effects';
import history from 'helpers/history.helper';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { AppRouteConst } from 'constants/route.const';
import {
  getListShoreDepartmentApi,
  createShoreDepartmentApi,
  updateShoreDepartmentApi,
  deleteShoreDepartmentApi,
} from 'api/shore-department.api';
import { CommonMessageErrorResponse } from 'models/common.model';
import { State } from 'store/reducer';
import {
  getListShoreDepartmentAction,
  createShoreDepartmentAction,
  editShoreDepartmentAction,
  deleteShoreDepartmentActions,
} from './shore-department.action';

function* handleGetListShoreDepartment(
  action: ReturnType<typeof getListShoreDepartmentAction.request>,
) {
  try {
    const { isRefreshLoading, paramsList, isLeftMenu, ...other } =
      action.payload;

    const response = yield call(getListShoreDepartmentApi, other);
    yield put(getListShoreDepartmentAction.success(response.data));
  } catch (e) {
    toastError(e);
    yield put(getListShoreDepartmentAction.failure());
  }
}

function* handleCreateShoreDepartment(
  action: ReturnType<typeof createShoreDepartmentAction.request>,
) {
  try {
    yield call(createShoreDepartmentApi, action.payload);
    yield put(createShoreDepartmentAction.success());
    history.push(AppRouteConst.SHORE_DEPARTMENT);
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    if (e?.statusCode === 400) {
      const message1: CommonMessageErrorResponse[] = e?.errorList || [];
      const message2: CommonMessageErrorResponse[] =
        e?.message?.map((i) => ({
          fieldName: i?.field,
          message: i?.message[0],
        })) || [];

      const messageTotal: CommonMessageErrorResponse[] = [
        ...message1,
        ...message2,
      ];
      yield put(createShoreDepartmentAction.failure(messageTotal || []));
    } else {
      yield put(createShoreDepartmentAction.failure(e));
    }
  }
}

function* handleEditShoreDepartment(
  action: ReturnType<typeof editShoreDepartmentAction.request>,
) {
  try {
    const response = yield call(updateShoreDepartmentApi, action.payload);
    yield put(editShoreDepartmentAction.success());
    history.push(AppRouteConst.SHORE_DEPARTMENT);
    toastSuccess(response.data.message);
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    if (e?.message && e?.statusCode === 400) {
      toastError(e);
    }
    if (e?.statusCode === 400) {
      const message1: CommonMessageErrorResponse[] = e?.errorList || [];
      const message2: CommonMessageErrorResponse[] =
        e?.message?.map((i) => ({
          fieldName: i?.field,
          message: i?.message[0],
        })) || [];

      const messageTotal: CommonMessageErrorResponse[] = [
        ...message1,
        ...message2,
      ];
      yield put(editShoreDepartmentAction.failure(messageTotal || []));
    } else {
      yield put(editShoreDepartmentAction.failure(e));
    }
  }
}

function* deleteShoreDepartmentSaga(action) {
  try {
    const { params, listShore } = yield select(
      (state: State) => state.shoreDepartment,
    );
    yield call(deleteShoreDepartmentApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listShore.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    toastSuccess('You have deleted successfully');
    yield put(deleteShoreDepartmentActions.success(newParams));
    action.payload?.getList();
  } catch (e) {
    toastError(e);
    yield put(deleteShoreDepartmentActions.failure());
  }
}

export default function* shoreDepartmentSaga() {
  yield all([
    yield takeLatest(
      getListShoreDepartmentAction.request,
      handleGetListShoreDepartment,
    ),
    yield takeLatest(
      createShoreDepartmentAction.request,
      handleCreateShoreDepartment,
    ),
    yield takeLatest(
      editShoreDepartmentAction.request,
      handleEditShoreDepartment,
    ),
    yield takeLatest(
      deleteShoreDepartmentActions.request,
      deleteShoreDepartmentSaga,
    ),
  ]);
}
