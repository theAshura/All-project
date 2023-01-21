import { ErrorField, CompanyObject } from 'models/common.model';

export enum Scope {
  internal = 'internal',
  external = 'external',
}

export enum Status {
  active = 'active',
  inactive = 'inactive',
}
export interface OwnerBusiness {
  id: string;
  name: string;
  code: string;
  status: string;
  description?: string;
  createdAt?: Date;
  createdBy?: string;
  createdName?: string;
  updatedAt?: Date;
  company?: CompanyObject;
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
  afterCreate?: () => void;
}

export interface GetOwnerBusinessResponse {
  data: OwnerBusiness[];
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
export interface GetOwnerBusinessParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  getList?: () => void;
}

export interface CreateOwnerBusinessParams {
  name: string;
  code: string;
  scope: string;
}

export interface UpdateOwnerBusinessParams {
  id: string;
  data: CreateOwnerBusinessParams;
  afterUpdate?: () => void;
}

export interface OwnerBusinessDetailResponse {
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
