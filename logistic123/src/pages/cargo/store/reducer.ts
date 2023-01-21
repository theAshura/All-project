import { createReducer } from 'typesafe-actions';
import { CargoStoreModel } from '../utils/model';
import {
  getListCargoActions,
  updateParamsActions,
  deleteCargoActions,
  updateCargoActions,
  createCargoActions,
  getCargoDetailActions,
  clearCargoReducer,
  clearCargoErrorsReducer,
  clearCargoParamsReducer,
  checkExitCodeAction,
} from './action';

const INITIAL_STATE: CargoStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },
  isExistField: {
    isExistCode: false,
    isExistName: false,
  },
  listCargos: undefined,
  cargoDetail: null,
  errorList: undefined,
};

const CargoReducer = createReducer<CargoStoreModel>(INITIAL_STATE)
  .handleAction(getListCargoActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListCargoActions.success, (state, { payload }) => ({
    ...state,
    loading: false,
    listCargos: payload,
  }))
  .handleAction(getListCargoActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(deleteCargoActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteCargoActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deleteCargoActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateCargoActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(updateCargoActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateCargoActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(createCargoActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(createCargoActions.success, (state) => ({
    ...state,
    loading: false,
    params: { isLeftMenu: false },
  }))
  .handleAction(createCargoActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getCargoDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getCargoDetailActions.success, (state, { payload }) => ({
    ...state,
    CargoDetail: payload,
    loading: false,
  }))
  .handleAction(getCargoDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearCargoErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))

  .handleAction(clearCargoParamsReducer, (state) => ({
    ...state,
    params: undefined,
  }))

  .handleAction(checkExitCodeAction.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(checkExitCodeAction.success, (state, { payload }) => ({
    ...state,
    loading: false,
    isExistField: payload,
  }))
  .handleAction(checkExitCodeAction.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearCargoReducer, () => ({
    ...INITIAL_STATE,
  }));

export default CargoReducer;
