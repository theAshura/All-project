import { createReducer } from 'typesafe-actions';
import { VesselPlanAndDrawingStoreModel } from '../utils/models/plan-and-drawing.model';
import {
  getListVesselPlanAndDrawingActions,
  updateVesselPlanAndDrawingsActions,
  clearVesselPlanAndDrawingsReducer,
  clearVesselPlanAndDrawingsErrorsReducer,
  updateParamsActions,
  setDataFilterAction,
} from './vessel-plan-and-drawing.action';

const initParams = {
  isRefreshLoading: true,
  paramsList: {},
  isLeftMenu: false,
};
const INITIAL_STATE: VesselPlanAndDrawingStoreModel = {
  loading: false,
  params: initParams,
  listPlanAndDrawings: null,
  errorList: undefined,
  dataFilter: null,
};

const VesselPlanAndDrawingReducer =
  createReducer<VesselPlanAndDrawingStoreModel>(INITIAL_STATE)
    .handleAction(
      getListVesselPlanAndDrawingActions.request,
      (state, { payload }) => ({
        ...state,
        params: { ...payload },
        loading: payload?.isRefreshLoading,
      }),
    )
    .handleAction(
      getListVesselPlanAndDrawingActions.success,
      (state, { payload }) => ({
        ...state,
        listPlanAndDrawings: payload,
        loading: false,
      }),
    )
    .handleAction(getListVesselPlanAndDrawingActions.failure, (state) => ({
      ...state,
      loading: false,
    }))
    .handleAction(
      updateVesselPlanAndDrawingsActions.request,
      (state, { payload }) => ({
        ...state,
        loading: true,
      }),
    )
    .handleAction(
      updateVesselPlanAndDrawingsActions.success,
      (state, { payload }) => ({
        ...state,
        loading: false,
      }),
    )
    .handleAction(
      updateVesselPlanAndDrawingsActions.failure,
      (state, { payload }) => ({
        ...state,
        errors: payload,
        loading: false,
      }),
    )
    .handleAction(clearVesselPlanAndDrawingsErrorsReducer, (state) => ({
      ...state,
      errorList: undefined,
    }))
    .handleAction(updateParamsActions, (state, { payload }) => ({
      ...state,
      params: payload,
      dataFilter: payload?.isLeftMenu ? null : state?.dataFilter,
    }))
    .handleAction(clearVesselPlanAndDrawingsReducer, (state, { payload }) => ({
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

export default VesselPlanAndDrawingReducer;
