import { ErrorField, CompanyObject } from 'models/common.model';

export enum Status {
  active = 'active',
  inactive = 'inactive',
}

export interface User {
  username: string;
}
export interface InspectorTimeOff {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  offUserId?: string;
  type?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  duration?: number;
  company?: CompanyObject;
  companyId?: string;
  createdUserId?: string;
  updatedUserId?: null;
  offUserUsername?: string;
  offUser?: {
    username?: string;
  };
  createdUser?: {
    username?: string;
  };

  isNew?: boolean;
  resetForm?: () => void;
}

export interface GetInspectorTimeOffsResponse {
  data: InspectorTimeOff[];
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
  sort?: string;
}
export interface GetInspectorTimeOffsParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  getList?: () => void;
}

export interface CreateInspectorTimeOffParams {
  offUserId?: string;
  type?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  duration?: number;
  afterCreate?: () => void;
}

export interface UpdateInspectorTimeOffParams {
  id: string;
  data: CreateInspectorTimeOffParams;
  afterUpdate?: () => void;
}

export interface InspectorTimeOffDetailResponse {
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
