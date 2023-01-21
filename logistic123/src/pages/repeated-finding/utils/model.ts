import {
  ErrorField,
  CommonApiParam,
  CommonErrorResponse,
} from 'models/common.model';

export interface Company {
  id: string;
  name: string;
}
export interface RepeateFindingCalculation {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  timesOfRepeating: number;
  coEfficient: number;
  description: string;
  status: string;
  companyId: string;
  createdUserId: string;
  updatedUserId: string;
  createdUser: { username: string };
  updatedUser: { username: string };
  company: Company;
  isNew?: boolean;
  resetForm?: () => void;
}

export interface GetRepeateFindingCalculationResponse {
  data: RepeateFindingCalculation[];
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
export interface GetRepeateFindingCalculationParams {
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

export interface CreateRepeateFindingCalculationParams {
  timesOfRepeating: number;
  coEfficient: number;
  description: string;
  status: string;
  afterCreate?: () => void;
}

export interface UpdateRepeateFindingCalculationParams {
  id: string;
  data: CreateRepeateFindingCalculationParams;
  afterUpdate?: () => void;
}

export interface RepeateFindingCalculationDetailResponse {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  timesOfRepeating: number;
  coEfficient: number;
  description: string;
  status: string;
  companyId: string;
  createdUserId: string;
  updatedUserId: string;
  createdUser: string;
  updatedUser: string;
}

export interface ErrorResponsive {
  errorList: ErrorField[];
}

export interface RepeateFindingCalculationStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  isExistField: CheckExitResponse;
  listRepeateFindingCalculation: GetRepeateFindingCalculationResponse;
  RepeateFindingCalculationDetail: RepeateFindingCalculationDetailResponse;
  errorList: CommonErrorResponse;
}
