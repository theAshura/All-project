import { CompanyObject, UserAssignments } from 'models/common.model';
import { Vessel } from 'models/api/vessel/vessel.model';
import {
  Department,
  PlanningAndRequest,
} from '../planning-and-request/planning-and-request.model';
import { AuditType } from '../audit-type/audit-type.model';
import { Port } from '../port/port.model';
import { User } from '../user/user.model';

export interface AdditionalReviewer {
  serialNumber?: string;
  rankId?: string;
  reviewerId?: string;
  targetDate?: Date;
  status?: string;
  comment?: string;
  name?: string;
}

// export interface ReportFindingHistory {
//   id: string;
//   createdAt: Date;
//   updatedAt: Date;
//   reportFindingFormId: string;
//   officeComment: string;
//   workflowRemark: string;
//   status: string;
//   createdUserId: string;
//   createdUser: {
//     username: string;
//     jobTitle?: string;
//     rank: {
//       name: string;
//     };
//   };
// }

export interface CreatedUser {
  id?: string;
  username?: string;
  jobTitle?: string;
}

export interface RofAuditType {
  id?: string;
  reportFindingFormId?: string;
  auditTypeId?: string;
  auditTypeName?: string;
}

export interface RofPlanningRequest {
  reportFindingFormId?: string;
  planningRequestId?: string;
  vesselId?: string;
  vesselName?: string;
  countryFlag?: string;
  vesselTypeId?: string;
  vesselTypeName?: string;
  fleetId?: string;
  fleetName?: string;
  fromPortId?: string;
  fromPortName?: string;
  toPortId?: string;
  toPortName?: string;
  auditCompanyName?: string;
  departments?: Department[];
}

export interface RofUser {
  id?: string;
  reportFindingFormId?: string;
  userId?: string;
  username?: string;
  relationship?: string;
}

export interface ReportFindingHistory {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  reportFindingFormId: string;
  officeComment: string;
  workflowRemark: string;
  status: string;
  createdUserId: string;
  createdUser: {
    username: string;
    jobTitle?: string;
    rank: {
      name: string;
    };
  };
}

export interface ReportFindingHistoryList {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  reportFindingFormId?: string;
  officeComment?: null | string;
  workflowRemark?: null | string;
  status?: string;
  createdUser?: CreatedUser;
}
export interface PlanningRequest2 {
  id?: string;
  refId?: string;
  auditNo?: string;
  globalStatus?: string;
  vessel?: Vessel;
}

export interface RofOfficeComments {
  comment: string;
  createdAt: string;
  createdUser: { id: string; username: string; jobTitle: string };
  id: string;
  reportFindingFormId: string;
  serialNumber: string;
}

export interface ReportOfFinding {
  id?: string;
  refId?: string;
  refNo?: string;
  auditRefId?: string;
  companyName?: string;
  companyId?: string;
  vesselId?: string;
  timezone?: string;
  totalFindings?: number;
  checklistAttachments?: string[];
  totalNonConformity?: number;
  totalObservation?: number;
  sNo?: number;
  createdUserId?: string;
  typeOfAudit?: string;
  departmentId?: string;
  fromPortId?: string;
  reportFindingItems?: any[];
  toPortId?: string;
  toPortEstimatedTimeArrival?: Date;
  planningRequest?: PlanningAndRequest;
  toPortEstimatedTimeDeparture?: Date;
  fromPortEstimatedTimeArrival?: Date;
  reviewInProgress?: boolean;
  fromPortEstimatedTimeDeparture?: Date;
  plannedFromDate?: Date;
  plannedToDate?: Date;
  auditTypeIds?: string[];
  memo?: string;
  attachments?: string[];
  auditorIds?: string[];
  leadAuditorId?: string;
  planningRequestId?: string;
  officeComments?: {
    serialNumber?: string;
    comment?: string;
  }[];
  additionalReviewers?: AdditionalReviewer[];
  auditTypes?: AuditType[];
  auditors?: User[];
  reportFindingHistories?: ReportFindingHistory[];
  dateOfLastAudit?: Date;
  departmentCode?: string;
  dueDate?: Date;
  fromPort?: Port;
  toPort?: Port;
  leadAuditor?: User;
  status?: string;
  globalStatus?: string;
  createdUser?: {
    username: string;
  };
  createdAt?: Date;
  updatedUser?: {
    username: string;
  };
  updatedAt?: Date;
  vessel?: Vessel;
  auditNo?: string;
  shoreStatus?: string;
  shoreActionBy?: string;
  shoreRank?: string;
  shoreDate?: Date;
  shipStatus?: string;
  shipActionBy?: string;
  shipRank?: string;
  shipDate?: Date;
  vesselTypeId?: string;
  fleetId?: string;
  isSubmit?: boolean;
  isReschedule?: string;
  rofPlanningRequest?: RofPlanningRequest;
  rofUsers?: RofUser[];
  rofAuditTypes?: RofAuditType[];
  rofOfficeComments?: RofOfficeComments[];
  entityType?: string;
  company?: CompanyObject;
  userAssignments?: UserAssignments[];
  userAssignment?: {
    planningRequestId?: string;
    auditChecklistId?: string;
    reportFindingFormId?: string;
    internalAuditReportId?: string;
    selfAssessmentId?: string;
    usersPermissions?: {
      permission?: string;
      userIds?: string[];
    }[];
  };
  createdAtOrigin?: string;
}

