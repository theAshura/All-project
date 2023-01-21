import { createReducer } from 'typesafe-actions';
import { CargoTypeStoreModel } from '../utils/model';
import {
  getListCargoTypeActions,
  updateParamsActions,
  deleteCargoTypeActions,
  updateCargoTypeActions,
  createCargoTypeActions,
  getCargoTypeDetailActions,
  clearCargoTypeReducer,
  clearCargoTypeErrorsReducer,
  clearCargoTypeParamsReducer,
  checkExitCodeAction,
} from './action';

const INITIAL_STATE: CargoTypeStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },
  isExistField: {
    isExistCode: false,
    isExistName: false,
  },
  listCargoTypes: undefined,
  cargoDetail: null,
  errorList: undefined,
};

const CargoTypeReducer = createReducer<CargoTypeStoreModel>(INITIAL_STATE)
  .handleAction(getListCargoTypeActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListCargoTypeActions.success, (state, { payload }) => ({
    ...state,
    loading: false,
    listCargoTypes: payload,
  }))
  .handleAction(getListCargoTypeActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(deleteCargoTypeActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteCargoTypeActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deleteCargoTypeActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateCargoTypeActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(updateCargoTypeActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateCargoTypeActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(createCargoTypeActions.request, (state) => ({
    ...state,
    loading: false,
    errorList: undefined,
  }))
  .handleAction(createCargoTypeActions.success, (state) => ({
    ...state,
    loading: false,
    params: { isLeftMenu: false },
  }))
  .handleAction(createCargoTypeActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getCargoTypeDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getCargoTypeDetailActions.success, (state, { payload }) => ({
    ...state,
    CargoTypeDetail: payload,
    loading: false,
  }))
  .handleAction(getCargoTypeDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearCargoTypeErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))

  .handleAction(clearCargoTypeParamsReducer, (state) => ({
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

  .handleAction(clearCargoTypeReducer, () => ({
    ...INITIAL_STATE,
  }));

export default CargoTypeReducer;
