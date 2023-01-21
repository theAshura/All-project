import { ErrorField } from 'models/common.model';

export enum Scope {
  internal = 'internal',
  external = 'external',
}

export enum Status {
  active = 'active',
  inactive = 'inactive',
}
export interface Category {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  code?: string;
  name?: string;
  status?: string;
  description?: string;
  parentId?: string;
  companyId?: string;
  createdUser?: {
    username?: string;
  };
  updatedUser?: {
    username?: string;
  };
  createdUserId?: string;
  updatedUserId?: string;
  numChildren?: number;
  level?: number;
  numDependents?: number;
  isNew?: boolean;

  resetForm?: () => void;
}

export interface CategoryExtend1 extends Category {
  children?: CategoryExtend1[];
  parent?: CategoryExtend1;
}

export interface CategoryExtend extends Category {
  parents: string[];
  isEnd?: boolean;
  isShow: boolean;
  showIcon: boolean;
  children?: CategoryExtend1[];
}

export interface GetCategorysResponse {
  data: Category[];
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
export interface GetCategorysParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  getList?: () => void;
}

export interface CreateCategoryParams {
  name: string;
  code: string;
  scope: string;
}

export interface UpdateCategoryParams {
  id: string;
  data: CreateCategoryParams;
}

export interface CategoryDetailResponse {
  id: string;
  code: string;
  name: string;
  scope: string;
  status: string;
  description?: string;
  deleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  parentId?: string;
}

export interface ErrorResponsive {
  errorList: ErrorField[];
}
