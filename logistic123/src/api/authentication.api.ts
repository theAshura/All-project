import { request, requestAuthorized } from 'helpers/request';
import {
  LoginRequestParams,
  LoginSuccessResponse,
  RecoverPasswordParams,
  ResetPasswordParams,
  ResetPasswordResponse,
} from 'models/api/authentication.model';
import queryString from 'query-string';
import { AUTH_API_USER } from './endpoints/config.endpoint';

const params = queryString.stringify({ lang: 'en' });

export const loginApi = (data: LoginRequestParams) =>
  request.post<LoginSuccessResponse>(
    `${AUTH_API_USER}/sign-in?${params}`,
    data,
  );

export const resetPasswordApi = (data: ResetPasswordParams) =>
  request.post<ResetPasswordResponse>(
    `${AUTH_API_USER}/change-password?${params}`,
    data,
  );

export const checkTokenPasswordApi = (data: ResetPasswordParams) =>
  request
    .post<ResetPasswordResponse>(`${AUTH_API_USER}/verify-forgot-password`, {
      requestToken: data?.token,
    })
    .catch((error) => Promise.reject(error));

export const recoverPasswordApi = (data: RecoverPasswordParams) =>
  request.post<ResetPasswordResponse>(
    `${AUTH_API_USER}/forgot-password?${params}`,
    data,
  );

export const getListEmailUserApiRequest = (dataParams?: any) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get(`${AUTH_API_USER}/email?${params}`);
};

export const getProfileApiRequest = () =>
  requestAuthorized.get(`${AUTH_API_USER}/me`);

export const resetPasswordRoutineApi = (data: RecoverPasswordParams) =>
  request.put<ResetPasswordResponse>(
    `${AUTH_API_USER}/reset-expired-password`,
    data,
  );
