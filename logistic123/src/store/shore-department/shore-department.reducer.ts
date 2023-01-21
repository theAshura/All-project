import { createReducer } from 'typesafe-actions';
import { ShoreDepartmentStore } from 'models/store/shore-department/shore-department.models';
import {
  getListShoreDepartmentAction,
  createShoreDepartmentAction,
  editShoreDepartmentAction,
  clearErrorMessages,
  updateParamsActions,
  clearShoreDepartmentReducer,
  deleteShoreDepartmentActions,
} from './shore-department.action';

const INITIAL_STATE: ShoreDepartmentStore = {
  loading: false,
  listShore: undefined,
  messageError: [],
  params: { isLeftMenu: false },
};

const ShoreDepartmentReducer = createReducer<ShoreDepartmentStore>(
  INITIAL_STATE,
)
  .handleAction(getListShoreDepartmentAction.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListShoreDepartmentAction.success, (state, { payload }) => ({
    ...state,
    listShore: payload,
    loading: false,
  }))
  .handleAction(getListShoreDepartmentAction.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(createShoreDepartmentAction.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(createShoreDepartmentAction.success, () => ({
    ...INITIAL_STATE,
  }))
  .handleAction(createShoreDepartmentAction.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    messageError: payload,
  }))
  .handleAction(editShoreDepartmentAction.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(editShoreDepartmentAction.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(editShoreDepartmentAction.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    messageError: payload,
  }))

  .handleAction(deleteShoreDepartmentActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteShoreDepartmentActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deleteShoreDepartmentActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(clearErrorMessages, (state) => ({
    ...state,
    messageError: [],
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))

  .handleAction(clearShoreDepartmentReducer, (state) => ({
    ...state,
    loading: false,
    listShore: undefined,
    params: { isLeftMenu: false },

    messageError: [],
  }));

export default ShoreDepartmentReducer;
