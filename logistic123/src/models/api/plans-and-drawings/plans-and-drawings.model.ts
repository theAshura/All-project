import { ErrorField } from 'models/common.model';

export interface ByUser {
  username: string;
}

export interface RemarkType {
  id?: string;
  remark: string;
}

export interface Company {
  name: string;
}

export interface TypeIncidents {
  id?: string;
  code?: string;
  name?: string;
}

export interface Comment {
  id?: string;
  comment?: string;
  createdAt?: string;
  createdUser?: ByUser;
  updatedAt?: Date | string;
  updatedUser?: ByUser;
}

export interface PlanDingDrawingComments {
  id: string;
  comment: string;
  createdUser: {
    id: string;
    username: string;
    email: string;
    jobTitle: string;
  };
  plansDrawingsId: string;
  updatedAt: string;
  updatedUser: any;
}

export interface PlansDrawings {
  id: string;
  PDComments: PlanDingDrawingComments[];
  attachments: string[];
  remarks: string;
  updatedAt?: Date | string;
  updatedUser?: ByUser;
}

export interface PlansAndDrawing {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  code: string;
  name: string;
  plansDrawings: PlansDrawings[];
  status: string;
  remarks?: string;
  attachments?: string[];
  createdUserId: string;
  updatedUserId: string;
  createdUser: ByUser;
  updatedUser: ByUser;
  handleSuccess?: () => void;
}

export interface GetPlansAndDrawingsResponse {
  countPending: string | number;
  data: PlansAndDrawing[];
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
export interface GetPlansAndDrawingsParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  handleSuccess?: () => void;
}

export interface CreatePlansAndDrawingParams {
  vesselId: string;
  plansDrawingsMasterId: string;
  remarks?: string;
  comments?: Comment[];
  attachments: string[];
  handleSuccess?: () => void;
}

export interface UpdatePlansAndDrawingParams {
  id: string;
  data: CreatePlansAndDrawingParams;
  resetForm?: () => void;
  handleSuccess?: () => void;
}

export interface PlansAndDrawingDetailResponse {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  code: string;
  name: string;
  remarks?: string;
  PDComments: PlanDingDrawingComments[];
  plansDrawingsMaster: {
    id: string;
    code: string;
    name: string;
  };
  attachments?: string[];
  createdUserId: string;
  updatedUserId: string;
  createdUser: ByUser;
  updatedUser: ByUser;
  handleSuccess?: () => void;
  refId?: string;
}

export interface PlansAndDrawingsDetailParams {
  id: string;
  vesselId: string;
}

export interface ErrorResponsive {
  errorList: ErrorField[];
}
