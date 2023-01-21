import { ErrorField, CompanyObject } from 'models/common.model';

export interface EventType {
  id: string;
  name: string;
  code: string;
  status: string;
  companyId: string;
  company: CompanyObject;
  createdAt: Date;
  updatedAt: Date;
  description: string;
  module?: string;
  createdBy?: string;
  updatedBy?: string | null;
  createdUser?: { username?: string };
  updatedUser?: { username?: string };
  isNew?: boolean;
  resetForm?: () => void;
}

export interface Group {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  code: string;
  name: string;
  description: string;
  numCompanies: number;
}

export interface Company {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  code?: string;
  name: string;
  status?: string;
  groupId?: string;
  country?: string;
  stateOrProvince?: string;
  townOrCity?: string;
  address?: string;
  phone?: string;
  fax?: string;
  email?: string;
  createdBy?: string;
  parentId?: string;
  numVessels?: number;
  group?: Group;
}

export interface GetEventTypesResponse {
  data: EventType[];
  page?: number;
  pageSize?: number;
  totalPage?: number;
  totalItem?: number;
}

export interface GetCompanysResponse {
  data: Company[];
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
  companyId?: string;
  sort?: string;
}
export interface GetEventTypesParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  getList?: () => void;
}

export interface GetCompanysParams {
  page?: number;
  content?: string;
  pageSize?: number;
  status?: string;
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

export interface CreateEventTypeParams {
  name: string;
  code: string;
  companyId: string;
  status: string;
  afterCreate?: () => void;
}

export interface UpdateEventTypeParams {
  id: string;
  data: CreateEventTypeParams;
  afterUpdate?: () => void;
}

export interface EventTypeDetailResponse {
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
