import { SailReportInspectionInternalModel } from 'models/store/sail-report-inspection-internal/sail-report-inspection-internal.model';
import { createReducer } from 'typesafe-actions';
import {
  updateParamsActions,
  setDataFilterAction,
  createSailReportInspectionInternalActions,
  updateSailReportInspectionInternalActions,
  getSailReportInspectionInternalDetailActions,
  clearSailReportInspectionInternalErrorsReducer,
  getListSailReportInspectionInternalActions,
  clearSailReportInspectionInternalReducer,
  deleteSailReportInspectionInternalActions,
} from './sail-report-inspection-internal.action';

const INITIAL_STATE: SailReportInspectionInternalModel = {
  loading: false,
  disable: false,
  params: { isLeftMenu: false },
  dataFilter: null,
  listSailReportInspectionInternal: null,
  sailReportInspectionInternalDetail: null,
  errorList: undefined,
};

const sailReportInspectionInternalReducer =
  createReducer<SailReportInspectionInternalModel>(INITIAL_STATE)
    .handleAction(
      createSailReportInspectionInternalActions.request,
      (state) => ({
        ...state,
        loading: true,
        errorList: undefined,
      }),
    )
    .handleAction(
      createSailReportInspectionInternalActions.success,
      (state) => ({
        ...state,
        loading: false,
      }),
    )
    .handleAction(
      createSailReportInspectionInternalActions.failure,
      (state, { payload }) => ({
        ...state,
        loading: false,
        errorList: payload,
      }),
    )
    .handleAction(
      updateSailReportInspectionInternalActions.request,
      (state) => ({
        ...state,
        loading: true,
        errorList: undefined,
      }),
    )
    .handleAction(
      updateSailReportInspectionInternalActions.success,
      (state) => ({
        ...state,
        loading: false,
      }),
    )
    .handleAction(
      updateSailReportInspectionInternalActions.failure,
      (state, { payload }) => ({
        ...state,
        loading: false,
        errorList: payload,
      }),
    )

    .handleAction(
      getSailReportInspectionInternalDetailActions.request,
      (state) => ({
        ...state,
        loading: true,
      }),
    )
    .handleAction(
      getSailReportInspectionInternalDetailActions.success,
      (state, { payload }) => ({
        ...state,
        sailReportInspectionInternalDetail: payload,
        loading: false,
      }),
    )
    .handleAction(
      getSailReportInspectionInternalDetailActions.failure,
      (state) => ({
        ...state,
        loading: false,
      }),
    )
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
      getListSailReportInspectionInternalActions.request,
      (state, { payload }) => ({
        ...state,
        params: { ...payload },
        loading: payload?.isRefreshLoading,
      }),
    )
    .handleAction(
      getListSailReportInspectionInternalActions.success,
      (state, { payload }) => ({
        ...state,
        listSailReportInspectionInternal: payload,
        loading: false,
      }),
    )
    .handleAction(
      getListSailReportInspectionInternalActions.failure,
      (state) => ({
        ...state,
        loading: false,
      }),
    )

    .handleAction(
      deleteSailReportInspectionInternalActions.request,
      (state) => ({
        ...state,
        loading: true,
      }),
    )
    .handleAction(
      deleteSailReportInspectionInternalActions.success,
      (state, { payload }) => ({
        ...state,
        loading: false,
      }),
    )
    .handleAction(
      deleteSailReportInspectionInternalActions.failure,
      (state) => ({
        ...state,
        loading: false,
      }),
    )

    .handleAction(clearSailReportInspectionInternalErrorsReducer, (state) => ({
      ...state,
      errorList: undefined,
    }))

    .handleAction(updateParamsActions, (state, { payload }) => ({
      ...state,
      params: payload,
    }))
    .handleAction(clearSailReportInspectionInternalReducer, () => ({
      ...INITIAL_STATE,
    }));

export default sailReportInspectionInternalReducer;
