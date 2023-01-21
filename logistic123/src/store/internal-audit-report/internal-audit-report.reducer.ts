import { InternalAuditReportStoreModel } from 'models/store/internal-audit-report/internal-audit-report.model';
import { createReducer } from 'typesafe-actions';
import {
  getListInternalAuditReportActions,
  deleteInternalAuditReportActions,
  updateInternalAuditReportActions,
  updateParamsActions,
  getInternalAuditReportDetailActions,
  clearInternalAuditReportReducer,
  clearInternalAuditReportDetail,
  clearInternalAuditReportErrorsReducer,
  setDataFilterAction,
  getListInspectionFollowUpActions,
  getInspectionFollowUpDetailActions,
} from './internal-audit-report.action';

const INITIAL_STATE: InternalAuditReportStoreModel = {
  loading: false,
  disable: false,
  params: { isLeftMenu: false },
  listInternalAuditReports: undefined,
  internalAuditReportDetail: null,
  errorList: undefined,
  avatarIAR: null,
  dataFilter: null,
  listInspectionFollowUp: undefined,
  inspectionFollowDetail: null,
};

const auditTypeReducer = createReducer<InternalAuditReportStoreModel>(
  INITIAL_STATE,
)
  .handleAction(
    getListInternalAuditReportActions.request,
    (state, { payload }) => ({
      ...state,
      params: { ...payload },
      loading: payload?.isRefreshLoading,
    }),
  )
  .handleAction(
    getListInternalAuditReportActions.success,
    (state, { payload }) => ({
      ...state,
      listInternalAuditReports: payload,
      loading: false,
      avatarIAR: null,
    }),
  )
  .handleAction(getListInternalAuditReportActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(deleteInternalAuditReportActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    deleteInternalAuditReportActions.success,
    (state, { payload }) => ({
      ...state,
      params: { ...payload },
      loading: false,
    }),
  )
  .handleAction(deleteInternalAuditReportActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateInternalAuditReportActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(updateInternalAuditReportActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(
    updateInternalAuditReportActions.failure,
    (state, { payload }) => ({
      ...state,
      loading: false,
      errorList: payload,
    }),
  )
  .handleAction(getInternalAuditReportDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getInternalAuditReportDetailActions.success,
    (state, { payload }) => ({
      ...state,
      internalAuditReportDetail: payload,
      loading: false,
      avatarIAR: payload.avatar,
    }),
  )
  .handleAction(getInternalAuditReportDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(clearInternalAuditReportErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))
  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
    dataFilter: payload?.isLeftMenu ? null : state.dataFilter,
  }))
  .handleAction(clearInternalAuditReportDetail, (state) => ({
    ...state,
    internalAuditReportDetail: null,
  }))
  .handleAction(setDataFilterAction, (state, { payload }) => ({
    ...state,
    dataFilter: {
      ...payload,
      typeRange: payload?.dateFilter
        ? state.dataFilter?.typeRange
        : payload.typeRange,
    },
  }))
  .handleAction(clearInternalAuditReportReducer, (state, { payload }) => ({
    ...INITIAL_STATE,
    dataFilter: payload ? null : state.dataFilter,
  }))
  .handleAction(
    getListInspectionFollowUpActions.request,
    (state, { payload }) => ({
      ...state,
      params: { ...payload },
      loading: payload?.isRefreshLoading,
    }),
  )
  .handleAction(
    getListInspectionFollowUpActions.success,
    (state, { payload }) => ({
      ...state,
      listInspectionFollowUp: payload,
      loading: false,
    }),
  )
  .handleAction(getListInspectionFollowUpActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(getInspectionFollowUpDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getInspectionFollowUpDetailActions.success,
    (state, { payload }) => ({
      ...state,
      inspectionFollowDetail: payload,
      loading: false,
    }),
  )
  .handleAction(getInspectionFollowUpDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }));

export default auditTypeReducer;
