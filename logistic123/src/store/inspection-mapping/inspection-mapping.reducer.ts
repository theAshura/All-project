import { InspectionMappingStoreModel } from 'models/store/inspection-mapping/inspection-mapping.model';
import { createReducer } from 'typesafe-actions';
import {
  getListInspectionMappingActions,
  deleteInspectionMappingActions,
  updateInspectionMappingActions,
  createInspectionMappingActions,
  getInspectionMappingDetailActions,
  clearInspectionMappingReducer,
  getListNatureOfFindingActions,
  updateParamsActions,
  clearInspectionMappingErrorsReducer,
  setDataFilterAction,
} from './inspection-mapping.action';

const INITIAL_STATE: InspectionMappingStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },

  listInspectionMappings: undefined,
  listNatureOfFindings: undefined,
  inspectionMappingDetail: null,
  errorList: undefined,
  dataFilter: null,
};

const inspectionMappingReducer = createReducer<InspectionMappingStoreModel>(
  INITIAL_STATE,
)
  .handleAction(
    getListInspectionMappingActions.request,
    (state, { payload }) => ({
      ...state,
      params: { ...payload },
      loading: payload?.isRefreshLoading || true,
    }),
  )
  .handleAction(
    getListInspectionMappingActions.success,
    (state, { payload }) => ({
      ...state,
      listInspectionMappings: payload,
      loading: false,
    }),
  )
  .handleAction(getListInspectionMappingActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getListNatureOfFindingActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getListNatureOfFindingActions.success,
    (state, { payload }) => ({
      ...state,
      listNatureOfFindings: payload,
      loading: false,
    }),
  )
  .handleAction(getListNatureOfFindingActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deleteInspectionMappingActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    deleteInspectionMappingActions.success,
    (state, { payload }) => ({
      ...state,
      params: { ...payload },
      loading: false,
    }),
  )
  .handleAction(deleteInspectionMappingActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateInspectionMappingActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(updateInspectionMappingActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(
    updateInspectionMappingActions.failure,
    (state, { payload }) => ({
      ...state,
      loading: false,
      errorList: payload,
    }),
  )

  .handleAction(createInspectionMappingActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(createInspectionMappingActions.success, (state) => ({
    ...state,
    params: { isLeftMenu: false },

    loading: false,
  }))
  .handleAction(
    createInspectionMappingActions.failure,
    (state, { payload }) => ({
      ...state,
      loading: false,
      errorList: payload,
    }),
  )

  .handleAction(getInspectionMappingDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getInspectionMappingDetailActions.success,
    (state, { payload }) => ({
      ...state,
      inspectionMappingDetail: payload,
      loading: false,
    }),
  )
  .handleAction(getInspectionMappingDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearInspectionMappingErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
    dataFilter: payload?.isLeftMenu ? null : state?.dataFilter,
  }))

  .handleAction(clearInspectionMappingReducer, (state, { payload }) => ({
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

export default inspectionMappingReducer;
