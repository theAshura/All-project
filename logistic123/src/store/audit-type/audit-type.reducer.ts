import { AuditTypeStoreModel } from 'models/store/audit-type/audit-type.model';
import { createReducer } from 'typesafe-actions';
import {
  getListAuditTypeActions,
  deleteAuditTypeActions,
  updateAuditTypeActions,
  createAuditTypeActions,
  getAuditTypeDetailActions,
  clearAuditTypeReducer,
  updateParamsActions,
  clearAuditTypeErrorsReducer,
} from './audit-type.action';

const INITIAL_STATE: AuditTypeStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },

  listAuditTypes: undefined,
  auditTypeDetail: null,
  errorList: undefined,
};

const auditTypeReducer = createReducer<AuditTypeStoreModel>(INITIAL_STATE)
  .handleAction(getListAuditTypeActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListAuditTypeActions.success, (state, { payload }) => ({
    ...state,
    listAuditTypes: payload,
    loading: false,
  }))
  .handleAction(getListAuditTypeActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deleteAuditTypeActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteAuditTypeActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deleteAuditTypeActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateAuditTypeActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(updateAuditTypeActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateAuditTypeActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(createAuditTypeActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(createAuditTypeActions.success, (state) => ({
    ...state,
    params: { isLeftMenu: false },

    loading: false,
  }))
  .handleAction(createAuditTypeActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getAuditTypeDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getAuditTypeDetailActions.success, (state, { payload }) => ({
    ...state,
    auditTypeDetail: payload,
    loading: false,
  }))
  .handleAction(getAuditTypeDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearAuditTypeErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))

  .handleAction(clearAuditTypeReducer, () => ({
    ...INITIAL_STATE,
  }));

export default auditTypeReducer;
