import { all, call, put, takeLatest, select } from '@redux-saga/core/effects';
import {
  deleteAuthorityMasterActionsApi,
  getDetailAuthorityMasterActionApi,
  createAuthorityMasterActionsApi,
  updateAuthorityMasterActionApi,
  getListAuthorityMasterActionsApi,
} from 'api/authority-master.api';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { State } from 'store/reducer';
import {
  createAuthorityMasterActions,
  deleteAuthorityMasterActions,
  getListAuthorityMasterActions,
  getAuthorityMasterDetailActions,
  updateAuthorityMasterActions,
} from './authority-master.action';

function* getListAuthorityMasterSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      handleSuccess,
      isLeftMenu,
      ...other
    } = action.payload;

    const response = yield call(getListAuthorityMasterActionsApi, other);
    const { data } = response;
    handleSuccess?.();
    yield put(getListAuthorityMasterActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListAuthorityMasterActions.failure());
  }
}

function* deleteAuthorityMasterSaga(action) {
  try {
    const { params, listAuthorityMasters } = yield select(
      (state: State) => state.authorityMaster,
    );
    yield call(deleteAuthorityMasterActionsApi, action.payload?.id);
    action.payload?.getListAuthorityMaster();

    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listAuthorityMasters.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    toastSuccess('You have deleted successfully');

    yield put(deleteAuthorityMasterActions.success(newParams));
  } catch (e) {
    toastError(e);
    yield put(deleteAuthorityMasterActions.failure());
  }
}

function* createAuthorityMasterSaga(action) {
  try {
    const { afterCreate, ...other } = action.payload;
    yield call(createAuthorityMasterActionsApi, other);
    yield put(createAuthorityMasterActions.success());
    yield put(getListAuthorityMasterActions.request({}));
    if (action.payload?.afterCreate) {
      action.payload?.afterCreate();
    }
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    yield put(createAuthorityMasterActions.failure(e?.errorList || []));
  }
}

function* getAuthorityMasterSaga(action) {
  try {
    const response = yield call(
      getDetailAuthorityMasterActionApi,
      action.payload,
    );
    const { data } = response;
    yield put(getAuthorityMasterDetailActions.success(data));
  } catch (e) {
    toastError(e);
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.AUTHORITY_MASTER);
    }
    yield put(getAuthorityMasterDetailActions.failure());
  }
}

function* updateAuthorityMasterSaga(action) {
  try {
    yield call(
      updateAuthorityMasterActionApi,
      action.payload?.id,
      action.payload?.data,
    );
    put(updateAuthorityMasterActions.success());
    if (action.payload?.afterCreate) {
      action.payload?.afterCreate();
    }
    toastSuccess('You have updated successfully');
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    if (e?.message && e?.statusCode === 400) {
      toastError(e);
    }
    yield put(updateAuthorityMasterActions.failure(e?.errorList || []));
  }
}

export default function* authorityMasterSaga() {
  yield all([
    yield takeLatest(
      getListAuthorityMasterActions.request,
      getListAuthorityMasterSaga,
    ),
    yield takeLatest(
      deleteAuthorityMasterActions.request,
      deleteAuthorityMasterSaga,
    ),
    yield takeLatest(
      createAuthorityMasterActions.request,
      createAuthorityMasterSaga,
    ),
    yield takeLatest(
      getAuthorityMasterDetailActions.request,
      getAuthorityMasterSaga,
    ),
    yield takeLatest(
      updateAuthorityMasterActions.request,
      updateAuthorityMasterSaga,
    ),
  ]);
}
