import { SailReportingSummaryStoreModel } from 'models/api/summary-sail-reporting/summary-sail-reporting.model';
import { createReducer } from 'typesafe-actions';
import {
  getSailReportingGeneralReportActions,
  getSailReportingLatestRecordsUpdateActions,
  clearSailReportingGeneralReportReducer,
  getSailReportingPendingActions,
} from './summary-sail-reporting.action';

const INITIAL_STATE: SailReportingSummaryStoreModel = {
  loading: false,
  generalReportDetail: null,
  latestRecordsUpdate: null,
  pendingAction: null,
};

const SailReportingSummaryReducer =
  createReducer<SailReportingSummaryStoreModel>(INITIAL_STATE)
    .handleAction(
      getSailReportingGeneralReportActions.request,
      (state, { payload }) => ({
        ...state,
        loading: true,
      }),
    )
    .handleAction(
      getSailReportingGeneralReportActions.success,
      (state, { payload }) => ({
        ...state,
        generalReportDetail: payload,
        loading: false,
      }),
    )
    .handleAction(getSailReportingGeneralReportActions.failure, (state) => ({
      ...state,
      loading: false,
    }))
    .handleAction(
      getSailReportingLatestRecordsUpdateActions.request,
      (state, { payload }) => ({
        ...state,
        loading: true,
      }),
    )
    .handleAction(
      getSailReportingLatestRecordsUpdateActions.success,
      (state, { payload }) => ({
        ...state,
        latestRecordsUpdate: payload,
        loading: false,
      }),
    )
    .handleAction(
      getSailReportingLatestRecordsUpdateActions.failure,
      (state) => ({
        ...state,
        loading: false,
      }),
    )
    .handleAction(
      getSailReportingPendingActions.request,
      (state, { payload }) => ({
        ...state,
        loading: true,
      }),
    )
    .handleAction(
      getSailReportingPendingActions.success,
      (state, { payload }) => ({
        ...state,
        pendingAction: payload,
        loading: false,
      }),
    )
    .handleAction(getSailReportingPendingActions.failure, (state) => ({
      ...state,
      loading: false,
    }))
    .handleAction(clearSailReportingGeneralReportReducer, () => ({
      ...INITIAL_STATE,
    }));

export default SailReportingSummaryReducer;
