import { AvatarType, ErrorField, UserAssignments } from 'models/common.model';
import { Department } from '../planning-and-request/planning-and-request.model';
import { VesselCharterers, VesselOwners } from '../vessel/vessel.model';

export enum Scope {
  internal = 'internal',
  external = 'external',
}

export enum Status {
  active = 'active',
  inactive = 'inactive',
}

export enum Name {
  AuditType2 = 'Audit type2',
  NonConformity = 'Non Conformity',
  Observation = 'Observation',
}

interface PlanningRequest {
  refId: string;
  auditNo: string;
  auditTimeTable: {
    actualFrom: string;
    actualTo: string;
  };
  vessel: {
    name: string;
    countryFlag: string;
    vesselType: {
      name: string;
    };
    fleet: {
      name: string;
    };
  };
  leadAuditor: {
    username: string;
  };
}

interface ReportFindingForm {
  totalFindings: number;
  totalNonConformity: number;
  totalObservation: number;
  planningRequest: PlanningRequest;
}

export interface InternalAuditReport {
  companyId: string;
  createdAt: string;
  createdUserId: string;
  id: string;
  refId: string;
  reportFindingForm: ReportFindingForm;
  totalFindings: number;
  totalNonConformity: number;
  totalObservation: number;
  reportFindingFormId: string;
  serialNumber: string;
  status: string;
  updatedAt: string;
  updatedUserId: string;
  workflowRemarks: string;
}

export interface internalAuditReportHistories {
  id: string;
  createdAt: Date;
  remark: string;
  status: string;
}

export interface Fleet {
  name: string;
}

export interface VesselType {
  name: string;
}

export interface Vessel {
  name: string;
  countryFlag: string;
  fleet: Fleet;
  vesselType: VesselType;
}

export interface InternalAuditReportListRecord {
  internalAuditReport_id: string;
  internalAuditReport_createdAt: Date | string;
  internalAuditReport_updatedAt: Date | string;
  internalAuditReport_refId: string;
  internalAuditReport_serialNumber: string;
  internalAuditReport_status: string;
  internalAuditReport_reportTemplateId: string;
  internalAuditReport_workflowRemarks: string | null;
  internalAuditReport_previousStatus: string;
  internalAuditReport_reportFindingFormId: string;
  internalAuditReport_attachments: any[] | null;
  internalAuditReport_leadAuditorId: string;
  internalAuditReport_createdUserId: string;
  internalAuditReport_updatedUserId: string | null;
  internalAuditReport_companyId: string;
  internalAuditReport_vesselId: string;
  internalAuditReport_planningRequestId: string;
  internalAuditReportHistories: internalAuditReportHistories[];
  internalAuditReport_entityType?: string;
  planningRequest_globalStatus?: string;
  auditCompanyName?: string;
  departments?: Department[];
  refId: string;
  serialNumber: string;
  id: string;
  vessel: Vessel;
  prAuditNo: string;
  prRefId: string;
  fleetName: string;
  vesselName: string;
  vesselTypeName: string;
  vesselCountryFlag: string;
  countryFlag: string;
  leadAuditorName: string;
  totalFindings: number;
  totalNonConformity: number;
  totalObservation: number;
  totalOpenNC: string;
  totalCloseNC: string;
  company_name?: string;
  totalOpenOBS: string;
  totalCloseOBS: string;
  actualFrom: Date | string | null;
  picIdList?: string[];
  actualTo: Date | string | null;
  globalStatus?: string;
  company_id?: string;
  iarPlanningRequest?: {
    vesselId?: string;
    vesselName?: string;
  };
  userAssignments: UserAssignments[];
  vesselCharterers?: VesselCharterers;
  vesselDocHolders?: VesselCharterers;
  vesselOwners?: VesselOwners;
}
export interface IarAuditType {
  auditTypeId: string;
  auditTypeName: string;
  id: string;
  internalAuditReportId: string;
}

