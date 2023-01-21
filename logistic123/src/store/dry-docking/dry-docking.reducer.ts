import { DryDockingStoreModel } from 'models/store/dry-docking/dry-docking.model';
import { createReducer } from 'typesafe-actions';
import {
  createDryDockingActions,
  clearDryDockingAction,
  getDetailDryDocking,
  getLisDryDockingActions,
  updateDryDockingActions,
  deleteDryDockingActions,
} from './dry-docking.action';

const INITIAL_STATE: DryDockingStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },
  listDryDocking: null,
  detailDryDocking: null,
  dataFilter: null,
  errorList: undefined,
};

const dryDockingReducer = createReducer<DryDockingStoreModel>(INITIAL_STATE)
  .handleAction(getLisDryDockingActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getLisDryDockingActions.success, (state, { payload }) => ({
    ...state,
    listDryDocking: payload,
    loading: false,
  }))
  .handleAction(getLisDryDockingActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(deleteDryDockingActions.request, (state, { payload }) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteDryDockingActions.success, (state, { payload }) => ({
    ...state,
    loading: false,
  }))
  .handleAction(deleteDryDockingActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(getDetailDryDocking.request, (state, { payload }) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getDetailDryDocking.success, (state, { payload }) => ({
    ...state,
    detailDryDocking: payload,
    loading: false,
  }))
  .handleAction(getDetailDryDocking.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(createDryDockingActions.request, (state, { payload }) => ({
    ...state,
    loading: true,
  }))
  .handleAction(createDryDockingActions.success, (state, { payload }) => ({
    ...state,
    loading: false,
  }))
  .handleAction(createDryDockingActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateDryDockingActions.request, (state, { payload }) => ({
    ...state,
    loading: true,
  }))
  .handleAction(updateDryDockingActions.success, (state, { payload }) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateDryDockingActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(clearDryDockingAction, (state) => ({
    ...state,
    detailDryDocking: null,
  }));

export default dryDockingReducer;
