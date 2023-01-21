import { ErrorField, CompanyObject } from 'models/common.model';

export enum Status {
  active = 'active',
  inactive = 'inactive',
}

export interface FocusRequest {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  code: string;
  name: string;
  description: string;
  question: string;
  status: string;
  companyId: string;
  company?: CompanyObject;
  createdUserId: string;
  updatedUserId: string;
  createdUser?: { username: string };
  updatedUser?: { username: string };
  isNew?: boolean;
  resetForm?: () => void;
}

export interface GetFocusRequestsResponse {
  data: FocusRequest[];
  page?: number;
  pageSize?: number;
  totalPage?: number;
  totalItem?: number;
}

export interface ParamsList {
  page?: number;
  pageSize?: number;
  content?: string;
  status?: string;
  companyId?: string;
  sort?: string;
}
export interface GetFocusRequestsParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  getList?: () => void;
}

export interface CreateFocusRequestParams {
  name: string;
  code: string;
  companyId: string;
  status: string;
  afterCreate?: () => void;
}

export interface UpdateFocusRequestParams {
  id: string;
  data: CreateFocusRequestParams;
  afterUpdate?: () => void;
}

export interface FocusRequestDetailResponse {
  id: string;
  name: string;
  code: string;
  status: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string | null;
}

export interface ErrorResponsive {
  errorList: ErrorField[];
}