export interface PreviousInternalAuditReport {
  internalAuditReport_id: string;
  internalAuditReport_createdAt: Date | string;
  internalAuditReport_updatedAt: Date | string;
  internalAuditReport_background: null | string;
  internalAuditReport_refId: string;
  internalAuditReport_serialNumber: string;
  internalAuditReport_status: string;
  internalAuditReport_verificationStatus: string;
  internalAuditReport_verificationDate: Date | string;
  internalAuditReport_reportTemplateId: string;
  internalAuditReport_workflowRemarks: null | string;
  internalAuditReport_previousStatus: string;
  internalAuditReport_reportFindingFormId: string;
  internalAuditReport_attachments: string[];
  internalAuditReport_leadAuditorId: string;
  internalAuditReport_createdUserId: string;
  internalAuditReport_updatedUserId: string;
  internalAuditReport_companyId: string;
  internalAuditReport_vesselId: string;
  internalAuditReport_planningRequestId: string;
  iarAuditTypes_auditTypeName?: string;
  prAuditNo: string;
  auditTypeId: string;
  auditTypeName: string;
  actualFrom: Date | string;
  actualTo: Date | string;
}

export interface Observation {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  reportFindingFormId?: string;
  auditWorkspaceId?: string;
  auditChecklistId?: string;
  chkQuestionId?: string;
  auditTypeId?: string;
  natureFindingId?: string;
  findingRemark?: string;
  findingComment?: string;
  reference?: any;
  isSignificant?: boolean;
  mainCategoryId?: string;
  secondCategoryId?: string;
  thirdCategoryId?: string;
  viqId?: any;
  departmentId?: any;
  isVerify?: any;
  isOpen?: any;
  remark?: any;
  plannedCompletionDate?: any;
  actualCompletionDate?: any;
  immediateAction?: any;
  preventiveAction?: any;
  correctiveAction?: any;
  findingAttachments?: any[];
  createdUserId?: string;
  updatedUserId?: any;
  auditType?: {
    name?: Name;
  };
  natureFinding?: {
    name?: Name;
  };
}

export interface CreatedUser {
  id: string;
  username: string;
  jobTitle?: string;
}

export interface IARHistory {
  createdAt: string;
  createdUser: CreatedUser;
  createdUserId: string;
  id: string;
  internalAuditReportId: string;
  status: string;
  updatedAt: string;
  remark: string;
}

export interface InternalAuditReportComment {
  id: string;
  createdAt: string;
  updatedAt: string;
  internalAuditReportId: string;
  executiveSummary: string;
  statusLastAuditFinding: string;
  hullAndDeck: string;
  navigation: string;
  machineryAndTechnical: string;
  cargoAndBallast: string;
  crewManagement: string;
  pollutionPrevention: string;
  safetyCulture: string;
  other: string;
  createdUserId: string;
  updatedUserId: string;
}

export interface InternalAuditReportOfficeComment {
  id: string;
  createdAt: string;
  updatedAt: string;
  internalAuditReportId: string;
  comment: string;
  createdUserId: string;
  createdUser?: {
    username?: string;
    jobTitle?: string;
  };
}

export interface IarUser {
  id: string;
  internalAuditReportId: string;
  relationship: string;
  userId: string;
  username: string;
}

export interface NonConformity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  natureFindingName?: string;
  auditTypeName?: string;
  reportFindingFormId: string;
  internalAuditReportId: string;
  auditWorkspaceId: string;
  auditChecklistId: string;
  chkQuestionId: string;
  auditTypeId: string;
  natureFindingId: string;
  findingRemark: string;
  findingComment: string;
  findingStatus: string;
  reference: string;
  isSignificant: boolean;
  rectifiedOnBoard?: boolean;
  mainCategoryId: string;
  secondCategoryId: string;
  thirdCategoryId: string;
  viqId: string;
  departmentId: string;
  isVerify: boolean;
  isOpen: boolean;
  remark: string;
  planedCompletionDate: string;
  actualCompletionDate: string;
  immediateAction: string;
  preventiveAction: string;
  correctiveAction: string;
  findingAttachments: any[];
  createdUserId: string;
  updatedUserId: string;
  auditType: { name: string };
  natureFinding: { name: string };
  refNo: string;
  sNo: string;
  planningRequestId: string;
  vesselId: string;
  attachments: any[];
  checklistAttachments: any[];
  officeComment: string;
  picId: string | null;
  picRemark: string | null;
  status: string;
  totalFindings: number;
  totalNonConformity: number;
  totalObservation: number;
  companyId: string;
  departmentName: string;
  mainCategoryName: string;
  secondCategoryName: string;
  picUsername: string;
  chkQuestion?: {
    id?: string;
    referencesCategoryData: any;
  };
  planningRequest: {
    id: string;
    refId: string;
    status: string;
  };
  workflowStatus: string;
}

