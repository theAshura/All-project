import { AuthenticateStoreModel } from 'models/store/authenticate.model';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createReducer } from 'typesafe-actions';
import {
  checkTokenResetPassword,
  login,
  logOutActions,
  recoverPassword,
  resetMessage,
  resetPassword,
  getUserProfileMe,
  getImageAvatarActions,
} from './authenticate.action';

const INITIAL_STATE: AuthenticateStoreModel = {
  token: undefined,
  loading: false,
  message: '',
  messageObject: null,
  userInfo: null,
  userProfile: null,
  loadingToken: false,
  tokenPassword: '',
  imageAvatar: '',
};

const reducer = createReducer<AuthenticateStoreModel>(INITIAL_STATE)
  // Logout action
  .handleAction(logOutActions.success, () => ({
    ...INITIAL_STATE,
  }))

  // Login Action
  .handleAction(login.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(login.success, (state, { payload }) => ({
    ...state,
    token: payload.token,
    userInfo: payload,
    loading: false,
  }))
  .handleAction(login.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    messageObject: payload.message,
  }))

  // getUserProfile
  .handleAction(getUserProfileMe.request, (state) => ({
    ...state,
    loading: true,
  }))

  .handleAction(getUserProfileMe.success, (state, { payload }) => ({
    ...state,
    userProfile: payload,
    loading: false,
  }))

  .handleAction(getUserProfileMe.failure, (state, { payload }) => ({
    ...state,
    loading: false,
  }))

  // Reset password action
  .handleAction(resetPassword.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(resetPassword.success, (state) => ({
    ...state,
    loading: false,
    token: '',
  }))
  .handleAction(resetPassword.failure, (state) => ({
    ...state,
    loading: false,
  }))

  // Get token check reset password
  .handleAction(checkTokenResetPassword.request, (state) => ({
    ...state,
    loadingToken: true,
  }))
  .handleAction(checkTokenResetPassword.success, (state, { payload }) => ({
    ...state,
    tokenPassword: payload.requestToken,
    loadingToken: false,
  }))
  .handleAction(checkTokenResetPassword.failure, (state) => ({
    ...state,
    loadingToken: false,
  }))

  // Recover password action
  .handleAction(recoverPassword.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(recoverPassword.success, (state, { payload }) => ({
    ...state,
    loading: false,
    message: payload.message,
  }))
  .handleAction(recoverPassword.failure, (state) => ({
    ...state,
    loading: false,
    message: '',
  }))

  // get avatar
  .handleAction(getImageAvatarActions.request, (state) => ({
    ...state,
  }))
  .handleAction(getImageAvatarActions.success, (state, { payload }) => ({
    ...state,
    imageAvatar: payload,
  }))
  .handleAction(getImageAvatarActions.failure, (state) => ({
    ...state,
  }))

  // Reset message state
  .handleAction(resetMessage.request, (state) => ({
    ...state,
    message: '',
  }))
  .handleAction(resetMessage.success, (state) => ({
    ...state,
    message: '',
  }));

const persistConfig = {
  key: 'authenticate',
  whitelist: [
    'token',
    'mainToken',
    'switchUserId',
    'switchedUser',
    'userInfo',
    'imageAvatar',
  ],
  storage,
};

export default persistReducer(persistConfig, reducer);
