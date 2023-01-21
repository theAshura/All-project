import { ErrorField, CompanyObject } from 'models/common.model';

export interface CreatedUser {
  username: string;
}

export interface InjuryBody {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  code: string;
  name: string;
  companyId: string;
  status: string;
  description: string;
  lti: boolean;
  createdUserId: string;
  updatedUserId: string;
  company: CompanyObject;
  createdUser: CreatedUser;
  updatedUser: CreatedUser;
  isNew?: boolean;
  handleSuccess?: () => void;
}

export interface GetInjuryBodyResponse {
  data: InjuryBody[];
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
export interface GetInjuryBodyParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  handleSuccess?: () => void;
}

export interface CreateInjuryBodyParams {
  name: string;
  code: string;
  description: string;
  lti: boolean;
  status: string;
  handleSuccess?: () => void;
}

export interface UpdateInjuryBodyParams {
  id: string;
  data: CreateInjuryBodyParams;
  handleSuccess?: () => void;
}

export interface InjuryBodyDetailResponse {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  code: string;
  name: string;
  companyId: string;
  status: string;
  description: string;
  lti: boolean;
  createdUserId: string;
  updatedUserId: string;
  company: CompanyObject;
  createdUser: CreatedUser;
  updatedUser: CreatedUser;
}

export interface ErrorResponsive {
  errorList: ErrorField[];
}
