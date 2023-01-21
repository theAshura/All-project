import { CommonApiParam, ErrorField, CompanyObject } from 'models/common.model';

export interface TransferType {
  id: string;
  name: string;
  code: string;
  status: string;
  companyId: string;
  company: CompanyObject;
  createdAt: Date;
  updatedAt: Date;
  description: string;
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

export interface GetTransferTypesResponse {
  data: TransferType[];
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
export interface GetTransferTypesParams {
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

export interface CreateTransferTypeParams {
  name: string;
  code: string;
  companyId: string;
  status: string;
  afterCreate?: () => void;
}

export interface UpdateTransferTypeParams {
  id: string;
  data: CreateTransferTypeParams;
  afterUpdate?: () => void;
}

export interface TransferTypeDetailResponse {
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

export interface TransferTypeStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  isExistField: checkExitResponse;
  listTransferTypes: GetTransferTypesResponse;
  transferTypeDetail: TransferTypeDetailResponse;
  errorList: ErrorField[];
}