export interface ReportHeader {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  serialNumber: string;
  topic: string;
  topicType: string;
  minScore: number;
  maxScore: number;
  companyId: string;
  reportTemplateId: string;
  createdUserId: string;
  updatedUserId: string;
  parentId: string;
  numChildren: number;
  numDependents: number;
}

export interface IARReportHeaderDescriptions {
  id: string;
  topic: string;
  score: number;
  description: string;
}

export interface IARReportHeaders {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  internalAuditReportId: string;
  reportHeaderId: string;
  headerComment: string;
  createdUserId: string;
  IARReportHeaderDescriptions: IARReportHeaderDescriptions[];
  reportHeader: ReportHeader;
  topic: string;
  serialNumber: string;
  parentId: string;
  maxScore: number;
  parentTopic?: string;
  type?: string;
  minScore: number;
  auditTypes?: string[];
}

interface AuditTimeTablePlanning {
  actualFrom: string;
  actualTo: string;
}
export interface ReportFindingFormPlanningRequest {
  id: string;
  refId: string;
  typeOfAudit: string;
  status: string;
  auditTimeTable?: AuditTimeTablePlanning;
  globalStatus?: string;
}
export interface IReportFindingForm {
  id: string;
  refNo: string;
  planningRequestId: string;
  status: string;
  totalFindings: number;
  totalNonConformity: number;
  totalObservation: number;
  planningRequest: ReportFindingFormPlanningRequest;
}
export interface IarPlanningRequest {
  countryFlag: string;
  fleetId: string;
  fleetName: string;
  fromPortId: string;
  fromPortName: string;
  internalAuditReportId: string;
  planningRequestId: string;
  toPortId: string;
  toPortName: string;
  vesselId: string;
  vesselName: string;
  vesselTypeId: string;
  vesselTypeName: string;
  auditCompanyName?: string;
  departments?: Department[];
}

export type InternalAuditReportDetailResponse = Pick<
  InternalAuditReport,
  | 'companyId'
  | 'createdAt'
  | 'createdUserId'
  | 'id'
  | 'reportFindingFormId'
  | 'serialNumber'
  | 'status'
  | 'updatedAt'
  | 'updatedUserId'
  | 'refId'
> & {
  avatar?: AvatarType;
  IARReportHeaders: IARReportHeaders[];
  vessel: {
    id: string;
    name: string;
  };
  globalStatus?: string;
  departmentId?: string;
  vesselId: string | null;
  leadAuditorId: string | null;
  attachments: string[];
  internalAuditReportComment: InternalAuditReportComment;
  internalAuditReportOfficeComments: InternalAuditReportOfficeComment[];
  internalAuditReportHistories: IARHistory[];
  lastAuditFindings: any[];
  planningRequestId: string;
  nonConformities: {
    data: NonConformity[];
    page: number;
    pageSize: number;
    totalPage: number;
    totalItem: number;
  };
  observations: {
    data: NonConformity[];
    page: number;
    pageSize: number;
    totalPage: number;
    totalItem: number;
  };
  reportFindingForm: IReportFindingForm;
  previousStatus?: string;
  workflowRemarks: any;
  background: string;
  iarPlanningRequest: IarPlanningRequest;
  iarAuditTypes?: IarAuditType[];
  iarUsers?: IarUser[];
  entityType?: string;
  department?: {
    name?: string;
  };
  company?: {
    name?: string;
  };
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
  vesselCharterers?: VesselCharterers[];
  vesselOwners?: VesselOwners[];
  vesselDocHolders?: VesselOwners[];
};