export interface ReportOfFindingList {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  refNo?: string;
  sNo?: string;
  planningRequestId?: string;
  vesselId?: string;
  attachments?: any[];
  checklistAttachments?: any[];
  officeComment?: string;
  status?: string;
  globalStatus?: string;
  totalFindings?: number;
  totalNonConformity?: number;
  totalObservation?: number;
  leadAuditorId?: string;
  companyId?: string;
  createdUserId?: string;
  updatedUserId?: string;
  planningRequest?: PlanningRequest2;
  reportFindingHistories?: ReportFindingHistoryList[];
  rofPlanningRequest?: RofPlanningRequest;
  rofAuditTypes?: RofAuditType[];
  rofUsers?: RofUser[];
  company?: CompanyObject;
  entityType?: string;
  reviewInProgress?: boolean;
  vessel?: Vessel;
  auditCompany?: {
    name: string;
  };
  department?: {
    name: string;
  };
  workingType?: string;
  userAssignments?: any;
}

export interface ReportFindingItem {
  id: string;
  natureFindingId: string;
  auditTypeId: string;
  isSignificant: boolean;
  findingRemark: string;
  findingComment: string;
  reference: string;
  mainCategoryId: string;
  secondCategoryId: string;
  departmentId: string;
  viqId: string;
  findingAttachments: string[];
  createdAt: Date;
  updatedAt: Date;
  auditWorkspaceId: string;
  auditChecklistId: string;
  chkQuestionId: string;
  thirdCategoryId: string;
  isOpen: boolean;
  createdUserId: string;
  auditType: AuditType;
  natureFinding: AuditType;
}

export interface ReportOfFindingItemsResponse {
  id?: string;
  natureFindingId: string;
  auditTypeId: string;
  isSignificant: boolean;
  findingRemark: string;
  findingComment: string;
  reference: string;
  mainCategoryId: string;
  secondCategoryId: string;
  departmentId: string;
  viqId?: string;
  locationId: string;
  findingAttachments: string[];
}
export interface ReportOfFindingItems {
  id?: string;
  natureFindingId: string;
  auditTypeId: string;
  isSignificant: boolean;
  rectifiedOnBoard?: boolean;
  carId?: string;
  natureFindingName?: string;
  findingRemark: string;
  findingComment: string;
  reference: string;
  chkQuestionId?: string;
  chkQuestion?: {
    id: string;
    referencesCategoryData: {
      valueId: string;
    }[];
  };
  mainCategoryId?: string;
  secondCategoryId: string;
  departmentId: string;
  isSyncToIAR?: boolean;
  viqId?: string;
  locationId: string;
  attachments: string[];
  findingAttachments: string[];
}

export interface PreviousNCFinding {
  id: string;
  natureFindingId: string;
  auditTypeId: string;
  isSignificant: boolean;
  findingRemark: string;
  findingComment: string;
  reference: string;
  mainCategoryId: string;
  secondCategoryId: string;
  departmentId: string;
  viqId: string;
  findingAttachments: string[];
}

