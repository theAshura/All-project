import { MailManagementStoreModel } from 'models/store/mail-management/mail-management.model';
import { createReducer } from 'typesafe-actions';
import {
  // clearDMSErrorsReducer,
  // clearDMSReducer,
  deleteMailManagementActions,
  getMailManagementDetailActions,
  updateMailManagementActions,
  updateParamsActions,
  setDataFilterAction,
  getListMailManagementActions,
  getMailTypesActions,
  createMailManagementActions,
  clearMailManagementReducer,
} from './mail-management.action';

const INITIAL_STATE: MailManagementStoreModel = {
  loading: false,
  disable: false,
  params: { isLeftMenu: false },
  mailTypes: [],
  listMailManagement: undefined,
  mailManagementDetail: null,
  errorList: undefined,
  dataFilter: null,
};

const MailManagementReducer = createReducer<MailManagementStoreModel>(
  INITIAL_STATE,
)
  .handleAction(getMailTypesActions.request, (state, { payload }) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getMailTypesActions.success, (state, { payload }) => ({
    ...state,
    mailTypes: payload,
    loading: false,
  }))
  .handleAction(getMailTypesActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getListMailManagementActions.request, (state, { payload }) => ({
    ...state,
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListMailManagementActions.success, (state, { payload }) => ({
    ...state,
    listMailManagement: payload,
    loading: false,
  }))
  .handleAction(getListMailManagementActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deleteMailManagementActions.request, (state) => ({
    ...state,
    loading: true,
  }))

  .handleAction(deleteMailManagementActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deleteMailManagementActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateMailManagementActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(updateMailManagementActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateMailManagementActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(createMailManagementActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(createMailManagementActions.success, (state) => ({
    ...state,
    params: { isLeftMenu: false },

    loading: false,
  }))
  .handleAction(createMailManagementActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getMailManagementDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getMailManagementDetailActions.success,
    (state, { payload }) => ({
      ...state,
      mailManagementDetail: payload,
      loading: false,
    }),
  )
  .handleAction(getMailManagementDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  // .handleAction(clearDMSErrorsReducer, (state) => ({
  //   ...state,
  //   errorList: undefined,
  // }))

  .handleAction(clearMailManagementReducer, () => ({
    ...INITIAL_STATE,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
    dataFilter: payload?.isLeftMenu ? null : state?.dataFilter,
  }))
  .handleAction(setDataFilterAction, (state, { payload }) => ({
    ...state,
    dataFilter: {
      ...payload,
      typeRange: payload?.dateFilter
        ? state.dataFilter?.typeRange
        : payload.typeRange,
    },
  }));

export default MailManagementReducer;
