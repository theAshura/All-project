import { ErrorField, CompanyObject } from 'models/common.model';

export interface IssueNote {
  id: string;
  name: string;
  code: string;
  status: string;
  modules?: string[];
  description?: string;
  createdAt?: Date;
  createdBy?: string;
  createdName?: string;
  updatedAt?: Date;
  createdUser?: {
    username?: string;
  };
  updatedUser?: {
    username?: string;
  };
  updatedBy?: string;
  company?: CompanyObject;
  updatedName?: string;
  isNew?: boolean;

  resetForm?: () => void;
  afterCreate?: () => void;
}

export interface GetIssueNotesResponse {
  data: IssueNote[];
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
  sort?: string;
}
export interface GetIssueNotesParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  getList?: () => void;
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

export interface CreateIssueNoteParams {
  name: string;
  code: string;
  modules: string[];
  status: string;
}

export interface UpdateIssueNoteParams {
  id: string;
  data: CreateIssueNoteParams;
  afterUpdate?: () => void;
}

export interface IssueNoteDetailResponse {
  id: string;
  code: string;
  name: string;
  modules: string[];
  status: string;
  description?: string;
  deleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ErrorResponsive {
  errorList: ErrorField[];
}
