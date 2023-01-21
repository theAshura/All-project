import { all, call, put, takeLatest, select } from '@redux-saga/core/effects';
import {
  createPSCDeficiencyActionsApi,
  deletePSCDeficiencyActionsApi,
  getDetailPSCDeficiencyActionApi,
  getListPSCDeficiencyActionsApi,
  updatePSCDeficiencyActionApi,
} from 'api/psc.api';

import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { PSCDeficiency } from 'models/api/psc-deficiency/psc-deficiency.model';
import { State } from 'store/reducer';
import {
  createPSCDeficiencyActions,
  deletePSCDeficiencyActions,
  getListPSCDeficiencyActions,
  getPSCDeficiencyDetailActions,
  updatePSCDeficiencyActions,
} from './psc-deficiency.action';

function* getListPSCDeficiencySaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      isLeftMenu,
      handleSuccess,
      ...other
    } = action.payload;

    const params = {
      ...other,
      country: action.payload?.country?.label,
    };
    const response = yield call(getListPSCDeficiencyActionsApi, params);
    const { data } = response;
    handleSuccess?.();
    yield put(getListPSCDeficiencyActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListPSCDeficiencyActions.failure());
  }
}

function* deletePSCDeficiencySaga(action) {
  try {
    const { params, listPSCDeficiency } = yield select(
      (state: State) => state.port,
    );
    yield call(deletePSCDeficiencyActionsApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listPSCDeficiency.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deletePSCDeficiencyActions.success(newParams));
    action.payload?.getListPSCDeficiency?.();
    toastSuccess('You have deleted successfully');
  } catch (e) {
    toastError(e);
    yield put(deletePSCDeficiencyActions.failure());
  }
}

function* createPSCDeficiencySaga(action) {
  try {
    const params: PSCDeficiency = {
      ...action.payload,
      isNew: undefined,
      resetForm: undefined,
    };
    yield call(createPSCDeficiencyActionsApi, params);
    yield put(createPSCDeficiencyActions.success());
    yield put(getListPSCDeficiencyActions.request({}));
    action.payload?.afterCreate?.();
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    yield put(createPSCDeficiencyActions.failure(e?.errorList || []));
  }
}

function* getPSCDeficiencyDetailSaga(action) {
  try {
    const response = yield call(
      getDetailPSCDeficiencyActionApi,
      action.payload,
    );
    const { data } = response;
    yield put(getPSCDeficiencyDetailActions.success(data));
  } catch (e) {
    toastError(e);
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.PSC_DEFICIENCY);
    }
    yield put(getPSCDeficiencyDetailActions.failure());
  }
}

function* updatePSCDeficiencySaga(action) {
  try {
    yield call(
      updatePSCDeficiencyActionApi,
      action.payload?.id,
      action.payload?.body,
    );
    put(updatePSCDeficiencyActions.success());
    toastSuccess('You have updated successfully');
    action.payload?.afterUpdate?.();
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    if (e?.message && e?.statusCode === 400) {
      toastError(e);
    }
    yield put(updatePSCDeficiencyActions.failure(e?.errorList || []));
  }
}

export default function* PSCDeficiencySaga() {
  yield all([
    yield takeLatest(
      getListPSCDeficiencyActions.request,
      getListPSCDeficiencySaga,
    ),
    yield takeLatest(
      deletePSCDeficiencyActions.request,
      deletePSCDeficiencySaga,
    ),
    yield takeLatest(
      createPSCDeficiencyActions.request,
      createPSCDeficiencySaga,
    ),
    yield takeLatest(
      getPSCDeficiencyDetailActions.request,
      getPSCDeficiencyDetailSaga,
    ),
    yield takeLatest(
      updatePSCDeficiencyActions.request,
      updatePSCDeficiencySaga,
    ),
  ]);
}
