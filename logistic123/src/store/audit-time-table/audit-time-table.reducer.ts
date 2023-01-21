import { AuditTimeTableStoreModel } from 'models/store/audit-time-table/audit-time-table.model';
import { createReducer } from 'typesafe-actions';
import {
  getListAuditTimeTableActions,
  deleteAuditTimeTableActions,
  updateAuditTimeTableActions,
  createAuditTimeTableActions,
  getAuditTimeTableDetailActions,
  clearAuditTimeTableReducer,
  clearAuditTimeTableErrorsReducer,
  submitAuditTimeTableActions,
  getDataCalendarActions,
  recallActions,
  updateParamsActions,
  closeOutActions,
  setDataFilterAction,
} from './audit-time-table.action';

const INITIAL_STATE: AuditTimeTableStoreModel = {
  loading: false,
  disable: false,
  params: { isLeftMenu: false },

  listAuditTimeTables: undefined,
  auditTimeTableDetail: null,
  errorList: undefined,
  dataCalendar: [],
  dataFilter: null,
};

const auditTimeTableReducer = createReducer<AuditTimeTableStoreModel>(
  INITIAL_STATE,
)
  .handleAction(getListAuditTimeTableActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: true,
  }))
  .handleAction(getListAuditTimeTableActions.success, (state, { payload }) => ({
    ...state,
    listAuditTimeTables: payload,
    loading: false,
  }))
  .handleAction(getListAuditTimeTableActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getDataCalendarActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getDataCalendarActions.success, (state, { payload }) => ({
    ...state,
    dataCalendar: payload,
    loading: false,
  }))
  .handleAction(getDataCalendarActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(recallActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(recallActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(recallActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(closeOutActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(closeOutActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(closeOutActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deleteAuditTimeTableActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteAuditTimeTableActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deleteAuditTimeTableActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateAuditTimeTableActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(updateAuditTimeTableActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateAuditTimeTableActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(createAuditTimeTableActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(createAuditTimeTableActions.success, (state) => ({
    ...state,
    params: { isLeftMenu: false },

    loading: false,
  }))
  .handleAction(createAuditTimeTableActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getAuditTimeTableDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getAuditTimeTableDetailActions.success,
    (state, { payload }) => ({
      ...state,
      auditTimeTableDetail: payload,
      loading: false,
    }),
  )
  .handleAction(getAuditTimeTableDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(submitAuditTimeTableActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(submitAuditTimeTableActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(submitAuditTimeTableActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearAuditTimeTableErrorsReducer, (state) => ({
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
  .handleAction(clearAuditTimeTableReducer, (state, { payload }) => ({
    ...INITIAL_STATE,
    dataFilter: payload ? null : state?.dataFilter,
  }));

export default auditTimeTableReducer;
