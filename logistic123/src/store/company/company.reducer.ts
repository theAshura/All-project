import { createReducer } from 'typesafe-actions';
import { CompanyManagementState } from 'models/store/company/company.model';
import {
  deleteCompanyManagementActions,
  getListCompanyManagementActions,
  createCompanyManagementActions,
  updateParamsActions,
  getCompanyManagementDetailActions,
  updateCompanyManagementActions,
  clearCompanyManagementReducer,
  uploadFileActions,
} from './company.action';

const INITIAL_STATE: CompanyManagementState = {
  loading: false,
  disable: false,
  listCompanyManagementTypes: null,
  getCompanyById: null,
  errorList: [],
  params: { isLeftMenu: false },
  avatarCompany: null,
};

const companyManagementReducer = createReducer<CompanyManagementState>(
  INITIAL_STATE,
)
  .handleAction(
    getListCompanyManagementActions.request,
    (state, { payload }) => ({
      ...state,
      loading: payload?.isRefreshLoading,
      params: payload,
    }),
  )
  .handleAction(
    getListCompanyManagementActions.success,
    (state, { payload }) => ({
      ...state,
      listCompanyManagementTypes: payload,
      loading: false,
      avatarCompany: null,
    }),
  )
  .handleAction(getListCompanyManagementActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(createCompanyManagementActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(createCompanyManagementActions.success, (state) => ({
    ...state,
    loading: false,
    params: { isLeftMenu: false },
  }))
  .handleAction(
    createCompanyManagementActions.failure,
    (state, { payload }) => ({
      ...state,
      errorList: payload,
      loading: false,
    }),
  )
  .handleAction(getCompanyManagementDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getCompanyManagementDetailActions.success,
    (state, { payload }) => ({
      ...state,
      getCompanyById: payload,
      loading: false,
      avatarCompany: payload.avatar,
    }),
  )
  .handleAction(getCompanyManagementDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateCompanyManagementActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(updateCompanyManagementActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(
    updateCompanyManagementActions.failure,
    (state, { payload }) => ({
      ...state,
      errorList: payload,
      loading: false,
    }),
  )

  .handleAction(uploadFileActions.request, (state) => ({
    ...state,
    disable: true,
  }))
  .handleAction(uploadFileActions.success, (state, { payload }) => ({
    ...state,
    avatarCompany: payload,
    disable: false,
  }))
  .handleAction(uploadFileActions.failure, (state) => ({
    ...state,
    disable: false,
  }))

  .handleAction(deleteCompanyManagementActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    deleteCompanyManagementActions.success,
    (state, { payload }) => ({
      ...state,
      params: { ...payload },
      loading: false,
    }),
  )
  .handleAction(deleteCompanyManagementActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(clearCompanyManagementReducer, () => ({
    loading: false,
    disable: false,
    listCompanyManagementTypes: null,
    getCompanyById: null,
    errorList: [],
    params: undefined,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: { ...payload },
  }));

export default companyManagementReducer;
