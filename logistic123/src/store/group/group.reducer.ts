import { createReducer } from 'typesafe-actions';
import { GroupManagementStore } from 'models/store/group/group.model';
import {
  createGroupAction,
  clearGroupManagementReducer,
  editGroupAction,
  getAllGroupAction,
  updateParamsActions,
  clearErrorMessages,
  deleteGroupActions,
} from './group.action';

const INITIAL_STATE = {
  loading: false,
  listGroup: undefined,
  params: { isLeftMenu: false },

  messageError: [],
};

const groupManagementReducer = createReducer<GroupManagementStore>(
  INITIAL_STATE,
)
  .handleAction(getAllGroupAction.request, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getAllGroupAction.success, (state, { payload }) => ({
    ...state,
    loading: false,
    listGroup: payload,
  }))
  .handleAction(getAllGroupAction.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(createGroupAction.request, (state) => ({
    ...state,
    loading: true,
    messageError: [],
  }))
  .handleAction(createGroupAction.success, () => ({
    ...INITIAL_STATE,
  }))
  .handleAction(createGroupAction.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    messageError: payload,
  }))

  .handleAction(deleteGroupActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteGroupActions.success, (state, { payload }) => ({
    ...state,
    params: { ...payload },
    loading: false,
  }))
  .handleAction(deleteGroupActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(editGroupAction.request, (state) => ({
    ...state,
    loading: true,
    messageError: [],
  }))
  .handleAction(editGroupAction.success, (state) => ({
    ...state,
    loading: false,
    messageError: [],
  }))
  .handleAction(editGroupAction.failure, (state, { payload }) => ({
    ...state,
    loading: true,
    messageError: payload,
  }))
  .handleAction(clearErrorMessages, (state) => ({
    ...state,
    messageError: [],
  }))
  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))
  .handleAction(clearGroupManagementReducer, (state) => ({
    ...state,
    loading: false,
    messageError: [],
    params: { isLeftMenu: false },

    listGroup: undefined,
  }));
export default groupManagementReducer;
