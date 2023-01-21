import { call, put, takeLatest } from '@redux-saga/core/effects';
import {
  loginApi,
  resetPasswordApi,
  checkTokenPasswordApi,
  getProfileApiRequest,
  recoverPasswordApi,
} from 'api/authentication.api';
import jwt_decode from 'jwt-decode';
import { AppRouteConst, AuthRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import {
  checkTimeLifePassword,
  redirectByRolePermissions,
} from 'helpers/permissionCheck.helper';
import { getUrlImageApi } from '../../api/user.api';
import {
  checkTokenResetPassword,
  login,
  logOutActions,
  recoverPassword,
  resetMessage,
  resetPassword,
  getImageAvatarActions,
  getUserProfileMe,
} from './authenticate.action';
import { configMobileMenu, preventedMenus } from './authenticate.const';

function* handleLogin(action: ReturnType<typeof login.request>) {
  try {
    const response = yield call(loginApi, action.payload);
    const { data, status } = response;
    if (status === 201 && !data?.token) {
      history.replace(
        `${AuthRouteConst.RESET_PASSWORD_ROUTINE}?changePassDate=${data?.changePassDate}&email=${data?.email}`,
      );
      return;
    }
    if (data?.avatar) {
      yield put(getImageAvatarActions.request(data?.avatar));
    }
    const userInfoToken: any = jwt_decode(data?.token);

    const filteredData = {
      ...data,
      rolePermissions: data?.rolePermissions.filter(
        (i) => !preventedMenus.includes(i),
      ),
      mobileConfig: data?.rolePermissions?.some((i) =>
        configMobileMenu.includes(i),
      ),
    };

    yield put(
      login.success({
        ...filteredData,
        mainCompanyId:
          filteredData?.parentCompanyId || filteredData?.company?.id,
        mainCompany: filteredData?.parentCompanyId
          ? filteredData?.parentCompany
          : filteredData?.company,
        companyLevel: userInfoToken?.companyLevel,
      }),
    );

    redirectByRolePermissions(
      filteredData?.rolePermissions,
      filteredData?.roleScope,
    );
    checkTimeLifePassword(data?.roleScope, data?.changePassDate);
  } catch (e) {
    yield put(login.failure(e));
    toastError(e.message);
  }
}

function* handleGetUserProfileMe(
  action: ReturnType<typeof getUserProfileMe.request>,
) {
  try {
    const response = yield call(getProfileApiRequest);
    const { data } = response;
    yield put(getUserProfileMe.success(data));
  } catch (e) {
    yield put(getUserProfileMe.failure());
    toastError(e.message);
  }
}

function* handleLogOut() {
  try {
    yield put(logOutActions.success());
    history.replace(AppRouteConst.LOGIN);
  } catch (e) {
    yield put(logOutActions.failure());
  }
}

function* handleResetPassword(action) {
  try {
    const response = yield call(resetPasswordApi, action.payload);
    yield put(resetPassword.success(response));
    toastSuccess(response.data.message);
    history.push(AuthRouteConst.SIGN_IN);
  } catch (error) {
    yield put(resetPassword.failure());
    if (error?.statusCode === 400) {
      history.push(AuthRouteConst.EXPIRED_LINK);
    } else {
      toastError(error.message);
    }
  }
}

function* handleRecoverPassword(action) {
  try {
    const response = yield call(recoverPasswordApi, action.payload);
    const { data } = response;
    yield put(recoverPassword.success(data));
  } catch (error) {
    yield put(recoverPassword.failure(error));
    toastError(error.message);
  }
}

function* handleCheckTokenPassword(action) {
  try {
    const response = yield call(checkTokenPasswordApi, action.payload);
    const { data } = response;
    yield put(checkTokenResetPassword.success(data));
  } catch (error) {
    yield put(checkTokenResetPassword.failure());
    if (error?.statusCode === 410) {
      history.push(AuthRouteConst.EXPIRED_LINK);
    } else {
      history.push(AuthRouteConst.RECOVER_PASSWORD);
      toastError(error.message);
    }
  }
}

function* handleResetMessage() {
  yield put(resetMessage.success({ message: '' }));
}

function* getImageAvatarSaga(action) {
  try {
    const response = yield call(getUrlImageApi, action.payload);
    const { data } = response;
    yield put(getImageAvatarActions.success(data?.link));
  } catch (error) {
    yield put(getImageAvatarActions.failure(error));
    toastError(error.message);
  }
}

export default function* authenticateSaga() {
  yield takeLatest(login.request, handleLogin);
  yield takeLatest(logOutActions.request, handleLogOut);
  yield takeLatest(getUserProfileMe.request, handleGetUserProfileMe);
  yield takeLatest(resetPassword.request, handleResetPassword);
  yield takeLatest(recoverPassword.request, handleRecoverPassword);
  yield takeLatest(checkTokenResetPassword.request, handleCheckTokenPassword);
  yield takeLatest(resetMessage.request, handleResetMessage);
  yield takeLatest(getImageAvatarActions.request, getImageAvatarSaga);
}
