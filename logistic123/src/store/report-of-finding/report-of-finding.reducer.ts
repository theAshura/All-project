import { ReportOfFindingStore } from 'models/store/report-of-finding/report-of-finding.model';
import { createReducer } from 'typesafe-actions';
import {
  getListReportOfFindingActions,
  deleteReportOfFindingActions,
  updateReportOfFindingActions,
  createReportOfFindingActions,
  getReportOfFindingDetailActions,
  clearReportOfFindingReducer,
  updateParamsActions,
  clearReportOfFindingErrorsReducer,
  setDataFilterAction,
} from './report-of-finding.action';

const INITIAL_STATE: ReportOfFindingStore = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },

  listReportOfFinding: undefined,
  ReportOfFindingDetail: null,
  errorList: undefined,
  dataFilter: null,
};

const reportOfFindingReducer = createReducer<ReportOfFindingStore>(
  INITIAL_STATE,
)
  .handleAction(
    getListReportOfFindingActions.request,
    (state, { payload }) => ({
      ...state,
      params: { ...payload },
      loading: payload?.isRefreshLoading || true,
    }),
  )
  .handleAction(
    getListReportOfFindingActions.success,
    (state, { payload }) => ({
      ...state,
      listReportOfFinding: payload,
      loading: false,
    }),
  )
  .handleAction(getListReportOfFindingActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deleteReportOfFindingActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteReportOfFindingActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deleteReportOfFindingActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateReportOfFindingActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(updateReportOfFindingActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateReportOfFindingActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(createReportOfFindingActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(createReportOfFindingActions.success, (state) => ({
    ...state,
    params: { isLeftMenu: false },

    loading: false,
  }))
  .handleAction(createReportOfFindingActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getReportOfFindingDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getReportOfFindingDetailActions.success,
    (state, { payload }) => ({
      ...state,
      ReportOfFindingDetail: payload,
      loading: false,
    }),
  )
  .handleAction(getReportOfFindingDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearReportOfFindingErrorsReducer, (state) => ({
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

  .handleAction(clearReportOfFindingReducer, (state, { payload }) => ({
    ...INITIAL_STATE,
    dataFilter: payload ? null : state?.dataFilter,
  }));

export default reportOfFindingReducer;
