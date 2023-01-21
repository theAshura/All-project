import { VesselTypeState } from 'models/store/vessel-type/vessel-type.model';
import { createReducer } from 'typesafe-actions';
import {
  clearParamsVesselTypeReducer,
  clearVesselTypeReducer,
  createVesselTypeActions,
  deleteVesselTypeActions,
  getListVesselTypeActions,
  getVesselTypeDetailActions,
  updateVesselTypeActions,
  updateParamsActions,
} from './vessel-type.action';

const INITIAL_STATE: VesselTypeState = {
  loading: false,
  disable: false,
  listVesselTypes: null,
  vesselTypeDetail: null,
  errorList: [],
  params: { isLeftMenu: false },
};

const VesselTypeReducer = createReducer<VesselTypeState>(INITIAL_STATE)
  .handleAction(getListVesselTypeActions.request, (state, { payload }) => ({
    ...state,
    params: payload,
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListVesselTypeActions.success, (state, { payload }) => ({
    ...state,
    listVesselTypes: payload,
    errorList: [],
    loading: false,
  }))
  .handleAction(getListVesselTypeActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(deleteVesselTypeActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteVesselTypeActions.success, (state, { payload }) => ({
    ...state,
    errorList: [],
    params: payload,
    loading: false,
  }))
  .handleAction(deleteVesselTypeActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(createVesselTypeActions.request, (state) => ({
    ...state,

    loading: true,
  }))
  .handleAction(createVesselTypeActions.success, () => ({
    ...INITIAL_STATE,
  }))
  .handleAction(createVesselTypeActions.failure, (state, { payload }) => ({
    ...state,
    errorList: payload,
    loading: false,
  }))
  .handleAction(getVesselTypeDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getVesselTypeDetailActions.success, (state, { payload }) => ({
    ...state,
    vesselTypeDetail: payload,
    errorList: [],
    loading: false,
  }))
  .handleAction(getVesselTypeDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateVesselTypeActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(updateVesselTypeActions.success, (state) => ({
    ...state,
    errorList: [],
    loading: false,
  }))
  .handleAction(updateVesselTypeActions.failure, (state, { payload }) => ({
    ...state,
    errorList: payload,
    loading: false,
  }))
  .handleAction(clearVesselTypeReducer, () => ({
    ...INITIAL_STATE,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))

  .handleAction(clearParamsVesselTypeReducer, (state) => ({
    ...state,
    params: { isLeftMenu: false },
  }));

export default VesselTypeReducer;