export interface CreateReportOfFindingItems {
  id?: string;
  natureFindingId: string;
  auditTypeId: string;
  isSignificant: boolean;
  findingRemark: string;
  findingComment: string;
  reference: string;
  mainCategoryId: string;
  secondCategoryId: string;
  departmentId: string;
  viqId: string;
  findingAttachments: string[];
}
export interface UpdateReportFindingItems {
  id?: string;
  natureFindingId: string;
  auditTypeId: string;
  isSignificant: boolean;
  findingRemark: string;
  findingComment: string;
  reference: string;
  mainCategoryId: string;
  secondCategoryId: string;
  departmentId: string;
  viqId: string;
  findingAttachments: string[];
}
export interface CreatePreviousNCFindings {
  id: string;
  isVerify: boolean;
  isOpen: boolean;
}
export interface UpdatePreviousNCFindings {
  id: string;
  isVerify: boolean;
  isOpen: boolean;
}

export interface ReportOfFindingParams {
  planningRequestId?: string;
  timezone: string;
  checklistAttachments?: string[];
  reportFindingItems: CreateReportOfFindingItems[];
  previousNCFindings: CreatePreviousNCFindings[];
  officeComment: string;
  workflowRemark: string;
  isSubmit: boolean;
}
export interface CreateReportOfFindingParams {
  planningRequestId: string;
  attachments: string[];
  timezone: string;
  checklistAttachments: string[];
  reportFindingItems: CreateReportOfFindingItems[];
  previousNCFindings: CreatePreviousNCFindings[];
  officeComment: string;
  workflowRemark?: string;
  isSubmit: boolean;
}
export interface UpdateReportOfFindingBody {
  timezone: string;
  checklistAttachments?: string[];
  reportFindingItems: UpdateReportFindingItems[];
  previousNCFindings: UpdatePreviousNCFindings[];
  officeComments: { id?: string; serialNumber?: string; comment?: string }[];
  attachments: string[];
  workflowRemark?: string;
  isSubmit: boolean;
}
export interface UpdateReportOfFinding {
  planningRequestId: string;
  timezone: string;
  checklistAttachments: string[];
  reportFindingItems: CreateReportOfFindingItems[];
  previousNCFindings: CreatePreviousNCFindings[];
  officeComment: string;
  workflowRemark: string;
  isSubmit: boolean;
}
export interface ListReportOfFindingResponse {
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
  data: Array<ReportOfFindingList>;
}
export interface UpdateReportOfFindingParams {
  id: string;
  body: UpdateReportOfFindingBody;
}
export interface ReportOfFindingStatusParams {
  status?: string;
  workflowRemark?: string;
  timezone?: string;
  userAssignment?: {
    planningRequestId?: string;
    auditChecklistId?: string;
    reportFindingFormId?: string;
    internalAuditReportId?: string;
    selfAssessmentId?: string;
    usersPermissions?: {
      permission?: string;
      userIds?: string[];
    }[];
  };
}
export interface UpdateReportOfFindingStatusParams {
  id?: string;
  body: ReportOfFindingStatusParams;
}

export interface FindingItemPrevious {
  id: string;
  reportFindingForm: {
    id: string;
    planningRequest: {
      auditNo: string;
      auditTimeTable?: {
        actualFrom?: string;
        actualTo?: string;
        timezone?: string;
      };
      refId?: string;
    };
  };
  auditType?: {
    name?: string;
  };
  auditChecklist: {
    code: string;
    name: string;
  };
  findingComment: string;
  findingRemark: string;
  isVerify: boolean;
  isOpen: boolean;
}

export interface AuditTimeTable {
  actualFrom: Date;
  actualTo: Date;
  timezone: string;
}

export interface PlanningRequest {
  refId: string;
  auditNo: string;
  auditTimeTable: AuditTimeTable;
}

export interface InternalAuditReport {
  id: string;
  planningRequest: PlanningRequest;
}

// NC previous open
export interface NCPreviousOpen {
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
  locationId: string;
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
  natureFinding: {
    name: string;
  };
  auditType: {
    name: string;
  };
  auditTypeName?: string;
  internalAuditReport: InternalAuditReport;
  auditChecklist: any;
}
export interface GetNCPreviousOpen {
  data: NCPreviousOpen[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface OpenNCItem {
  id: string;
  isOpen: boolean;
  isVerify: boolean;
}
export interface UpdateNCPreviousOpen {
  openNCItems: OpenNCItem[];
  planningRequestId: string;
  currentROFId: string;
}
