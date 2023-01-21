import { RoleAndPermissionStoreModel } from 'models/store/role/role.model';
import { createReducer } from 'typesafe-actions';
import {
  getAllActions,
  clearRolesErrorsReducer,
  getListRolesActions,
  deleteRoleActions,
  getPermissionsActions,
  createRoleActions,
  getRolePermissionDetailActions,
  updateRoleActions,
  updateParamsActions,
  clearRoleAndPermissionReducer,
} from './role.action';

const INITIAL_STATE: RoleAndPermissionStoreModel = {
  loading: false,
  disable: false,
  rolePermissionDetail: null,
  params: { isLeftMenu: false },
  listActions: [],
  listPermission: [],
  listRoles: null,
  errorList: undefined,
};

const roleAndPermissionReducer = createReducer<RoleAndPermissionStoreModel>(
  INITIAL_STATE,
)
  .handleAction(getAllActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getAllActions.success, (state, { payload }) => ({
    ...state,
    listActions: payload,
  }))
  .handleAction(getAllActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(getListRolesActions.request, (state, { payload }) => ({
    ...state,
    params: payload,
    loading: payload?.isRefreshLoading,
  }))
  .handleAction(getListRolesActions.success, (state, { payload }) => ({
    ...state,
    loading: false,
    listRoles: payload,
  }))
  .handleAction(getListRolesActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(deleteRoleActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(deleteRoleActions.success, (state, { payload }) => ({
    ...state,
    params: payload,
    loading: false,
  }))
  .handleAction(deleteRoleActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(updateRoleActions.request, (state) => ({
    ...state,
    errorList: undefined,
    loading: true,
  }))
  .handleAction(updateRoleActions.success, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(updateRoleActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getPermissionsActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(getPermissionsActions.success, (state, { payload }) => ({
    ...state,
    listPermission: payload,
    loading: false,
  }))
  .handleAction(getPermissionsActions.failure, (state) => ({
    ...state,
    loading: false,
  }))

  .handleAction(createRoleActions.request, (state) => ({
    ...state,
    loading: true,
    errorList: undefined,
  }))
  .handleAction(createRoleActions.success, () => ({
    ...INITIAL_STATE,
  }))
  .handleAction(createRoleActions.failure, (state, { payload }) => ({
    ...state,
    loading: false,
    errorList: payload,
  }))

  .handleAction(getRolePermissionDetailActions.request, (state) => ({
    ...state,
    loading: true,
  }))
  .handleAction(
    getRolePermissionDetailActions.success,
    (state, { payload }) => ({
      ...state,
      rolePermissionDetail: payload,
      loading: false,
    }),
  )
  .handleAction(getRolePermissionDetailActions.failure, (state) => ({
    ...state,
    loading: false,
  }))
  .handleAction(clearRolesErrorsReducer, (state) => ({
    ...state,
    errorList: undefined,
  }))

  .handleAction(updateParamsActions, (state, { payload }) => ({
    ...state,
    params: payload,
  }))

  .handleAction(clearRoleAndPermissionReducer, () => ({
    ...INITIAL_STATE,
  }));
export default roleAndPermissionReducer;
