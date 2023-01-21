import {
  LoginSuccessResponse,
  RecoverPasswordResponse,
  ResetPasswordResponse,
  TokenResetPasswordParams,
  LoginFailResponse,
  UserProfile,
} from 'models/api/authentication.model';
import { LoginRequestParams } from 'models/store/authenticate.model';
import { createAction, createAsyncAction } from 'typesafe-actions';

interface UpdateAuthenticatePayload {
  token: string;
  userInfo: { id: string; name: string };
}
interface ResetPasswordPayload {
  newPassword: string;
  confirmPassword: string;
  requestToken: string;
}
interface RecoverPasswordPayload {
  email: string;
}

interface TokenResetPasswordPayload {
  token: string;
}

export const login = createAsyncAction(
  `@authenticate/LOGIN`,
  `@authenticate/LOGIN_SUCCESS`,
  `@authenticate/LOGIN_FAIL`,
)<LoginRequestParams, LoginSuccessResponse, LoginFailResponse>();

export const getUserProfileMe = createAsyncAction(
  `@authenticate/GET_USER_PROFILE_ME`,
  `@authenticate/GET_USER_PROFILE_ME_SUCCESS`,
  `@authenticate/GET_USER_PROFILE_ME_FAIL`,
)<void, UserProfile, void>();

export const updateAuthenticateAction = createAction(
  'authenticate/UPDATE_AUTHENTICATION',
)<UpdateAuthenticatePayload>();

export const getUserProfileActions = createAsyncAction(
  'authenticate/GET_USER_PROFILE',
  'authenticate/GET_USER_PROFILE_SUCCESS',
  'authenticate/GET_USER_PROFILE_FAIL',
)<void, any, void>();

export const logOutActions = createAsyncAction(
  'authenticate/LOG_OUT',
  'authenticate/LOG_OUT_SUCCESS',
  'authenticate/LOG_OUT_FAIL',
)<void, void, void>();

export const resetPassword = createAsyncAction(
  `authenticate/RESET`,
  `authenticate/RESET_SUCCESS`,
  `authenticate/RESET_FAIL`,
)<ResetPasswordPayload, ResetPasswordResponse, void>();

export const checkTokenResetPassword = createAsyncAction(
  `authenticate/TOKEN_RESET`,
  `authenticate/TOKEN_RESET_SUCCESS`,
  `authenticate/TOKEN_RESET_FAIL`,
)<TokenResetPasswordPayload, TokenResetPasswordParams, void>();

export const recoverPassword = createAsyncAction(
  `authenticate/RECOVER`,
  `authenticate/RECOVER_SUCCESS`,
  `authenticate/RECOVER_FAIL`,
)<RecoverPasswordPayload, RecoverPasswordResponse, RecoverPasswordResponse>();

export const getImageAvatarActions = createAsyncAction(
  'authenticate/GET_IMAGE_AVATAR',
  'authenticate/GET_IMAGE_AVATAR_SUCCESS',
  'authenticate/GET_IMAGE_AVATAR_FAIL',
)<string, string, void>();

export const resetMessage = createAsyncAction(
  `authenticate/RESET_MESSAGE`,
  `authenticate/RESET_MESSAGE_SUCCESS`,
  `authenticate/RESET_MESSAGE_FAIL`,
)<RecoverPasswordResponse, RecoverPasswordResponse, RecoverPasswordResponse>();

export const setTokenAction = createAction('authenticate/SET_TOKEN')<{
  token: string;
}>();
