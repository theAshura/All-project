import { CompanyObject, ErrorField } from 'models/common.model';

export enum Scope {
  internal = 'internal',
  external = 'external',
}

export enum Status {
  active = 'active',
  inactive = 'inactive',
}
export interface PscAction {
  id: string;
  name: string;
  code: string;
  status: string;
  description?: string;
  createdAt?: Date;
  createdBy?: string;
  createdName?: string;
  company?: CompanyObject;
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
  afterCreate?: () => void;
}

export interface GetPscActionResponse {
  data: PscAction[];
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
export interface GetPscActionParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  getList?: () => void;
}

export interface CreatePscActionParams {
  name: string;
  code: string;
  scope: string;
}

export interface UpdatePscActionParams {
  id: string;
  data: CreatePscActionParams;
  afterUpdate?: () => void;
}

export interface PscActionDetailResponse {
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
