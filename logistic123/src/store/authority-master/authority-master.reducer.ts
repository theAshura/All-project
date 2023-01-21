import { AuthorityMasterState } from 'models/store/authority-master/authority-master.model';
import { createReducer } from 'typesafe-actions';
import {
  clearParamsAuthorityMasterReducer,
  clearAuthorityMasterReducer,
  createAuthorityMasterActions,
  deleteAuthorityMasterActions,
  getListAuthorityMasterActions,
  updateParamsActions,
  getAuthorityMasterDetailActions,
  updateAuthorityMasterActions,
  clearAuthorityMasterErrorsReducer,
} from './authority-master.action';

const INITIAL_STATE: AuthorityMasterState = {
  loading: false,
  disable: false,
  listAuthorityMasters: null,
  authorityMasterDetail: null,
  errorList: [],
  params: { isLeftMenu: false },
};

const AuthorityMasterReducer = createReducer<AuthorityMasterState>(
  INITIAL_STATE,
)
  .handleAction(
    getListAuthorityMasterActions.request,
    (state, { payload }) => ({
      ...state,
      params: payload,
      loading: payload?.isRefreshLoading,
    }),
  )
  .handleAction(
    getListAuthorityMasterActions.success,
    (state, { payload }) => ({
      ...state,
      listAuthorityMasters: payload,
      errorList: [],
      loading: false,
    }),
  )
  .handleAction(getListAuthorityMasterActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(deleteAuthorityMasterActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteAuthorityMasterActions.success, (state, { payload }) => ({
    ...state,
    errorList: [],
    params: payload,
    loading: false,
  }))
  .handleAction(deleteAuthorityMasterActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(createAuthorityMasterActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(createAuthorityMasterActions.success, () => ({
    ...INITIAL_STATE,
  }))
  .handleAction(createAuthorityMasterActions.failure, (state, { payload }) => ({
    ...state,
    errorList: payload,
    loading: false,
  }))
  .handleAction(getAuthorityMasterDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getAuthorityMasterDetailActions.success,
    (state, { payload }) => ({
      ...state,
      authorityMasterDetail: payload,
      errorList: [],
      loading: false,
    }),
  )
  .handleAction(getAuthorityMasterDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateAuthorityMasterActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(updateAuthorityMasterActions.success, (state) => ({
    ...state,
    errorList: [],
    loading: false,
  }))
  .handleAction(updateAuthorityMasterActions.failure, (state, { payload }) => ({
    ...state,
    errorList: payload,
    loading: false,
  }))
  .handleAction(clearAuthorityMasterReducer, () => ({
    ...INITIAL_STATE,
  }))
  .handleAction(clearAuthorityMasterErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))
  .handleAction(clearParamsAuthorityMasterReducer, (state) => ({
    ...state,
    params: { isLeftMenu: false },
  }));

export default AuthorityMasterReducer;
