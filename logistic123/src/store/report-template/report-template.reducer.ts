import { ReportTemplateStoreModel } from 'models/store/report-template/report-template.model';
import { createReducer } from 'typesafe-actions';
import omit from 'lodash/omit';
import cloneDeep from 'lodash/cloneDeep';
import {
  getListReportTemplateActions,
  deleteReportTemplateActions,
  updateReportTemplateActions,
  createReportTemplateActions,
  getReportTemplateDetailActions,
  updateParamsActions,
  clearReportTemplateReducer,
  clearReportTemplateErrorsReducer,
  setDataFilterAction,
} from './report-template.action';

const initParams = { isRefreshLoading: true, paramsList: {} };
const INITIAL_STATE: ReportTemplateStoreModel = {
  loading: false,
  disable: false,
  params: initParams,
  listReportTemplates: undefined,
  ReportTemplateDetail: null,
  errorList: undefined,
  dataFilter: null,
};

const ReportTemplateReducer = createReducer<ReportTemplateStoreModel>(
  INITIAL_STATE,
)
  .handleAction(getListReportTemplateActions.request, (state, { payload }) => {
    let params = cloneDeep(payload);
    if (payload?.isNotSaveSearch) {
      params = omit(payload, ['status', 'isNotSaveSearch']);
    }
    return {
      ...state,
      params: {
        ...params,
        pageSize:
          payload.pageSize === -1 ? state.params?.pageSize : payload?.pageSize,
      },
      loading: payload?.isRefreshLoading,
    };
  })
  .handleAction(getListReportTemplateActions.success, (state, { payload }) => ({
    ...state,
    listReportTemplates: payload,
    loading: false,
  }))
  .handleAction(getListReportTemplateActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deleteReportTemplateActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteReportTemplateActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(deleteReportTemplateActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateReportTemplateActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(updateReportTemplateActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateReportTemplateActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(createReportTemplateActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(createReportTemplateActions.success, (state) => ({
    ...state,
    params: initParams,
    loading: false,
  }))
  .handleAction(createReportTemplateActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getReportTemplateDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getReportTemplateDetailActions.success,
    (state, { payload }) => ({
      ...state,
      ReportTemplateDetail: payload,
      loading: false,
    }),
  )
  .handleAction(getReportTemplateDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearReportTemplateErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
    dataFilter: payload?.isLeftMenu ? null : state?.dataFilter,
  }))

  .handleAction(clearReportTemplateReducer, (state, { payload }) => ({
    ...INITIAL_STATE,
    dataFilter: payload ? null : state?.dataFilter,
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

export default ReportTemplateReducer;
