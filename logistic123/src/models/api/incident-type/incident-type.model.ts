import { ErrorField, CompanyObject } from 'models/common.model';

export interface ByUser {
  username: string;
}
export interface IncidentType {
  id: string;
  name: string;
  code: string;
  status: string;
  companyId: string;
  company: CompanyObject;
  createdAt: Date | string;
  updatedAt: Date | string;
  description: string;
  createdBy?: string;
  updatedBy?: string;
  createdUser?: { username: string };
  updatedUser?: { username: string };
  isNew?: boolean;
  resetForm?: () => void;
  afterCreate?: () => void;
}

export interface GetIncidentTypesResponse {
  data: IncidentType[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface ParamsList {
  page?: number;
  pageSize?: number;
  content?: string;
  scope?: string;
  sort?: string;
}
export interface GetIncidentTypesParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  getList?: () => void;
}

export interface CreateIncidentTypeParams {
  name: string;
  code: string;
  scope: string;
  description: string;
  afterCreate?: () => void;
}

export interface UpdateIncidentTypeParams {
  id: string;
  data: CreateIncidentTypeParams;
  resetForm?: () => void;
  afterCreate?: () => void;
}

export interface CheckExitCodeParams {
  entity: string;
  field: string;
  value: string;
}

export interface checkExitResponse {
  isExistCode?: boolean;
  isExistName?: boolean;
}

export interface IncidentTypeDetailResponse {
  id: string;
  name: string;
  code: string;
  status: string;
  companyId: string;
  company: { name: string };
  createdAt: Date | string;
  updatedAt: Date | string;
  description: string;
  createdBy?: string;
  updatedBy?: string | null;
  createdUser?: { username: string };
  updatedUser?: { username: string };
}

export interface ErrorResponsive {
  errorList: ErrorField[];
}
