import { all, call, put, select, takeLatest } from '@redux-saga/core/effects';
import {
  getCountryApi,
  getProvinceApi,
  getUrlImageApi,
  uploadFileApi,
} from 'api/support.api';
import { getAllGroupApi } from 'api/group.api';
import { MessageErrorResponse } from 'models/store/MessageError.model';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { State } from 'store/reducer';
import { AvatarType } from 'models/common.model';
import {
  getListCompanyManagementDetailApi,
  getListCompanyManagementApi,
  createCompanyManagementApi,
  updateCompanyManagementApi,
  deleteCompanyManagementApi,
} from '../../api/company.api';
import {
  getListCompanyManagementActions,
  createCompanyManagementActions,
  getCompanyManagementDetailActions,
  updateCompanyManagementActions,
  deleteCompanyManagementActions,
  uploadFileActions,
} from './company.action';

function* getCompanyManagementSaga(action) {
  try {
    const {
      isRefreshLoading,
      paramsList,
      isLeftMenu,
      handleSuccess,
      ...other
    } = action.payload;
    const response = yield call(getListCompanyManagementApi, other);
    const { data } = response;
    yield put(getListCompanyManagementActions.success(data));
    handleSuccess?.();
  } catch (e) {
    toastError(e);
    yield put(getListCompanyManagementActions.failure());
  }
}

function* createNewCompanyManagementSaga(action) {
  try {
    yield call(createCompanyManagementApi, action.payload);
    toastSuccess('You have created successfully');
    yield put(createCompanyManagementActions.success());
    history.push(AppRouteConst.COMPANY);
  } catch (e) {
    if (e?.statusCode !== 400) {
      toastError(e);
    }
    if (e?.statusCode === 400) {
      const message1: MessageErrorResponse[] = e?.errorList || [];
      const message2: MessageErrorResponse[] =
        (e &&
          e.message &&
          e?.message?.map((i) => ({
            fieldName: i?.field,
            message: i?.message[0],
          }))) ||
        [];
      const messageTotal: MessageErrorResponse[] = [...message1, ...message2];
      yield put(createCompanyManagementActions.failure(messageTotal || []));
    } else {
      yield put(createCompanyManagementActions.failure(e));
    }
  }
}

function* deleteCompanySaga(action) {
  try {
    const { params, listCharterOwners } = yield select(
      (state: State) => state.charterOwner,
    );
    yield call(deleteCompanyManagementApi, action.payload?.id);
    let newParams = { ...params };
    if (
      action.payload.isDetail &&
      params.page > 1 &&
      listCharterOwners.data.length === 1
    ) {
      newParams = { ...newParams, page: params.page - 1 };
    }
    yield put(deleteCompanyManagementActions.success(newParams));
    toastSuccess('You have deleted successfully');
    action.payload?.handleSuccess();
  } catch (e) {
    toastError(e);
    yield put(deleteCompanyManagementActions.failure());
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

function* getCompanyManagementDetailSaga(action) {
  try {
    let avatar: AvatarType;
    const response = yield call(
      getListCompanyManagementDetailApi,
      action.payload,
    );

    if (response?.data?.logo) {
      const responseImage = yield call(getUrlImageApi, response?.data?.logo);
      avatar = {
        id: response?.data?.logo,
        url: responseImage?.data?.link,
      };
    }
    const { data } = response;

    const responseGroup = yield call(getAllGroupApi, {
      pageSize: -1,
      content: '',
    });
    const responseCountry = yield call(getCountryApi, { content: '' });

    const responseProvince = yield call(getProvinceApi, {
      countryId: data?.country,
      data: { content: '' },
    });
    yield put(
      getCompanyManagementDetailActions.success({
        ...data,
        avatar,
        groupId:
          responseGroup?.data?.data
            ?.filter((item) => item?.id?.toString() === data?.groupId)
            ?.map((i) => ({
              value: i?.id,
              label: i?.name,
            })) || [],
        country:
          responseCountry?.data
            ?.filter((item) => item?.name?.toString() === data?.country)
            ?.map((i) => ({
              value: i?.name,
              label: i?.name,
              image: i?.flagImg || '',
            })) || [],
        stateOrProvince:
          responseProvince?.data
            ?.filter((item) => item?.name?.toString() === data?.stateOrProvince)
            ?.map((i) => ({
              value: i?.name,
              label: i?.name,
            })) || {},
      }),
    );
  } catch (e) {
    toastError(e);
    if (e?.statusCode === 404) {
      history.push(AppRouteConst.COMPANY);
    }
    yield put(getCompanyManagementDetailActions.failure());
  }
}

function* updateCompanyManagementSaga(action) {
  try {
    yield call(updateCompanyManagementApi, action.payload);
    toastSuccess('You have updated successfully');
    history.push(AppRouteConst.COMPANY);
    yield put(updateCompanyManagementActions.success());
  } catch (e) {
    toastError(e);
    yield put(updateCompanyManagementActions.failure(e));
  }
}

export default function* companyManagementSaga() {
  yield all([
    yield takeLatest(
      getListCompanyManagementActions.request,
      getCompanyManagementSaga,
    ),
    yield takeLatest(deleteCompanyManagementActions.request, deleteCompanySaga),
    yield takeLatest(
      createCompanyManagementActions.request,
      createNewCompanyManagementSaga,
    ),
    yield takeLatest(
      getCompanyManagementDetailActions.request,
      getCompanyManagementDetailSaga,
    ),
    yield takeLatest(
      updateCompanyManagementActions.request,
      updateCompanyManagementSaga,
    ),
    yield takeLatest(uploadFileActions.request, uploadFileSaga),
  ]);
}
