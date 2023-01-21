import { ErrorField, CompanyObject } from 'models/common.model';

export interface ByUser {
  username: string;
}
export interface Category {
  code: string;
  name: string;
}

export interface CategoryMapping {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  mainCategoryId: string;
  secondCategoryId: string;
  status: string;
  companyId: string;
  createdUserId: string;
  updatedUserId: string;
  mainCategory: Category;
  secondCategory: Category;
  createdUser: ByUser;
  updatedUser: ByUser;
  isNew?: boolean;
  company?: CompanyObject;
  resetForm?: () => void;
}

export interface GetCategoryMappingsResponse {
  data: CategoryMapping[];
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

export interface CreateCategoryMappingParams {
  mainCategoryId: string;
  secondCategoryIds: string[];
  isNew?: boolean;
  afterCreate?: () => void;
  resetForm?: () => void;
}

export interface UpdateCategoryMappingParams {
  id: string;
  data: CreateCategoryMappingParams;
  afterUpdate?: () => void;
}

export interface SecondCategory {
  id: string;
  code: string;
  name: string;
}
export interface CategoryMappingDetailResponse {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  mainCategoryId: string;
  status: string;
  companyId: string;
  createdUserId: string;
  updatedUserId: string;
  mainCategory: Category;
  createdUser: ByUser;
  updatedUser: ByUser;
  secondCategories: SecondCategory[];
}

export interface ErrorResponsive {
  errorList: ErrorField[];
}
