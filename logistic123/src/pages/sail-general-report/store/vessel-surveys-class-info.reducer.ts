import { VesselSurveysClassInfoStoreModel } from 'pages/vessel-screening/utils/models/vessel-surveys-class-info.model';
import { createReducer } from 'typesafe-actions';
import {
  clearVesselScreeningSurveysClassInfoErrorsReducer,
  clearVesselScreeningSurveysClassInfoReducer,
  getListVesselSurveysClassInfoActions,
  updateParamsActions,
  setDataFilterAction,
  updateVesselSurveysClassInfoActions,
} from './vessel-surveys-class-info.action';

const INITIAL_STATE: VesselSurveysClassInfoStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },
  list: null,
  dataFilter: null,
  errors: undefined,
};

const vesselSurveysClassInfoReducer =
  createReducer<VesselSurveysClassInfoStoreModel>(INITIAL_STATE)
    .handleAction(
      getListVesselSurveysClassInfoActions.request,
      (state, { payload }) => ({
        ...state,
        params: { ...payload },
        loading: payload?.isRefreshLoading,
      }),
    )
    .handleAction(
      getListVesselSurveysClassInfoActions.success,
      (state, { payload }) => ({
        ...state,
        list: payload,
        loading: false,
      }),
    )
    .handleAction(getListVesselSurveysClassInfoActions.failure, (state) => ({
      ...state,
      loading: false,
    }))

    .handleAction(updateVesselSurveysClassInfoActions.request, (state) => ({
      ...state,
      loading: true,
    }))
    .handleAction(updateVesselSurveysClassInfoActions.success, (state) => ({
      ...state,
      loading: false,
    }))
    .handleAction(
      updateVesselSurveysClassInfoActions.failure,
      (state, { payload }) => ({
        ...state,
        errors: payload,
        loading: false,
      }),
    )

    .handleAction(
      clearVesselScreeningSurveysClassInfoErrorsReducer,
      (state) => ({
        ...state,
        errors: undefined,
      }),
    )
    .handleAction(updateParamsActions, (state, { payload }) => ({
      ...state,
      params: payload,
      dataFilter: payload?.isLeftMenu ? null : state?.dataFilter,
    }))
    .handleAction(
      clearVesselScreeningSurveysClassInfoReducer,
      (state, { payload }) => ({
        ...state,
        dataFilter: payload ? null : state?.dataFilter,
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
    }));

export default vesselSurveysClassInfoReducer;
