export const Status = {
  active: 'active',
  inactive: 'inactive',
};

export const StandardType = {
  element: '1',
  noElement: '-1',
};

export interface User {
  username: string;
}
export interface Company {
  name: string;
  code: string;
}
export interface ComplianceAnswer {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  standardMasterId: string;
  answer: string;
  compliance: string | number;
  colour: string;
}
export interface StandardMasterElements {
  standardMasterId: string;
  lastUpdatedById: string;
  lastUpdatedOn: string;
  status: string;
  lastUpdatedBy: User;
}

export interface ElementMasterIds {
  id: string;
}

export interface StandardMaster {
  complianceAnswers: ComplianceAnswer[];
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  code?: string;
  name?: string;
  status?: string;
  companyId?: string;
  company?: Company;
  fieldName?: string;
  scoreApplicable?: boolean;
  others?: null;
  levels?: string[];
  createdUser?: User;
  updatedUser?: any;
  createdUserId?: string;
  updatedUserId?: any;
  complianceAnswer?: ComplianceAnswer[];
  standardMasterElements?: StandardMasterElements;
  elementMasters?: ElementMasterIds[];
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
  status?: string;
  sort?: string;
  type?: string;
}
export interface GetStandardMastersParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  getList?: () => void;
}

export interface CreateElementMasterParams {
  code: string;
  name: string;
  number: string;
  stage: string;
  questionNumber: number;
  elementStageQ: string;
  keyPerformanceIndicator?: string;
  bestPracticeGuidance?: string;
}

export interface UpdateElementMasterParams {
  id: string;
  data: CreateElementMasterParams;
}
export interface SelfDeclarationComments {
  type: string;
  comment: string;
}

export interface ElementMaster {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  code?: string;
  name?: string;
  number?: string;
  status?: string;
  companyId?: string;
  others?: null;
  stage?: string;
  questionNumber?: number;
  elementStageQ?: string;
  keyPerformanceIndicator?: string;
  bestPracticeGuidance?: string;
  standardMasterId?: string;
  createdUserId?: string;
  updatedUserId?: any;
  deleted?: boolean;
  standardMaster?: StandardMaster;
  selfDeclarationComments?: SelfDeclarationComments[];
  isAddItem?: boolean;
  isNew?: boolean;
  resetForm?: () => void;
  afterCreate?: () => void;
}

export interface BulkUpdateElementMasterParams {
  createEleMasters?: CreateElementMasterParams[] | ElementMaster[];
  updateEleMasters?: UpdateElementMasterParams[] | ElementMaster[];
  deleteEleMasterIds?: string[];
  standardId?: string;
  status?: boolean;
}

export interface GetElementMastersResponse {
  data: ElementMaster[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}
export interface CheckExitsElementStageQParams {
  id: string;
  standardMasterId: string;
  elementStageQ: string;
}
