import { ModuleConfigurationModelStore } from 'models/store/module-configuration/module-configuration.model';
import { createReducer } from 'typesafe-actions';
import {
  clearLabelDetail,
  getDetailLabelConfigActions,
  getDetailModuleConfigurationActions,
  getListLabelConfigActions,
  getListModuleConfigurationActions,
  resetModuleConfigState,
  selectModule,
  updateDetailLabelConfigActions,
  updateDetailModuleConfigurationActions,
} from './module-configuration.action';

const INITIAL_STATE: ModuleConfigurationModelStore = {
  listModuleConfiguration: null,
  loading: false,
  selectedModule: null,
  moduleDetail: null,
  listLabel: null,
  labelDetail: null,
  internalLoading: false,
};

const moduleConfigurationReducer = createReducer<ModuleConfigurationModelStore>(
  INITIAL_STATE,
)
  .handleAction(
    getListModuleConfigurationActions.request,
    (state, { payload }) => ({
      ...state,
      loading: true,
    }),
  )

  .handleAction(
    getListModuleConfigurationActions.success,
    (state, { payload }) => ({
      ...state,
      listModuleConfiguration: payload,
      loading: false,
    }),
  )

  .handleAction(
    getListModuleConfigurationActions.failure,
    (state, { payload }) => ({
      ...state,
      loading: false,
    }),
  )

  .handleAction(selectModule, (state, { payload }) => ({
    ...state,
    selectedModule: payload,
  }))

  .handleAction(
    getDetailModuleConfigurationActions.request,
    (state, { payload }) => ({
      ...state,
      loading: false,
    }),
  )

  .handleAction(
    getDetailModuleConfigurationActions.success,
    (state, { payload }) => ({
      ...state,
      moduleDetail: payload,
      loading: false,
    }),
  )

  .handleAction(
    getDetailModuleConfigurationActions.failure,
    (state, { payload }) => ({
      ...state,
      loading: false,
    }),
  )

  .handleAction(
    updateDetailModuleConfigurationActions.request,
    (state, { payload }) => ({
      ...state,
      loading: true,
    }),
  )

  .handleAction(
    updateDetailModuleConfigurationActions.success,
    (state, { payload }) => ({
      ...state,
      loading: false,
    }),
  )

  .handleAction(
    updateDetailModuleConfigurationActions.failure,
    (state, { payload }) => ({
      ...state,
      loading: false,
    }),
  )

  .handleAction(getListLabelConfigActions.request, (state, { payload }) => ({
    ...state,
    loading: true,
  }))

  .handleAction(getListLabelConfigActions.success, (state, { payload }) => ({
    ...state,
    listLabel: payload,
    loading: false,
  }))

  .handleAction(getListLabelConfigActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getDetailLabelConfigActions.request, (state, { payload }) => ({
    ...state,
    internalLoading: true,
  }))

  .handleAction(getDetailLabelConfigActions.success, (state, { payload }) => ({
    ...state,
    labelDetail: payload,
    internalLoading: false,
  }))

  .handleAction(getDetailLabelConfigActions.failure, (state, { payload }) => ({
    ...state,
    internalLoading: false,
  }))

  .handleAction(clearLabelDetail, (state, { payload }) => ({
    ...state,
    labelDetail: null,
    internalLoading: false,
  }))

  .handleAction(
    updateDetailLabelConfigActions.request,
    (state, { payload }) => ({
      ...state,
      internalLoading: true,
    }),
  )

  .handleAction(
    updateDetailLabelConfigActions.success,
    (state, { payload }) => ({
      ...state,
      internalLoading: false,
    }),
  )

  .handleAction(
    updateDetailLabelConfigActions.failure,
    (state, { payload }) => ({
      ...state,
      internalLoading: false,
    }),
  )

  .handleAction(resetModuleConfigState, (state, { payload }) => INITIAL_STATE);

export default moduleConfigurationReducer;
