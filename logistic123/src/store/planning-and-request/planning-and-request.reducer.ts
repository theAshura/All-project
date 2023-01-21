import { PlanningAndRequestStore } from 'models/store/planning-and-request/planning-and-request.model';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import { createReducer } from 'typesafe-actions';
import { PLANNING_TAB } from 'constants/components/planning.const';
import {
  getListPlanningAndRequestActions,
  deletePlanningAndRequestActions,
  updatePlanningAndRequestActions,
  createPlanningAndRequestActions,
  getPlanningAndRequestDetailActions,
  clearPlanningAndRequestReducer,
  updateParamsActions,
  clearPlanningAndRequestErrorsReducer,
  uploadFileActions,
  setDataFilterAction,
  getTotalUnplannedPlanningActions,
  getPlanningAndRequestGroupByAuditorsAction,
  getListPlanningRequestAuditLogAction,
} from './planning-and-request.action';

const INITIAL_STATE: PlanningAndRequestStore = {
  loading: false,
  disable: false,
  params: { isLeftMenu: false },
  listPlanningAndRequest: undefined,
  listPlanningCompleted: undefined,
  listPlanningUnplanned: undefined,
  listParByAuditors: undefined,
  PlanningAndRequestDetail: null,
  errorList: undefined,
  uploadFile: null,
  dataFilter: null,
  dataFilterCompleted: null,
  dataFilterUnplanned: null,
  totalUnplannedPlanning: 0,
  tab: null,
  planningAuditLog: null,
};

const planningAndRequestReducer = createReducer<PlanningAndRequestStore>(
  INITIAL_STATE,
)
  .handleAction(
    getListPlanningAndRequestActions.request,
    (state, { payload }) => ({
      ...state,
      params: { ...payload },
      loading: true,
      tab: payload?.tab,
    }),
  )
  .handleAction(
    getListPlanningAndRequestActions.success,
    (state, { payload }) => {
      switch (state.tab) {
        case PLANNING_TAB.completed: {
          return {
            ...state,
            listPlanningCompleted: payload,
            loading: false,
          };
        }
        case PLANNING_TAB.unplanned: {
          return {
            ...state,
            listPlanningUnplanned: payload,
            loading: false,
          };
        }
        default: {
          return {
            ...state,
            listPlanningAndRequest: payload,
            loading: false,
          };
        }
      }
    },
  )
  .handleAction(getListPlanningAndRequestActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deletePlanningAndRequestActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    deletePlanningAndRequestActions.success,
    (state, { payload }) => ({
      ...state,
      params: { ...payload },
      loading: false,
    }),
  )
  .handleAction(deletePlanningAndRequestActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getTotalUnplannedPlanningActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getTotalUnplannedPlanningActions.success,
    (state, { payload }) => ({
      ...state,
      totalUnplannedPlanning: payload,
      loading: false,
    }),
  )
  .handleAction(getTotalUnplannedPlanningActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updatePlanningAndRequestActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(updatePlanningAndRequestActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(
    updatePlanningAndRequestActions.failure,
    (state, { payload }) => ({
      ...state,
      loading: false,
      errorList: payload,
    }),
  )

  .handleAction(createPlanningAndRequestActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(createPlanningAndRequestActions.success, (state) => ({
    ...state,
    params: { isLeftMenu: false },

    loading: false,
  }))
  .handleAction(
    createPlanningAndRequestActions.failure,
    (state, { payload }) => ({
      ...state,
      loading: false,
      errorList: payload,
    }),
  )

  .handleAction(getPlanningAndRequestDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getPlanningAndRequestDetailActions.success,
    (state, { payload }) => ({
      ...state,
      PlanningAndRequestDetail: payload,
      loading: false,
    }),
  )
  .handleAction(getPlanningAndRequestDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(uploadFileActions.request, (state) => ({
    ...state,
    disable: true,
  }))
  .handleAction(uploadFileActions.success, (state, { payload }) => ({
    ...state,
    uploadFile: payload,
    disable: false,
  }))
  .handleAction(uploadFileActions.failure, (state) => ({
    ...state,
    disable: false,
  }))

  .handleAction(clearPlanningAndRequestErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => {
    switch (state.tab) {
      case MODULE_TEMPLATE.planningUnplannedTab: {
        return {
          ...state,
          params: payload,
          dataFilter: payload.isLeftMenu ? null : state.dataFilter,
        };
      }
      default: {
        return {
          ...state,
          params: payload,
          dataFilter: payload.isLeftMenu ? null : state.dataFilter,
        };
      }
    }

    // return {
    //   ...state,
    //   params: payload,
    //   dataFilter: payload.isLeftMenu ? null : state.dataFilter,
    // };
  })

  .handleAction(setDataFilterAction, (state, { payload }) => ({
    ...state,
    dataFilter: {
      ...payload,
      typeRange: payload?.dateFilter
        ? state.dataFilter?.typeRange
        : payload.typeRange,
    },
  }))
  .handleAction(clearPlanningAndRequestReducer, (state, { payload }) => ({
    ...INITIAL_STATE,
    dataFilter: payload ? null : state.dataFilter,
  }))
  .handleAction(
    getPlanningAndRequestGroupByAuditorsAction.request,
    (state, { payload }) => ({
      ...state,
      params: { ...payload },
      loading: true,
    }),
  )
  .handleAction(
    getPlanningAndRequestGroupByAuditorsAction.success,
    (state, { payload }) => ({
      ...state,
      listParByAuditors: payload,
      loading: false,
    }),
  )
  .handleAction(
    getPlanningAndRequestGroupByAuditorsAction.failure,
    (state) => ({
      ...state,
      loading: false,
    }),
  )
  .handleAction(getListPlanningRequestAuditLogAction.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getListPlanningRequestAuditLogAction.success,
    (state, { payload }) => ({
      ...state,
      planningAuditLog: payload,
      loading: false,
    }),
  )
  .handleAction(getListPlanningRequestAuditLogAction.failure, (state) => ({
    ...state,
    loading: false,
  }));
export default planningAndRequestReducer;
