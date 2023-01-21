import { PlanningAndDrawingsStoreModel } from 'models/store/plans-and-drawings/plans-and-drawings.model';
import { createReducer } from 'typesafe-actions';
import {
  getListPlansAndDrawingMasterActions,
  deletePlansAndDrawingActions,
  updatePlansAndDrawingMasterActions,
  createPlansAndDrawingActions,
  getPlansAndDrawingDetailActions,
  clearPlansAndDrawingReducer,
  updateParamsActions,
  clearPlansAndDrawingErrorsReducer,
  setDataFilterAction,
} from './plans-and-drawings.action';

const INITIAL_STATE: PlanningAndDrawingsStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },
  dataFilter: null,
  listPlanningAndDrawings: undefined,
  planningAndDrawingsDetail: null,
  errorList: undefined,
};

const PlansAndDrawingReducer = createReducer<PlanningAndDrawingsStoreModel>(
  INITIAL_STATE,
)
  .handleAction(
    getListPlansAndDrawingMasterActions.request,
    (state, { payload }) => ({
      ...state,
      params: { ...payload },
      loading: payload?.isRefreshLoading,
    }),
  )
  .handleAction(
    getListPlansAndDrawingMasterActions.success,
    (state, { payload }) => ({
      ...state,
      listPlanningAndDrawings: payload,
      loading: false,
    }),
  )
  .handleAction(getListPlansAndDrawingMasterActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deletePlansAndDrawingActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deletePlansAndDrawingActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deletePlansAndDrawingActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updatePlansAndDrawingMasterActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(updatePlansAndDrawingMasterActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(
    updatePlansAndDrawingMasterActions.failure,
    (state, { payload }) => ({
      ...state,
      loading: false,
      errorList: payload,
    }),
  )

  .handleAction(createPlansAndDrawingActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(createPlansAndDrawingActions.success, (state) => ({
    ...state,
    params: { isLeftMenu: false },

    loading: false,
  }))
  .handleAction(createPlansAndDrawingActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getPlansAndDrawingDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getPlansAndDrawingDetailActions.success,
    (state, { payload }) => ({
      ...state,
      planningAndDrawingsDetail: payload,
      loading: false,
    }),
  )
  .handleAction(getPlansAndDrawingDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearPlansAndDrawingErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
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

  .handleAction(clearPlansAndDrawingReducer, () => ({
    ...INITIAL_STATE,
    loading: false,
  }));

export default PlansAndDrawingReducer;
