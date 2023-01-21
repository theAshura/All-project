import { ErrorField, CommonApiParam, CompanyObject } from 'models/common.model';

export interface CargoType {
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

export interface GetCargoTypesResponse {
  data: CargoType[];
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
export interface GetCargoTypesParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  getList?: () => void;
}

export interface CheckExitCodeParams {
  entity: string;
  field: string;
  value: string;
}

export interface CheckExitResponse {
  isExistCode?: boolean;
  isExistName?: boolean;
}

export interface CreateCargoTypeParams {
  name: string;
  code: string;
  companyId: string;
  status: string;
  afterCreate?: () => void;
}

export interface UpdateCargoTypeParams {
  id: string;
  data: CreateCargoTypeParams;
  afterUpdate?: () => void;
}

export interface CargoTypeDetailResponse {
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

export interface CargoTypeStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  isExistField: CheckExitResponse;
  listCargoTypes: GetCargoTypesResponse;
  cargoDetail: CargoTypeDetailResponse;
  errorList: ErrorField[];
}
