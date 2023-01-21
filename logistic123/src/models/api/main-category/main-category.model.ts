import { ErrorField, CompanyObject } from 'models/common.model';

export enum Scope {
  internal = 'internal',
  external = 'external',
}

export enum Status {
  active = 'active',
  inactive = 'inactive',
}
export interface MainCategory {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  code?: string;
  name?: string;
  status?: string;
  description?: string;
  companyId?: string;
  createdUser?: {
    username?: string;
  };
  updatedUser?: {
    username?: string;
  };
  company?: CompanyObject;
  createdUserId?: string;
  updatedUserId?: string;
  isNew?: boolean;
  acronym?: string;
  afterCreate?: () => void;
  resetForm?: () => void;
}

export interface GetMainCategoryResponse {
  data: MainCategory[];
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
export interface GetMainCategoryParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  getList?: () => void;
}

export interface CreateMainCategoryParams {
  name?: string;
  code?: string;
  scope?: string;
  resetForm?: () => void;
  afterCreate?: () => void;
}

export interface UpdateMainCategoryParams {
  id: string;
  data: CreateMainCategoryParams;
  resetForm?: () => void;
  afterCreate?: () => void;
}

export interface MainCategoryDetailResponse {
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
