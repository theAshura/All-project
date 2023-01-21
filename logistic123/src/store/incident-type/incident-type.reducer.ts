import { IncidentTypeStoreModel } from 'models/store/incident-type/incident-type.model';
import { createReducer } from 'typesafe-actions';
import {
  getListIncidentTypeActions,
  deleteIncidentTypeActions,
  updateIncidentTypeActions,
  createIncidentTypeActions,
  getIncidentTypeDetailActions,
  clearIncidentTypeReducer,
  updateParamsActions,
  clearIncidentTypeErrorsReducer,
  checkExitCodeAction,
} from './incident-type.action';

const INITIAL_STATE: IncidentTypeStoreModel = {
  loading: true,
  params: { isLeftMenu: false },
  listIncidentTypes: undefined,
  incidentTypeDetail: null,
  errorList: undefined,
  isExistField: {
    isExistCode: false,
    isExistName: false,
  },
};

const auditTypeReducer = createReducer<IncidentTypeStoreModel>(INITIAL_STATE)
  .handleAction(getListIncidentTypeActions.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListIncidentTypeActions.success, (state, { payload }) => ({
    ...state,
    listIncidentTypes: payload,
    loading: false,
  }))
  .handleAction(getListIncidentTypeActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deleteIncidentTypeActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteIncidentTypeActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deleteIncidentTypeActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateIncidentTypeActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(updateIncidentTypeActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateIncidentTypeActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(createIncidentTypeActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(createIncidentTypeActions.success, (state) => ({
    ...state,
    params: { isLeftMenu: false },

    loading: false,
  }))
  .handleAction(createIncidentTypeActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getIncidentTypeDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getIncidentTypeDetailActions.success, (state, { payload }) => ({
    ...state,
    incidentTypeDetail: payload,
    loading: false,
  }))
  .handleAction(getIncidentTypeDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(clearIncidentTypeErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
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

  .handleAction(clearIncidentTypeReducer, () => ({
    ...INITIAL_STATE,
  }));

export default auditTypeReducer;
