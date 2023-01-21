export enum Status {
  active = 'active',
  inactive = 'inactive',
}

export interface GetAllActionsResponse {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: string;
  name: string;
  description: null | string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  isDefault?: boolean;
}

export interface GetRolesResponse {
  data: Role[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface GetRolesParams {
  page?: number;
  pageSize?: number;
  content?: string;
  status?: string;
  sort?: string;
  isRefreshLoading?: boolean;
  companyId?: string;
}

export interface GetPermissionsParams {
  page?: number;
  pageSize?: number;
  content?: string;
  status?: string;
  sort?: string;
}
export interface Action {
  id: string;
  name: string;
  createdAt: Date;
}

export interface Permission {
  id: string;
  action: Action;
}
export interface Parent {
  id: string;
}

export interface ActionPermission {
  id?: string;
  name?: string;
}

export interface Datum {
  id: string;
  name: string;
  createdAt: Date;
  permissions: Permission[];
  parent: Parent | null;
  children: Datum[];
  description?: string;
  actions?: ActionPermission[];
}

export interface ListPermissionResponse {
  data: Datum[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface CreateRoleParams {
  name?: string;
  description?: string;
  status: string;
  permissions: string[];
}

export interface UpdateRolePermissionsParams {
  id: string;
  data: CreateRoleParams;
}

export interface RolePermission {
  id: string;
  roleId: string;
  permissionId: string;
  isEnable?: boolean;
}

export interface RolePermissionDetailResponse {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
  rolePermissions: RolePermission[];
  isDefault?: boolean;
}
