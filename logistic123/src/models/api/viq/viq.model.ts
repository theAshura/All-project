import { CompanyObject } from 'models/common.model';

export enum Scope {
  internal = 'internal',
  external = 'external',
}

export enum Status {
  active = 'active',
  inactive = 'inactive',
}

export interface ParamsList {
  page?: number;
  pageSize?: number;
  content?: string;
  status?: string;
  sort?: string;
}

export interface PotentialRisk {
  id: string;
  risk: string;
  order: number;
}

// CREATE

export interface ViqSubCategory {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  status?: string;
  parentId?: string;
  subCategoryName: string;
  potentialRiskId: string;
  subRefNo: string;
  question: string;
  guidance: string;
  viqMainCategoryId?: string;
  companyId?: string;
  children: ViqSubCategory[];
  dateTime?: Date; // sort table detail
  isNew?: boolean;
}
export interface ViqMainCategory {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  viqId?: string;
  companyId?: string;
  mainCategoryNo: string;
  mainCategoryName: string;
  viqSubCategories: ViqSubCategory[];
  mainIndex?: number;
  dateTime?: Date; // sort table detail
}

export interface CreateViqParams {
  id?: string;
  status: string;
  type: string;
  udfVersionNo: string;
  viqVesselType: string;
  viqMainCategories: ViqMainCategory[];
  isNew?: boolean;
  resetForm?: () => void;
}

// DATA

export interface ViqResponse {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  type: string;
  viqVesselType: string;
  udfVersionNo: string;
  refNo: string;
  status: string;
  timezone: string;
  companyId: string;
  createdUserId?: string;
  company?: CompanyObject;
  updatedUserId?: string;
  viqMainCategories: ViqMainCategory[];
}

// GET LIST
export interface GetVIQsResponse {
  data: ViqResponse[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}
// UPDATE

export interface UpdateVIQParams {
  id: string;
  data: CreateViqParams;
  isCreate?: boolean;
  afterUpdate?: () => void;
}

// DELETE
export interface DeleteVIQParams {
  id: string;
  afterDelete?: () => void;
}
