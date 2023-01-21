import { CharterOwnerStoreModel } from 'models/store/charter-owner/charter-owner.model';
import { createReducer } from 'typesafe-actions';
import {
  getListCharterOwnerActions,
  deleteCharterOwnerActions,
  updateCharterOwnerActions,
  createCharterOwnerActions,
  getCharterOwnerDetailActions,
  clearCharterOwnerReducer,
  updateParamsActions,
  clearCharterOwnerErrorsReducer,
} from './charter-owner.action';

const INITIAL_STATE: CharterOwnerStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },

  listCharterOwners: undefined,
  charterOwnerDetail: null,
  errorList: undefined,
};

const charterOwnerReducer = createReducer<CharterOwnerStoreModel>(INITIAL_STATE)
  .handleAction(getListCharterOwnerActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListCharterOwnerActions.success, (state, { payload }) => ({
    ...state,
    listCharterOwners: payload,
    loading: false,
  }))
  .handleAction(getListCharterOwnerActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deleteCharterOwnerActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteCharterOwnerActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deleteCharterOwnerActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateCharterOwnerActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(updateCharterOwnerActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateCharterOwnerActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(createCharterOwnerActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(createCharterOwnerActions.success, (state) => ({
    ...state,
    params: { isLeftMenu: false },

    loading: false,
  }))
  .handleAction(createCharterOwnerActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getCharterOwnerDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getCharterOwnerDetailActions.success, (state, { payload }) => ({
    ...state,
    charterOwnerDetail: payload,
    loading: false,
  }))
  .handleAction(getCharterOwnerDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearCharterOwnerErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))

  .handleAction(clearCharterOwnerReducer, () => ({
    ...INITIAL_STATE,
  }));

export default charterOwnerReducer;
