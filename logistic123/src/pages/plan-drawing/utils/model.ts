import { ErrorField, CommonApiParam, CompanyObject } from 'models/common.model';

export interface VesselType {
  id: string;
  code: string;
  name: string;
}

export interface PlanDrawing {
  id: string;
  name: string;
  code: string;
  status: string;
  companyId: string;
  company: CompanyObject;
  createdAt: Date;
  updatedAt: Date;
  vesselTypeIds: string[];
  vesselTypes: VesselType[];
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

export interface GetPlanDrawingsResponse {
  data: PlanDrawing[];
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
export interface GetPlanDrawingsParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  handleSuccess?: () => void;
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

export interface CreatePlanDrawingParams {
  code: string;
  name: string;
  description: string;
  status: string;
  vesselTypeIds: string[];
  handleSuccess?: () => void;
}

export interface UpdatePlanDrawingParams {
  id: string;
  data: CreatePlanDrawingParams;
  handelSuccess?: () => void;
}

export interface PlanDrawingDetailResponse {
  id: string;
  name: string;
  code: string;
  vesselTypeId: string;
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

export interface PlanDrawingStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  isExistField: CheckExitResponse;
  listPlanDrawings: GetPlanDrawingsResponse;
  planDrawingDetail: PlanDrawingDetailResponse;
  errorList: ErrorField[];
}
