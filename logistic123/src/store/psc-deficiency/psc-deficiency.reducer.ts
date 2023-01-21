import { PSCDeficiencyState } from 'models/store/psc-deficiency/psc-deficiency.model';
import { createReducer } from 'typesafe-actions';
import {
  clearParamsPSCDeficiencyReducer,
  clearPSCDeficiencyErrorsReducer,
  clearPSCDeficiencyReducer,
  createPSCDeficiencyActions,
  deletePSCDeficiencyActions,
  getListPSCDeficiencyActions,
  getPSCDeficiencyDetailActions,
  updatePSCDeficiencyActions,
  updateParamsActions,
} from './psc-deficiency.action';

const INITIAL_STATE: PSCDeficiencyState = {
  loading: false,
  disable: false,
  listPSCDeficiency: null,
  pscDeficiencyDetail: null,
  errorList: [],
  params: { isLeftMenu: false },
};

const PSCDeficiencyReducer = createReducer<PSCDeficiencyState>(INITIAL_STATE)
  .handleAction(getListPSCDeficiencyActions.request, (state, { payload }) => ({
    ...state,
    params: payload,
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListPSCDeficiencyActions.success, (state, { payload }) => ({
    ...state,
    listPSCDeficiency: payload,
    errorList: [],
    loading: false,
  }))
  .handleAction(getListPSCDeficiencyActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(deletePSCDeficiencyActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deletePSCDeficiencyActions.success, (state, { payload }) => ({
    ...state,
    errorList: [],
    params: payload,
    loading: false,
  }))
  .handleAction(deletePSCDeficiencyActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(createPSCDeficiencyActions.request, (state) => ({
    ...state,

    loading: true,
  }))
  .handleAction(createPSCDeficiencyActions.success, () => ({
    ...INITIAL_STATE,
  }))
  .handleAction(createPSCDeficiencyActions.failure, (state, { payload }) => ({
    ...state,
    errorList: payload,
    loading: false,
  }))
  .handleAction(getPSCDeficiencyDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getPSCDeficiencyDetailActions.success,
    (state, { payload }) => ({
      ...state,
      pscDeficiencyDetail: payload,
      errorList: [],
      loading: false,
    }),
  )
  .handleAction(getPSCDeficiencyDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updatePSCDeficiencyActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(updatePSCDeficiencyActions.success, (state) => ({
    ...state,
    errorList: [],
    loading: false,
  }))
  .handleAction(updatePSCDeficiencyActions.failure, (state, { payload }) => ({
    ...state,
    errorList: payload,
    loading: false,
  }))
  .handleAction(clearPSCDeficiencyReducer, () => ({
    ...INITIAL_STATE,
  }))
  .handleAction(clearParamsPSCDeficiencyReducer, (state) => ({
    ...state,
    params: { isLeftMenu: false },
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))
  .handleAction(clearPSCDeficiencyErrorsReducer, (state) => ({
    ...state,
    errorList: [],
  }));

export default PSCDeficiencyReducer;
