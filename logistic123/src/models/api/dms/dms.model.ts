import { CompanyObject } from 'models/common.model';

export enum Scope {
  internal = 'internal',
  external = 'external',
}

export enum Status {
  active = 'active',
  inactive = 'inactive',
}

export interface User {
  id: string;
  username: string;
}

export interface DMS {
  id?: string;
  name?: string;
  code?: string;
  status?: string;
  module?: string;
  description?: string;
  attachments?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  createdUser?: {
    username?: string;
  };
  company?: CompanyObject;
  companyId?: string;
  updatedUser?: {
    username?: string;
  };
  isNew?: boolean;
  resetForm?: () => void;
}

export interface GetDMSsResponse {
  data: DMS[];
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

export interface GetDMSsParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  getList?: () => void;
}

export interface UpdateDMSParams {
  id: string;
  data: DMS;
}
export interface GetListFile {
  id?: string;
  type?: string;
  key?: string;
  mimetype?: string;
  size?: number;
  link?: string;
  originName?: string;
  createdAt?: Date;
  name?: string;
  uploadByUser?: User;
}
