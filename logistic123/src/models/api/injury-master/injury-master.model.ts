import { ErrorField, CompanyObject } from 'models/common.model';

export interface CreatedUser {
  username: string;
}

export interface InjuryMaster {
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

export interface GetInjuryMastersResponse {
  data: InjuryMaster[];
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
export interface GetInjuryMastersParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  handleSuccess?: () => void;
}

export interface CreateInjuryMasterParams {
  name: string;
  code: string;
  description: string;
  lti: boolean;
  status: string;
  handleSuccess?: () => void;
}

export interface UpdateInjuryMasterParams {
  id: string;
  data: CreateInjuryMasterParams;
  handleSuccess?: () => void;
}

export interface InjuryMasterDetailResponse {
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
