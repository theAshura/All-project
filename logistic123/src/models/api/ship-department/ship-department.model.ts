import { ErrorField } from 'models/common.model';

export enum Scope {
  internal = 'internal',
  external = 'external',
}

export enum Status {
  active = 'active',
  inactive = 'inactive',
}
export interface ShipDepartment {
  id: string;
  name: string;
  code: string;
  status: string;
  description?: string;
  createdAt?: Date;
  createdBy?: string;
  createdName?: string;
  updatedAt?: Date;
  createdUser?: {
    username?: string;
  };
  updatedUser?: {
    username?: string;
  };
  updatedBy?: string;
  updatedName?: string;
  isNew?: boolean;

  resetForm?: () => void;
}

export interface GetShipDepartmentsResponse {
  data: ShipDepartment[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface ParamsList {
  page?: number;
  pageSize?: number;
  content?: string;
  status?: string;
  sort?: string;
}
export interface GetShipDepartmentsParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  getList?: () => void;
}

export interface CreateShipDepartmentParams {
  name: string;
  code: string;
  scope: string;
}

export interface UpdateShipDepartmentParams {
  id: string;
  data: CreateShipDepartmentParams;
}

export interface ShipDepartmentDetailResponse {
  id: string;
  code: string;
  name: string;
  scope: string;
  status: string;
  description?: string;
  deleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ErrorResponsive {
  errorList: ErrorField[];
}
