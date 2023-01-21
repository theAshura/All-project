import { createReducer } from 'typesafe-actions';
import { RepeateFindingCalculationStoreModel } from '../utils/model';
import {
  createRepeateFindingCalculationActions,
  getListRepeateFindingCalculationActions,
  deleteRepeateFindingCalculationActions,
  updateRepeateFindingCalculationActions,
  getRepeateFindingCalculationDetailActions,
} from './action';

const INITIAL_STATE: RepeateFindingCalculationStoreModel = {
  loading: true,
  disable: false,
  params: { isLeftMenu: false },
  isExistField: {
    isExistCode: false,
    isExistName: false,
  },
  listRepeateFindingCalculation: undefined,
  RepeateFindingCalculationDetail: null,
  errorList: undefined,
};

const RepeateFindingCalculationReducer =
  createReducer<RepeateFindingCalculationStoreModel>(INITIAL_STATE)
    .handleAction(
      getListRepeateFindingCalculationActions.request,
      (state, { payload }) => ({
        ...state,
        params: { ...payload },
        loading: payload?.isRefreshLoading,
      }),
    )
    .handleAction(
      getListRepeateFindingCalculationActions.success,
      (state, { payload }) => ({
        ...state,
        loading: false,
        listRepeateFindingCalculation: payload,
      }),
    )
    .handleAction(getListRepeateFindingCalculationActions.failure, (state) => ({
      ...state,
      loading: false,
    }))
    .handleAction(deleteRepeateFindingCalculationActions.request, (state) => ({
      ...state,
      loading: true,
    }))
    .handleAction(
      deleteRepeateFindingCalculationActions.success,
      (state, { payload }) => ({
        ...state,
        params: { ...payload },
        loading: false,
      }),
    )
    .handleAction(deleteRepeateFindingCalculationActions.failure, (state) => ({
      ...state,
      loading: false,
    }))

    .handleAction(updateRepeateFindingCalculationActions.request, (state) => ({
      ...state,
      loading: false,
      errorList: undefined,
    }))
    .handleAction(updateRepeateFindingCalculationActions.success, (state) => ({
      ...state,
      loading: false,
    }))
    .handleAction(
      updateRepeateFindingCalculationActions.failure,
      (state, { payload }) => ({
        ...state,
        loading: false,
        errorList: payload,
      }),
    )

    .handleAction(createRepeateFindingCalculationActions.request, (state) => ({
      ...state,
      loading: false,
      errorList: undefined,
    }))
    .handleAction(createRepeateFindingCalculationActions.success, (state) => ({
      ...state,
      loading: false,
      params: { isLeftMenu: false },
    }))
    .handleAction(
      createRepeateFindingCalculationActions.failure,
      (state, { payload }) => ({
        ...state,
        loading: false,
        errorList: payload,
      }),
    )

    .handleAction(
      getRepeateFindingCalculationDetailActions.request,
      (state) => ({
        ...state,
        loading: true,
      }),
    )
    .handleAction(
      getRepeateFindingCalculationDetailActions.success,
      (state, { payload }) => ({
        ...state,
        RepeateFindingCalculationDetail: payload,
        loading: false,
      }),
    )
    .handleAction(
      getRepeateFindingCalculationDetailActions.failure,
      (state) => ({
        ...state,
        loading: false,
      }),
    );

export default RepeateFindingCalculationReducer;
