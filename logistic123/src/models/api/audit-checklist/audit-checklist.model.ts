import {
  CommonListParams,
  UserAssignments,
  CompanyObject,
} from 'models/common.model';

export interface UsernameModel {
  username: string;
}

export interface TimeZoneBody {
  timezone: string;
}

export interface MasterData {
  id: string;
  name: string;
  order?: number;
}

export type PriorityRisk = Omit<MasterData, 'name'> & { risk: string };

export interface ReferencesCategoryId {
  id: string;
}

export interface ReferencesQuestion {
  shore_rank?: string;
  criticality?: string;
  vessel_type?: string;
  ship_rank?: string;
  second_category?: string;
  potential_risk?: string;
  location?: string;
  third_category?: string;
  viq?: string;
  charter_owner?: string;
  main_category?: string;
  cdi?: string;
  topic?: string;
  ship_department?: string;
  shore_department?: string;
  department?: string;
}

export interface AnswerOption {
  chkQuestionId: string;
  content: string;
  createdAt: string;
  id: string;
  updatedAt: string;
}

export interface ACQuestion {
  answerOptions: AnswerOption[];
  auditChecklistId: string;
  code: string;
  createdAt: string;
  createdUserId: string;
  hasRemark: string;
  remarkSpecificAnswers: string[];
  hint: string;
  id: string;
  isMandatory: boolean;
  locationId: string;
  mainCategoryId: string;
  requireEvidencePicture: boolean;
  minPictureRequired: number;
  order: number;
  question: string;
  ratingCriteria: string;
  topicId: string;
  type: string;
  updatedAt: string;
  updatedUserId: string;
}

export interface AuditCheckList {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  code?: string;
  appType?: string;
  chkType?: string;
  name: string;
  auditEntity?: string;
  revisionNumber: string;
  revisionDate: Date;
  publishedDate: Date;
  validityFrom: Date;
  validityTo: Date;
  timezone: string;
  visitTypes: string[];
  inspectionModule: string;
  status: string;
  companyId: string;
  createdUserId: string;
  updatedUserId: string;
  createdUser: UsernameModel;
  updatedUser: UsernameModel;
  reviewInProgress?: boolean;
  company?: CompanyObject;
  userAssignments?: UserAssignments[];
}
export interface FillAuditCheckList {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  code?: string;
  auditChecklist?: {
    code?: string;
    name?: string;
  };
  auditType?: {
    name: string;
  };
  auditTypeId?: string;
  appType?: string;
  chkType?: string;
  name: string;
  revisionNumber: string;
  revisionDate: Date;
  publishedDate: Date;
  validityFrom: Date;
  validityTo: Date;
  timezone: string;
  visitType: string;
  inspectionModule: string;
  status: string;
  companyId: string;
  createdUserId: string;
  updatedUserId: string;
  createdUser: UsernameModel;
  updatedUser: UsernameModel;
  reviewInProgress?: boolean;
}

export interface User {
  id: string;
  username: string;
  jobTitle: string;
}

export interface StatusHistory {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  auditChecklistId: string;
  status: string;
  remark: string;
  createdUser: User;
  moduleName?: '';
  version?: '';
  serialNumber?: '';
  companyId?: '';
  createdUserId?: '';
}

export type CreateGeneralInfoBody = Pick<
  AuditCheckList,
  | 'code'
  | 'appType'
  | 'chkType'
  | 'name'
  | 'revisionNumber'
  | 'timezone'
  | 'visitTypes'
  | 'inspectionModule'
> & {
  revisionDate: string;
  validityFrom: string;
  validityTo: string;
  referencesCategory: string[];
  auditChecklistTemplateId?: string;
  auditEntity?: string;
};

export interface ReorderBody {
  id: string;
  questions: {
    id: 'string';
    order: number;
  }[];
  reorderBodySucceed?: () => void;
}

export interface UpdateParams {
  id: string;
  body: CreateGeneralInfoBody;
  handleSuccess?: () => void;
}

export type CreateGeneralInfoResponse = Omit<
  AuditCheckList,
  'createdUser' | 'updatedUser'
> & {
  statusHistory?: StatusHistory[];
  referencesCategory: ReferencesCategoryId[];
};

export type GetAuditCheckListDetailResponse = Omit<
  AuditCheckList,
  'createdUser' | 'updatedUser'
> & {
  reviewInProgress: boolean;
  questions: ACQuestion[];
};

export type GetGeneralInfoDetailResponse = Omit<
  AuditCheckList,
  'createdUser' | 'updatedUser'
> & {
  reviewInProgress: boolean;
  referencesCategory: MasterData[];
  statusHistory: StatusHistory[];
};

export interface GetAuditCheckListResponse {
  data: AuditCheckList[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface GetAuditCheckListCode {
  code: string;
  verifySignature: string;
}

export type GetListAuditCheckListParams = CommonListParams & {
  status?: string;
  companyId?: string;
};

export interface AuditChecklist {
  code: string;
}

export interface AuditType {
  name: string;
}
export interface Vessel {
  code: string;
  name: string;
}
export interface PlanningRequest {
  refId: string;
  auditNo: string;
  entityType?: string;
}

export interface InternalAuditReport {
  id: string;
  planningRequest: PlanningRequest;
  vessel: Vessel;
}

// add finding

export interface ROFFromIAR {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  reportFindingFormId: string;
  internalAuditReportId: string;
  auditWorkspaceId: string;
  auditChecklistId: string;
  chkQuestionId: string;
  auditTypeId: string;
  natureFindingId: string;
  isPrimaryFinding: boolean;
  findingRemark: any;
  locationId: any | string;
  findingComment: string;
  reference: any;
  isSignificant: boolean;
  isSyncToIAR: boolean;
  mainCategoryId: string;
  secondCategoryId: string;
  thirdCategoryId: string;
  viqId: string;
  departmentId: string;
  isVerify: boolean;
  isOpen: boolean;
  picId: string;
  picRemark: any;
  findingStatus: string;
  workflowStatus: string;
  remark: any;
  companyId: string;
  planedCompletionDate: Date;
  actualCompletionDate: Date;
  immediateAction: any;
  preventiveAction: any;
  correctiveAction: any;
  findingAttachments: any[];
  createdUserId: string;
  updatedUserId: string;
  auditType: AuditType;
  natureFinding: AuditType;
  auditChecklist: AuditChecklist;
  internalAuditReport: InternalAuditReport;
}

export interface GetROFFromIARResponsive {
  data: ROFFromIAR[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}
