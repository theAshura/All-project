import { VesselManagementState } from 'models/store/vessel/vessel.model';
import { createReducer } from 'typesafe-actions';
import {
  clearVesselManagementReducer,
  clearVesselDetailAction,
  createVesselActions,
  deleteVesselActions,
  getListVesselActions,
  getVesselDetailActions,
  exportListVesselActions,
  updateParamsActions,
  updateVesselActions,
  uploadFileActions,
  setDataFilterAction,
} from './vessel.action';

const INITIAL_STATE: VesselManagementState = {
  loading: false,
  disable: false,
  errorList: [],
  params: { isLeftMenu: false },
  listVesselResponse: null,
  vesselDetail: null,
  dataFilter: null,
  avatarVessel: null,
};

const VesselManagementReducer = createReducer<VesselManagementState>(
  INITIAL_STATE,
)
  .handleAction(getListVesselActions.request, (state, { payload }) => ({
    ...state,
    params: payload,
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListVesselActions.success, (state, { payload }) => ({
    ...state,
    listVesselResponse: payload,
    errorList: [],
    avatarVessel: null,
    loading: false,
  }))
  .handleAction(getListVesselActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(deleteVesselActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteVesselActions.success, (state, { payload }) => ({
    ...state,
    params: payload,
    loading: false,
  }))
  .handleAction(deleteVesselActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(getVesselDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getVesselDetailActions.success, (state, { payload }) => ({
    ...state,
    loading: false,
    vesselDetail: payload.data,
    avatarVessel: payload.avatar,
  }))
  .handleAction(getVesselDetailActions.failure, (state) => ({
    ...state,
    loading: false,
    vesselDetail: null,
  }))
  .handleAction(createVesselActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(createVesselActions.success, () => ({
    ...INITIAL_STATE,
  }))
  .handleAction(createVesselActions.failure, (state, { payload }) => ({
    ...state,
    errorList: payload,
    loading: false,
  }))
  .handleAction(updateVesselActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(updateVesselActions.success, (state) => ({
    ...state,
    loading: false,
    errorList: [],
  }))
  .handleAction(updateVesselActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))
  .handleAction(clearVesselDetailAction, (state) => ({
    ...state,
    vesselDetail: null,
  }))
  .handleAction(exportListVesselActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(exportListVesselActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(exportListVesselActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(uploadFileActions.request, (state) => ({
    ...state,
    disable: true,
  }))
  .handleAction(uploadFileActions.success, (state, { payload }) => ({
    ...state,
    avatarVessel: payload,
    disable: false,
  }))
  .handleAction(uploadFileActions.failure, (state) => ({
    ...state,
    disable: false,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
    dataFilter: payload?.isLeftMenu ? null : state?.dataFilter,
  }))

  .handleAction(clearVesselManagementReducer, () => ({
    ...INITIAL_STATE,
    params: { isLeftMenu: false },
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

export default VesselManagementReducer;
