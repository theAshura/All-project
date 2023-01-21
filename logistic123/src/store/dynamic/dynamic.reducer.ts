import { DynamicStoreModel } from 'models/store/dynamic/dynamic.model';
import { createReducer } from 'typesafe-actions';
import { getListDynamicLabelsActions } from './dynamic.action';

const INITIAL_STATE: DynamicStoreModel = {
  loading: false,
  listDynamicLabels: null,
  listModuleDynamicLabels: null,
};

const DynamicReducer = createReducer<DynamicStoreModel>(INITIAL_STATE)
  .handleAction(getListDynamicLabelsActions.request, (state, { payload }) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getListDynamicLabelsActions.success, (state, { payload }) => ({
    ...state,
    listDynamicLabels: payload?.listDynamicLabels,
    listModuleDynamicLabels: payload?.listModuleDynamicLabels,
    loading: false,
  }))
  .handleAction(getListDynamicLabelsActions.failure, (state) => ({
    ...state,
    loading: false,
  }));

export default DynamicReducer;
