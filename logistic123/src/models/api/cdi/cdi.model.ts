import { CompanyObject } from 'models/common.model';

export enum Status {
  active = 'active',
  inactive = 'inactive',
}
export interface CDI {
  id: string;
  name: string;
  code: string;
  status: string;
  createdAt: Date;
  description: string;
  updatedUser: { username: string };
  createdUser: { username: string };
  updatedAt: Date;
  company?: CompanyObject;
  isNew?: boolean;
  resetForm?: () => void;
}

export interface GetCDIsResponse {
  data: CDI[];
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
export interface GetCDIsParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  getList?: () => void;
}

export interface CreateCDIParams {
  name: string;
  code: string;
  status: string;
}

export interface UpdateCDIParams {
  id: string;
  data: CreateCDIParams;
  afterUpdate?: () => void;
}

export interface CDIDetailResponse {
  id: string;
  code: string;
  name: string;
  description: string;
  status: string;
  deleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
