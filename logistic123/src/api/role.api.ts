import { requestAuthorized } from 'helpers/request';
import {
  GetAllActionsResponse,
  GetRolesResponse,
  GetRolesParams,
  GetPermissionsParams,
  CreateRoleParams,
  RolePermissionDetailResponse,
  UpdateRolePermissionsParams,
  Role,
} from 'models/api/role/role.model';
import { CommonApiParam } from 'models/common.model';

import { RoleUsers } from 'models/store/user/user.model';

import queryString from 'query-string';
import {
  AUTH_API_IAM,
  AUTH_API_IAM_ROLE,
  AUTH_API_IAM_ROLE_DEFAULT,
} from './endpoints/config.endpoint';

export const getAllActionsApi = () =>
  requestAuthorized.get<GetAllActionsResponse>(`${AUTH_API_IAM}/action`);

export const getListRolesApi = (dataParams: GetRolesParams) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetRolesResponse>(
    `${AUTH_API_IAM}/role?${params}`,
  );
};

export const getListRolesDefaultsApi = () =>
  requestAuthorized.get<Role[]>(`${AUTH_API_IAM_ROLE_DEFAULT}`);

export const deleteRoleApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${AUTH_API_IAM}/role/${dataParams}`);

export const getRolesApi = (dataParams: GetPermissionsParams) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<RoleUsers[]>(`${AUTH_API_IAM}/role?${params}`);
};

export const getRoleForUserApi = (dataParams: GetPermissionsParams) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<RoleUsers[]>(
    `${AUTH_API_IAM_ROLE}/role?${params}`,
  );
};

export const getPermissionsApi = (dataParams: GetPermissionsParams) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<RoleUsers[]>(
    `${AUTH_API_IAM}/permission?${params}`,
  );
};

export const createRoleApi = (dataParams: CreateRoleParams) =>
  requestAuthorized
    .post<void>(`${AUTH_API_IAM}/role`, dataParams)
    .catch((error) => Promise.reject(error));

export const getRolePermissionDetailApi = (id: string) =>
  requestAuthorized
    .get<RolePermissionDetailResponse>(`${AUTH_API_IAM}/role/${id}`)
    .catch((error) => Promise.reject(error));

export const updateRolePermissionDetailApi = (
  dataParams: UpdateRolePermissionsParams,
) =>
  requestAuthorized.put<void>(
    `${AUTH_API_IAM}/role/${dataParams.id}`,
    dataParams.data,
  );

export const getRoleAndPermissionApi = (dataParams: GetPermissionsParams) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<any>(
    `${AUTH_API_IAM}/role-permission?${params}`,
  );
};

export const getListRoleTemplate = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<any>(`${AUTH_API_IAM}/role?${params}`);
};
