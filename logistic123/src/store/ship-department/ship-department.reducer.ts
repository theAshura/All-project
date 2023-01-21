import { ShipDepartmentStoreModel } from 'models/store/ship-department/ship-department.model';
import { createReducer } from 'typesafe-actions';
import {
  getListShipDepartmentActions,
  deleteShipDepartmentActions,
  updateShipDepartmentActions,
  createShipDepartmentActions,
  getShipDepartmentDetailActions,
  clearShipDepartmentReducer,
  updateParamsActions,
  clearShipDepartmentErrorsReducer,
} from './ship-department.action';

const INITIAL_STATE: ShipDepartmentStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },

  listShipDepartments: undefined,
  shipDepartmentDetail: null,
  errorList: undefined,
};

const shipDepartmentReducer = createReducer<ShipDepartmentStoreModel>(
  INITIAL_STATE,
)
  .handleAction(getListShipDepartmentActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListShipDepartmentActions.success, (state, { payload }) => ({
    ...state,
    listShipDepartments: payload,
    loading: false,
  }))
  .handleAction(getListShipDepartmentActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deleteShipDepartmentActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteShipDepartmentActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deleteShipDepartmentActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateShipDepartmentActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(updateShipDepartmentActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateShipDepartmentActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(createShipDepartmentActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(createShipDepartmentActions.success, (state) => ({
    ...state,
    params: { isLeftMenu: false },

    loading: false,
  }))
  .handleAction(createShipDepartmentActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getShipDepartmentDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getShipDepartmentDetailActions.success,
    (state, { payload }) => ({
      ...state,
      shipDepartmentDetail: payload,
      loading: false,
    }),
  )
  .handleAction(getShipDepartmentDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearShipDepartmentErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))

  .handleAction(clearShipDepartmentReducer, () => ({
    ...INITIAL_STATE,
  }));

export default shipDepartmentReducer;
