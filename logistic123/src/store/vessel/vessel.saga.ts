import { all, call, put, select, takeLatest } from '@redux-saga/core/effects';
import { getUrlImageApi } from 'api/support.api';
import {
  createVesselActionsApi,
  deleteVesselActionsApi,
  exportListVesselActionsApi,
  getDetailVesselActionApi,
  getListVesselActionsApi,
  getListVesselPilotActionsApi,
  updateVesselActionsApi,
} from 'api/vessel.api';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { AvatarType } from 'models/common.model';
import { State } from 'store/reducer';
import {
  createVesselActions,
  deleteVesselActions,
  exportListVesselActions,
  getListVesselActions,
  getVesselDetailActions,
  updateVesselActions,
  uploadFileActions,
} from './vessel.action';
import { uploadFileApi } from '../../api/audit-inspection-workspace.api';

function* getListVesselSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      isLeftMenu,
      handleSuccess,
      shouldGetVesselPilot,
      ...other
    } = action.payload;

    const apiFn = shouldGetVesselPilot
      ? getListVesselPilotActionsApi
      : getListVesselActionsApi;

    const response = yield call(apiFn, other);
    const { data } = response;
    handleSuccess?.();
    yield put(getListVesselActions.success(data));
  } catch (e) {
    toastError(e);
    yield put(getListVesselActions.failure());
  }
}

function* deleteVesselTypeSaga(action) {
  try {
    const { params, listVesselResponse } = yield select(
      (state: State) => state.vesselType,
    );
    yield call(deleteVesselActionsApi, action.payload?.id);

    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listVesselResponse.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    toastSuccess('You have deleted successfully');
    action.payload?.getListVesselManagement();
    yield put(deleteVesselActions.success(newParams));
  } catch (e) {
    toastError(e);
    yield put(deleteVesselActions.failure());
  }
}

function* createVesselSaga(action) {
  try {
    yield call(createVesselActionsApi, action.payload);

    yield put(createVesselActions.success());
    history.push(AppRouteConst.VESSEL);
    toastSuccess('You have created successfully');
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    yield put(createVesselActions.failure(e?.errorList || []));
  }
}

function* updateVesselSaga(action) {
  try {
    yield call(updateVesselActionsApi, action.payload);
    yield put(updateVesselActions.success());
    if (action.payload?.handleSuccess) {
      action.payload?.handleSuccess?.();
    } else {
      yield history.push(AppRouteConst.VESSEL);
    }
    toastSuccess('You have updated successfully');
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    if (e?.message && e?.statusCode === 400) {
      toastError(e);
    }
    yield put(updateVesselActions.failure(e?.errorList || []));
  }
}

function* getDetailVesselSaga(action) {
  try {
    let avatar: AvatarType;
    const response = yield call(getDetailVesselActionApi, action.payload);

    if (response?.data?.image) {
      const responseImage = yield call(getUrlImageApi, response?.data?.image);
      avatar = {
        id: response?.data?.image,
        url: responseImage?.data?.link,
      };
    }
    yield put(getVesselDetailActions.success({ data: response.data, avatar }));
    if (action.payload?.afterCreate) {
      action.payload?.afterCreate();
    }
  } catch (e) {
    toastError(e);
    yield put(getVesselDetailActions.failure());
  }
}

function* exportListVesselSaga(action) {
  try {
    const response = yield call(exportListVesselActionsApi, action.payload);
    const link = document.createElement('a');
    const blob = new Blob([response.data], { type: 'text/csv' });
    const csvUrl = window.webkitURL.createObjectURL(blob);
    link.download = 'VesselManagement.csv';
    link.href = csvUrl;
    link.click();
    // toastSuccess('You have updated successfully');
    yield put(exportListVesselActions.success());
  } catch (error) {
    toastError(error);
    yield put(exportListVesselActions.failure());
  }
}

function* uploadFileSaga(action) {
  try {
    const response = yield call(uploadFileApi, action.payload);
    const { data } = response;
    yield put(
      uploadFileActions.success({
        id: data && data[0]?.id,
        url: data && data[0]?.link,
      }),
    );
  } catch (e) {
    toastError(e);
    yield put(uploadFileActions.failure());
  }
}

export default function* vesselManagementSaga() {
  yield all([
    yield takeLatest(getListVesselActions.request, getListVesselSaga),
    yield takeLatest(deleteVesselActions.request, deleteVesselTypeSaga),
    yield takeLatest(createVesselActions.request, createVesselSaga),
    yield takeLatest(getVesselDetailActions.request, getDetailVesselSaga),
    yield takeLatest(exportListVesselActions.request, exportListVesselSaga),
    yield takeLatest(updateVesselActions.request, updateVesselSaga),
    yield takeLatest(uploadFileActions.request, uploadFileSaga),
  ]);
}
