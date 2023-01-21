import { ErrorField, CompanyObject } from 'models/common.model';

export enum Scope {
  internal = 'internal',
  external = 'external',
}

export enum Status {
  active = 'active',
  inactive = 'inactive',
}
export interface ThirdCategory {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  code?: string;
  name?: string;
  status?: string;
  description?: string;
  companyId?: string;
  company?: CompanyObject;
  createdUser?: {
    username?: string;
  };
  updatedUser?: {
    username?: string;
  };
  createdUserId?: string;
  updatedUserId?: string;
  isNew?: boolean;
  afterCreate?: () => void;
  resetForm?: () => void;
}

export interface GetThirdCategoryResponse {
  data: ThirdCategory[];
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
export interface GetThirdCategoryParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  getList?: () => void;
}

export interface CreateThirdCategoryParams {
  name: string;
  code: string;
  scope: string;
}

export interface UpdateThirdCategoryParams {
  id: string;
  data: CreateThirdCategoryParams;
  handleSuccess?: () => void;
}

export interface ThirdCategoryDetailResponse {
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
