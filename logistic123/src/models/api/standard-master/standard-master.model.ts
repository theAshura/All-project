import { ErrorField, UserAssignments } from 'models/common.model';

export interface Company {
  name: string;
}

export interface ByUser {
  username: string;
}

export interface ComplianceAnswer {
  id?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  standardMasterId?: string;
  answer: string;
  compliance: number;
  colour?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Others {}

export interface SelfAssessment {
  id: string;
  createdAt: string;
  updatedAt: string;
  type: string;
  selfAssessmentStatus: string;
  lastExternalSubmission: string;
  submittedTo: string;
  sNo: string;
  status: string;
  attachments: string[];
  closeOpenReviewPrep: boolean;
  inspectionTypeId: string;
  authorityId: string;
  standardMasterId: string;
  companyId: string;
  createdUserId: string;
  updatedUserId: string;
  createdUser: {
    username: string;
  };
  userAssignments: UserAssignments[];
}

export interface StandardMaster {
  id: string;
  code: string;
  name: string;
  status: string;
  companyId: string;
  fieldName: string;
  scoreApplicable: boolean;
  levels: string[];
  createdUserId: string;
  updatedUserId: string;
  createdUser: ByUser;
  updatedUser: ByUser;
  complianceAnswers: ComplianceAnswer[];
  selfAssessments?: SelfAssessment[];
  others: Others;
  isNew?: boolean;
  handleSuccess?: () => void;
}

export interface GetStandardMastersResponse {
  data: StandardMaster[];
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
export interface GetStandardMastersParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  getList?: () => void;
}

export interface CreateStandardMasterParams {
  code: string;
  name: string;
  fieldName: string;
  scoreApplicable: boolean;
  levels: string[];
  complianceAnswers: ComplianceAnswer[];
  others: Others;
  handleSuccess?: () => void;
}

export interface UpdateStandardMasterParams {
  id: string;
  data: CreateStandardMasterParams;
  resetForm?: () => void;
  handleSuccess?: () => void;
}

export interface StandardMasterDetailResponse {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  code: string;
  name: string;
  status: string;
  companyId: string;
  fieldName: string;
  scoreApplicable: boolean;

  others: Others;
  levels: string[];
  createdUserId: string;
  updatedUserId: string;
  company: Company;
  complianceAnswers: ComplianceAnswer[];
}

export interface ErrorResponsive {
  errorList: ErrorField[];
}
