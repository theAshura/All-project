import { OwnerBusinessStoreModel } from 'models/store/owner-business/owner-business.model';
import { createReducer } from 'typesafe-actions';
import {
  getListOwnerBusiness,
  deleteOwnerBusiness,
  updateOwnerBusiness,
  createOwnerBusiness,
  getOwnerBusinessDetailActions,
  clearOwnerBusinessReducer,
  updateParamsActions,
  clearOwnerBusinessErrorsReducer,
} from './owner-business.action';

const INITIAL_STATE: OwnerBusinessStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },

  listOwnerBusiness: undefined,
  ownerBusinessDetail: null,
  errorList: undefined,
};

const pscActionReducer = createReducer<OwnerBusinessStoreModel>(INITIAL_STATE)
  .handleAction(getListOwnerBusiness.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListOwnerBusiness.success, (state, { payload }) => ({
    ...state,
    listOwnerBusiness: payload,
    loading: false,
  }))
  .handleAction(getListOwnerBusiness.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deleteOwnerBusiness.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteOwnerBusiness.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deleteOwnerBusiness.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateOwnerBusiness.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(updateOwnerBusiness.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateOwnerBusiness.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(createOwnerBusiness.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(createOwnerBusiness.success, (state) => ({
    ...state,
    params: { isLeftMenu: false },

    loading: false,
  }))
  .handleAction(createOwnerBusiness.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getOwnerBusinessDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getOwnerBusinessDetailActions.success,
    (state, { payload }) => ({
      ...state,
      ownerBusinessDetail: payload,
      loading: false,
    }),
  )
  .handleAction(getOwnerBusinessDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearOwnerBusinessErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))

  .handleAction(clearOwnerBusinessReducer, () => ({
    ...INITIAL_STATE,
  }));

export default pscActionReducer;
