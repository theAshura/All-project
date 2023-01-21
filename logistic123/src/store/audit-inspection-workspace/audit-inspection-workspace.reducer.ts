import { AuditInspectionWorkspaceStoreModel } from 'models/store/audit-inspection-workspace/audit-inspection-workspace.model';
import { createReducer } from 'typesafe-actions';
import {
  getListAuditInspectionWorkspaceActions,
  getAuditInspectionWorkspaceDetailActions,
  clearAuditInspectionWorkspaceReducer,
  clearAuditInspectionWorkspaceErrorsReducer,
  getAuditWorkspaceSummaryActions,
  submitAuditWorkspaceActions,
  updateParamsActions,
  getAuditWorkspaceChecklistActions,
  getAuditWorkspaceChecklistDetailActions,
  submitAuditWorkspaceChecklistDetailActions,
  updateAuditWorkspaceChecklistDetailActions,
  updateAuditWorkspaceFindingSummaryActions,
  setDataFilterAction,
  createRemarkActions,
  deleteRemarkActions,
  updateRemarkActions,
  getRemarksActions,
  getInspectionWorkspaceSummaryAction,
  getAnalyticalReportPerformanceAction,
  getAnalyticalReportDetailMainSubcategoryWiseAction,
  updateMasterChiefActions,
} from './audit-inspection-workspace.action';

const INITIAL_STATE: AuditInspectionWorkspaceStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },
  listAuditInspectionWorkspaces: undefined,
  fillQuestionDetail: undefined,
  listChecklist: undefined,
  listSummary: undefined,
  auditInspectionWorkspaceDetail: null,
  listRemark: null,
  errorList: undefined,
  dataFilter: null,
  inspectionSummary: null,
  analyticalReportInspection: null,
  detailMainSubcategoryWise: null,
};