export interface GetInternalAuditReportsResponse {
  data: InternalAuditReportListRecord[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface StaticFindingItems {
  id: string;
  natureFindingId: string;
  totalPrimary: number;
  totalOpenPrimary: number;
  totalClosePrimary: number;
  totalNonPrimary: number;
  totalOpenNonPrimary: number;
  totalCloseNonPrimary: number;
  auditTypeId?: string;
  inspectionDate?: string;
  prid?: string;
  auditType?: string;
  type?: string;
  statisticItemsId?: string;
  statisticItemsRemark?: string;
  targetDate?: string;
  totalCloseItems?: string;
  totalItems?: string;
  totalOpenItems?: string;
}
export interface StaticFindingItemManual {
  id: string;
  createdAt: string;
  updatedAt: string;
  inspectionDate: string;
  auditTypeId: string;
  internalAuditReportId: string;
  remark: string;
  totalFinding: string;
  openFinding: string;
  closeFinding: string;
  type: string;
  auditType: {
    id: string;
    name: string;
  };
}

export interface FindingItemsOfIAR {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  reportFindingFormId: null | string;
  internalAuditReportId: string;
  auditWorkspaceId: null | string;
  auditChecklistId: null | string;
  chkQuestionId: null | string;
  auditTypeId: string;
  natureFindingId: string;
  isPrimaryFinding: boolean;
  findingRemark: null | string;
  locationId: null | string;
  findingComment: string;
  reference: null | string;
  isSignificant: boolean;
  isSyncToIAR: boolean;
  mainCategoryId: string;
  secondCategoryId: string;
  thirdCategoryId: null | string;
  viqId: null | string;
  departmentId: null | string;
  isVerify: boolean;
  isOpen: boolean;
  picId: null | string;
  verifiedInPRId: null | string;
  verifiedDate: null | string;
  verifiedUserId: null | string;
  picRemark: null | string;
  findingStatus: string;
  workflowStatus: string;
  remark: null | string;
  companyId: string;
  planedCompletionDate: null | Date | string;
  actualCompletionDate: null | Date | string;
  immediateAction: null | string;
  preventiveAction: null | string;
  correctiveAction: null | string;
  findingAttachments: string[];
  createdUserId: string;
  updatedUserId: string;
  natureFinding: { name: string };
  verifiedUser: { id: string; username: string };
}

export interface getListFindingItemsOfIARResponse {
  data: FindingItemsOfIAR[];
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

export interface CreateInternalAuditReportParams {
  name: string;
  code: string;
  scope: string;
}

export interface UpdateInternalAuditReportParams {
  id: string;
  isSubmitted?: boolean;
  isReviewed?: boolean;
  isReassigned?: boolean;
  isApproved?: boolean;
  isCloseout?: boolean;
  data?: any;
}

export interface FindingItem {
  isSignificant: string;
  picId: string;
  workflowStatus: string;
  picRemark: string;
  departmentId: string;
  viqId: string;
  planedCompletionDate: string | Date;
  findingAttachments: string[];
  remark: string;
  immediateAction: string;
  preventiveAction: string;
  correctiveAction: string;
}

export interface AssignPICInternalAuditReportParams {
  id: string;
  findingItemId: string;
  data: FindingItem;
}

export type EditFindingItemParams = Omit<
  AssignPICInternalAuditReportParams,
  'data'
> & {
  data: Omit<FindingItem, 'picId' | 'workflowStatus'> & {
    findingStatus: string;
  };
};

export type ReviewFindingItemParams = Omit<
  AssignPICInternalAuditReportParams,
  'data'
> & {
  data: Pick<FindingItem, 'workflowStatus'>;
};

export interface ErrorResponse {
  errorList: ErrorField[];
}

export interface OfficeComment {
  comment: string;
  reviewer: {
    name: string;
    rank: string;
    createdAt: Date;
  };
}

export type AdditionalReviewerSection = IARHistory;

// Scheduler and report of findings status

export interface SchedulerROFStatus {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  refNo: string;
  sNo: string;
  planningRequestId: string;
  vesselId: string;
  attachments: any[];
  checklistAttachments: any[];
  officeComment: string;
  status: string;
  previousState: string;
  totalFindings: number;
  totalNonConformity: number;
  totalObservation: number;
  companyId: string;
  createdUserId: string;
  updatedUserId: string;
  planningRequest: {
    id: string;
    refId: string;
    status: string;
  };
}

export interface GetSchedulerROFStatusResponse {
  data: SchedulerROFStatus[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface SchedulerROFStatusParams {
  vesselId: string;
  internalAuditReport: boolean;
}

export interface FindingItemParams {
  natureFinding: string;
  id: string;
}
