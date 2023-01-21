import { PlanningAndDrawingsStoreModel } from 'models/store/plans-and-drawings/plans-and-drawings.model';
import { createReducer } from 'typesafe-actions';
import {
  createPlanningAndDrawingsActions,
  clearPlanningAndDrawingsReducer,
  clearPlanningAndDrawingsErrorsReducer,
  clearPlanningAndDrawingsParamsReducer,
  getListPlanningAndDrawingsActions,
  deletePlanningAndDrawingsActions,
  updatePlanningAndDrawingsActions,
  getPlanningAndDrawingsDetailActions,
  getListPlanningAndDrawingsMasterActions,
  getListPlanningAndDrawingsBodyActions,
} from './planning-and-drawings.action';

const INITIAL_STATE: PlanningAndDrawingsStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },
  errorList: undefined,
  dataFilter: null,
  listPlanningAndDrawings: undefined,
  planningAndDrawingsDetail: null,
};

const injuryReducer = createReducer<PlanningAndDrawingsStoreModel>(
  INITIAL_STATE,
)
  .handleAction(
    getListPlanningAndDrawingsActions.request,
    (state, { payload }) => ({
      ...state,
      params: { ...payload },
      loading: payload?.isRefreshLoading,
    }),
  )
  .handleAction(
    getListPlanningAndDrawingsActions.success,
    (state, { payload }) => ({
      ...state,
      loading: false,
      listPlanningAndDrawings: payload,
    }),
  )
  .handleAction(getListPlanningAndDrawingsActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(
    getListPlanningAndDrawingsMasterActions.request,
    (state, { payload }) => ({
      ...state,
      params: { ...payload },
      loading: payload?.isRefreshLoading,
    }),
  )
  .handleAction(
    getListPlanningAndDrawingsMasterActions.success,
    (state, { payload }) => ({
      ...state,
      loading: false,
      listPlanningAndDrawingsMaster: payload,
    }),
  )
  .handleAction(getListPlanningAndDrawingsMasterActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(
    getListPlanningAndDrawingsBodyActions.request,
    (state, { payload }) => ({
      ...state,
      params: { ...payload },
      loading: payload?.isRefreshLoading,
    }),
  )
  .handleAction(
    getListPlanningAndDrawingsBodyActions.success,
    (state, { payload }) => ({
      ...state,
      loading: false,
      listPlanningAndDrawingsBody: payload,
    }),
  )
  .handleAction(getListPlanningAndDrawingsBodyActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(createPlanningAndDrawingsActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(
    createPlanningAndDrawingsActions.success,
    (state, { payload }) => ({
      ...state,
      loading: false,
      params: { isLeftMenu: false },
    }),
  )
  .handleAction(
    createPlanningAndDrawingsActions.failure,
    (state, { payload }) => ({
      ...state,
      loading: false,
      errorList: payload,
    }),
  )
  .handleAction(deletePlanningAndDrawingsActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    deletePlanningAndDrawingsActions.success,
    (state, { payload }) => ({
      ...state,
      params: { ...payload },
      loading: false,
    }),
  )
  .handleAction(deletePlanningAndDrawingsActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updatePlanningAndDrawingsActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(updatePlanningAndDrawingsActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(
    updatePlanningAndDrawingsActions.failure,
    (state, { payload }) => ({
      ...state,
      loading: false,
      errorList: payload,
    }),
  )
  .handleAction(getPlanningAndDrawingsDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getPlanningAndDrawingsDetailActions.success,
    (state, { payload }) => ({
      ...state,
      planningAndDrawingsDetail: payload,
      loading: false,
    }),
  )
  .handleAction(getPlanningAndDrawingsDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearPlanningAndDrawingsErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(clearPlanningAndDrawingsParamsReducer, (state) => ({
    ...state,
    params: undefined,
  }))

  .handleAction(clearPlanningAndDrawingsReducer, (state) => ({
    ...INITIAL_STATE,
  }));

export default injuryReducer;