const AuditInspectionWorkspaceReducer =
  createReducer<AuditInspectionWorkspaceStoreModel>(INITIAL_STATE)
    .handleAction(
      getListAuditInspectionWorkspaceActions.request,
      (state, { payload }) => ({
        ...state,
        params: { ...payload },
        loading: payload?.isRefreshLoading,
      }),
    )
    .handleAction(
      getListAuditInspectionWorkspaceActions.success,
      (state, { payload }) => ({
        ...state,
        listAuditInspectionWorkspaces: payload,
        loading: false,
      }),
    )
    .handleAction(getListAuditInspectionWorkspaceActions.failure, (state) => ({
      ...state,
      loading: false,
    }))

    .handleAction(getRemarksActions.request, (state) => ({
      ...state,
      loading: true,
    }))
    .handleAction(getRemarksActions.success, (state, { payload }) => ({
      ...state,
      listRemark: payload,
      loading: false,
    }))
    .handleAction(getRemarksActions.failure, (state) => ({
      ...state,
      loading: false,
    }))

    .handleAction(
      getAuditInspectionWorkspaceDetailActions.request,
      (state) => ({
        ...state,
        loading: true,
      }),
    )
    .handleAction(
      getAuditInspectionWorkspaceDetailActions.success,
      (state, { payload }) => ({
        ...state,
        auditInspectionWorkspaceDetail: payload,
        loading: false,
      }),
    )
    .handleAction(
      getAuditInspectionWorkspaceDetailActions.failure,
      (state) => ({
        ...state,
        loading: false,
      }),
    )

    .handleAction(deleteRemarkActions.request, (state) => ({
      ...state,
      loading: true,
    }))
    .handleAction(deleteRemarkActions.success, (state, { payload }) => ({
      ...state,
      loading: false,
    }))
    .handleAction(deleteRemarkActions.failure, (state) => ({
      ...state,
      loading: false,
    }))

    .handleAction(updateRemarkActions.request, (state) => ({
      ...state,
      loading: true,
    }))
    .handleAction(updateRemarkActions.success, (state) => ({
      ...state,
      loading: false,
    }))
    .handleAction(updateRemarkActions.failure, (state) => ({
      ...state,
      loading: false,
    }))

    .handleAction(createRemarkActions.request, (state) => ({
      ...state,
      loading: true,
    }))
    .handleAction(createRemarkActions.success, (state) => ({
      ...state,
      loading: false,
    }))
    .handleAction(createRemarkActions.failure, (state) => ({
      ...state,
      loading: false,
    }))

    .handleAction(updateMasterChiefActions.request, (state) => ({
      ...state,
      loading: true,
    }))
    .handleAction(updateMasterChiefActions.success, (state) => ({
      ...state,
      loading: false,
    }))
    .handleAction(updateMasterChiefActions.failure, (state) => ({
      ...state,
      loading: false,
    }))

    .handleAction(getAuditWorkspaceChecklistActions.request, (state) => ({
      ...state,
      loading: true,
    }))
    .handleAction(
      getAuditWorkspaceChecklistActions.success,
      (state, { payload }) => ({
        ...state,
        listChecklist: payload,
        loading: false,
      }),
    )
    .handleAction(getAuditWorkspaceChecklistActions.failure, (state) => ({
      ...state,
      loading: false,
    }))

    .handleAction(getAuditWorkspaceChecklistDetailActions.request, (state) => ({
      ...state,
      loading: true,
    }))
    .handleAction(
      getAuditWorkspaceChecklistDetailActions.success,
      (state, { payload }) => ({
        ...state,
        fillQuestionDetail: payload,
        loading: false,
      }),
    )
    .handleAction(getAuditWorkspaceChecklistDetailActions.failure, (state) => ({
      ...state,
      loading: false,
    }))

    .handleAction(getAuditWorkspaceSummaryActions.request, (state) => ({
      ...state,
      loading: true,
    }))
    .handleAction(
      getAuditWorkspaceSummaryActions.success,
      (state, { payload }) => ({
        ...state,
        listSummary: payload,
        loading: false,
      }),
    )
    .handleAction(getAuditWorkspaceSummaryActions.failure, (state) => ({
      ...state,
      loading: false,
    }))

    .handleAction(
      updateAuditWorkspaceChecklistDetailActions.request,
      (state) => ({
        ...state,
        loading: true,
      }),
    )
    .handleAction(
      updateAuditWorkspaceChecklistDetailActions.success,
      (state) => ({
        ...state,
        loading: false,
      }),
    )
    .handleAction(
      updateAuditWorkspaceChecklistDetailActions.failure,
      (state) => ({
        ...state,
        loading: false,
      }),
    )

    .handleAction(
      submitAuditWorkspaceChecklistDetailActions.request,
      (state) => ({
        ...state,
        loading: true,
      }),
    )
    .handleAction(
      submitAuditWorkspaceChecklistDetailActions.success,
      (state) => ({
        ...state,
        loading: false,
      }),
    )
    .handleAction(
      submitAuditWorkspaceChecklistDetailActions.failure,
      (state) => ({
        ...state,
        loading: false,
      }),
    )

    .handleAction(
      updateAuditWorkspaceFindingSummaryActions.request,
      (state) => ({
        ...state,
        loading: true,
      }),
    )
    .handleAction(
      updateAuditWorkspaceFindingSummaryActions.success,
      (state) => ({
        ...state,
        loading: false,
      }),
    )
    .handleAction(
      updateAuditWorkspaceFindingSummaryActions.failure,
      (state) => ({
        ...state,
        loading: false,
      }),
    )

    .handleAction(submitAuditWorkspaceActions.request, (state) => ({
      ...state,
      loading: true,
    }))
    .handleAction(submitAuditWorkspaceActions.success, (state) => ({
      ...state,
      loading: false,
    }))
    .handleAction(submitAuditWorkspaceActions.failure, (state) => ({
      ...state,
      loading: false,
    }))

    .handleAction(clearAuditInspectionWorkspaceErrorsReducer, (state) => ({
      ...state,
      errorList: undefined,
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
    }))
    .handleAction(
      clearAuditInspectionWorkspaceReducer,
      (state, { payload }) => ({
        ...INITIAL_STATE,
        dataFilter: payload ? null : state?.dataFilter,
      }),
    )
    .handleAction(getInspectionWorkspaceSummaryAction.request, (state) => ({
      ...state,
      loading: true,
    }))
    .handleAction(
      getInspectionWorkspaceSummaryAction.success,
      (state, { payload }) => ({
        ...state,
        inspectionSummary: payload,
        loading: false,
      }),
    )
    .handleAction(getInspectionWorkspaceSummaryAction.failure, (state) => ({
      ...state,
      loading: false,
    }))
    .handleAction(getAnalyticalReportPerformanceAction.request, (state) => ({
      ...state,
      loading: true,
    }))
    .handleAction(
      getAnalyticalReportPerformanceAction.success,
      (state, { payload }) => ({
        ...state,
        loading: false,
        analyticalReportInspection: payload,
      }),
    )
    .handleAction(getAnalyticalReportPerformanceAction.failure, (state) => ({
      ...state,
      loading: false,
    }))
    .handleAction(
      getAnalyticalReportDetailMainSubcategoryWiseAction.request,
      (state) => ({
        ...state,
        loading: true,
      }),
    )
    .handleAction(
      getAnalyticalReportDetailMainSubcategoryWiseAction.success,
      (state, { payload }) => ({
        ...state,
        loading: false,
        detailMainSubcategoryWise: payload,
      }),
    )
    .handleAction(
      getAnalyticalReportDetailMainSubcategoryWiseAction.failure,
      (state) => ({
        ...state,
        loading: false,
      }),
    );

export default AuditInspectionWorkspaceReducer;
