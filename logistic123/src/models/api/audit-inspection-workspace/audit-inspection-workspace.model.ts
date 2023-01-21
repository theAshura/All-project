import { CompanyObject } from 'models/common.model';
import { Vessel } from 'models/api/vessel/vessel.model';
import { AuditChecklist } from '../inspection-mapping/inspection-mapping.model';
import { Department } from '../planning-and-request/planning-and-request.model';

export enum Scope {
  internal = 'internal',
  external = 'external',
}

export enum Status {
  active = 'active',
  inactive = 'inactive',
}

export interface ReportFindingForm {
  id: string;
  refNo?: string;
  sNo?: string;
  internalAuditReport?: {
    serialNumber: string;
    id: string;
    refId: string;
  };
}

export interface PlanningRequest {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  refId: string;
  auditNo: string;
  vesselId: string;
  internalAuditId: string;
  reportFindingForm?: ReportFindingForm;
  typeOfAudit: string;
  fromPortId: string;
  toPortId: string;
  estimatedTimeDeparture: any;
  toPortEstimatedTimeArrival: any;
  toPortEstimatedTimeDeparture: any;
  fromPortEstimatedTimeArrival: any;
  fromPortEstimatedTimeDeparture: any;
  auditRefId: string;
  departmentId?: string;
  departmentCode: any;
  dateOfLastAudit: any;
  dateOfLastInspection?: string;
  dueDate: any;
  estimatedTimeArrival: any;
  timezone: string;
  plannedFromDate: Date;
  plannedToDate: Date;
  leadAuditorId: string;
  extensionReq: any;
  workflowId: string;
  status: string;
  previousStatus: string;
  auditorType: any;
  memo: string;
  auditPlanStatus: any;
  tenant: any;
  subTenant: any;
  globalStatus?: string;
  isSync: any;
  dpaApporoved: any;
  aptRefId: string;
  rofRefId: string;
  rafRefId: string;
  reset: any;
  frominssch: any;
  isReschedule: any;
  attachments: any;
  createdUserId: string;
  updatedUserId: string;
  companyId: string;
  auditors: {
    id: string;
    username: string;
  }[];
  leadAuditor: {
    username: string;
  };
  fromPort: {
    name: string;
  };
  toPort: {
    name: string;
  };
  auditCompany?: {
    name?: string;
    companyTypes: { companyType: string }[];
    companyIMO?: string;
  };
  departments?: Department[];
  workingType?: string;
}

export interface Fleet {
  id: string;
  name: string;
}

export interface CreatedUser {
  username: string;
}

export interface AuditInspectionWorkspace {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  refNo: string;
  auditPlanId: string;
  planningRequestId: string;
  switchStatus: string;
  status: string;
  globalStatus?: string;
  vesselId: string;
  auditors: string[];
  natureFindings: any[];
  companyId: string;
  createdUserId: string;
  updatedUserId: string;
  vessel: Vessel;
  planningRequest: PlanningRequest;
  createdUser: CreatedUser;
  updatedUser: CreatedUser;
  entityType?: string;
  company?: CompanyObject;
  isNew?: boolean;
  resetForm?: () => void;
}

export interface GetAuditInspectionWorkspacesResponse {
  data: AuditInspectionWorkspace[];
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

export interface ByUser {
  username: string;
}
export interface AuditInspectionWorkspaceDetailResponse {
  id: string;
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
  refNo: string;
  auditPlanId: string;
  planningRequestId: string;
  switchStatus: string;
  status: string;
  globalStatus?: string;
  vesselId: string;
  auditors: string[];
  natureFindings: string[];
  companyId: string;
  company?: any;
  createdUserId: string;
  updatedUserId: string;
  vessel: Vessel;
  planningRequest: PlanningRequest;
  createdUser: CreatedUser;
  updatedUser: ByUser;
  serialNo?: string;
  entityType?: string;
  seenUsers?: string[];
  showPopupAnalyticalReport?: boolean;
  master?: string;
  chiefOfEngineer?: string;
}

// export interface MasterInspectionWorkSpaceEdit

export interface AuditInspectionChecklistResponse {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  auditWorkspaceId: string;
  auditChecklistId: string;
  auditType: {
    code: string;
    name: string;
  };
  webInstance: string;
  appInstance: string;
  publishOn: Date;
  submitOn: Date;
  submitById: string;
  lastUpdatedById: string;
  status: string;
  auditTypeId: string;
  auditChecklist: AuditChecklist;
  lastUpdatedBy: ByUser;
  submitBy: ByUser;
  listQuestions: number;
  pendingQuestion: number;
  completedQuestion: number;
  totalOfFinding: number;
}

export interface ChkQuestionSummary {
  id: string;
  question: string;
}

export interface Name {
  name: string;
}

export interface AuditChecklist1 {
  code: string;
  revisionNumber: string;
}

export interface AuditType {
  name: string;
}

export interface ChkQuestion1 {
  id: string;
  question: string;
}

export interface Reference {
  shore_department?: string;
  potential_risk?: string;
  cdi?: string;
  criticality?: string;
  shore_rank?: string;
  location?: string;
  vessel_type?: string;
  viq?: string;
  ship_rank?: string;
  charter_owner?: string;
  second_category?: any;
  main_category?: string;
  third_category?: string;
  ship_department?: string;
}

export interface AuditInspectionWorkspaceSummaryResponse {
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
  findingRemark: string;
  findingComment: string;
  reference: any;
  isSignificant: boolean;
  rectifiedOnBoard?: boolean;
  mainCategoryId: string;
  secondCategoryId: string;
  thirdCategoryId: string;
  viqId: string;
  departmentId: string;
  isVerify: boolean;
  isOpen: boolean;
  remark: any;
  planedCompletionDate: any;
  actualCompletionDate: any;
  immediateAction: any;
  preventiveAction: any;
  correctiveAction: any;
  fillQuestion: {
    fillAuditChecklist: {
      webInstance: string;
      appInstance: string;
    };
    id: string;
  };
  ref: Reference;
  findingAttachments: any[];
  createdUserId: string;
  updatedUserId: string;
  chkQuestion: {
    id: string;
    question: string;
    code: string;
  };
  auditType: {
    name: string;
  };
  natureFinding: {
    name: string;
  };
  mainCategory: {
    name: string;
  };
  secondCategory: {
    name: string;
  };
  thirdCategory: {
    name: string;
  };
  auditChecklist: {
    code: string;
    revisionNumber: string;
  };
}

export interface ListAIWFindingSummaryResponse {
  data: AuditInspectionWorkspaceSummaryResponse[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

// fill question responsive

export interface AnswerOption {
  id: string;
  content: string;
}
export interface ReferencesCategoryDatum {
  id: string;
  masterTableId: string;
  valueId: string;
  value: any;
}

export interface ChkQuestion {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  auditChecklistId: string;
  order: number;
  code: string;
  type: string;
  companyMixCode: string;
  vesselTypeMixCode: string;
  info: string;
  reg: string;
  question: string;
  isMandatory: boolean;
  hasRemark: string;
  remarkSpecificAnswers: string[];
  requireEvidencePicture: boolean;
  minPictureRequired: number;
  ratingCriteria: string;
  hint: string;
  topicId: string;
  locationId: string;
  mainCategoryId: string;
  createdUserId: string;
  updatedUserId: string;
  answerOptions: AnswerOption[];
  topic: {
    name: string;
  };
  auditChecklist: {
    id: string;
    inspectionMappings?: {
      id: string;
      createdAt: string;
      auditTypeId?: string;
      natureFindings?: {
        natureFindingId: string;
      }[];
    }[];
  };
  referencesCategoryData: ReferencesCategoryDatum[];
  attachments?: string[];
}

export interface UploadResponsive {
  id: string;
  createdAt: Date;
  mimetype: string;
  type: string;
  key: string;
  prefix: string;
  originName: string;
  originalname: string;
  size: number;
  sizes: string[];
  link: string;
  uploadByUser: { id: string; username: string };
  uploadedByUserId: string;
}

export interface FindingReport {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  reportFindingFormId?: string;
  internalAuditReportId?: string;
  auditWorkspaceId?: string;
  auditChecklistId?: string;
  chkQuestionId?: string;
  auditTypeId?: string;
  natureFindingId?: string;
  isPrimaryFinding?: boolean;
  findingRemark?: string;
  locationId?: string;
  rectifiedOnBoard?: boolean;
  findingComment?: string;
  reference?: string;
  isSignificant?: boolean;
  isSyncToIAR?: boolean;
  mainCategoryId?: string;
  secondCategoryId?: string;
  thirdCategoryId?: string;
  viqId?: string;
  departmentId?: string;
  isVerify?: boolean;
  isOpen?: boolean;
  remark?: string;
  companyId?: string;
  planedCompletionDate?: any;
  actualCompletionDate?: any;
  immediateAction?: any;
  preventiveAction?: any;
  correctiveAction?: any;
  findingAttachments?: any[];
  createdUserId?: string;
  updatedUserId?: any;
}

export interface ReferenceData {
  location?: {
    location: string;
    acronym: string;
  };
  vessel_type?: string;
  main_category?: {
    mainCategory: string;
    acronym: string;
  };
  viq?: string;
  cdi?: string;
  charter_owner?: string;
}
export interface FillQuestionItem {
  id: string;
  chkQuestionId: string;
  answers: string[];
  evidencePictures: string[];
  attachments: string[];
  reportFindingItem: FindingReport;
  findingRemark?: string;
  referenceData?: ReferenceData;
}

export interface FillQuestionExtend extends FillQuestionItem {
  requireEvidencePicture: boolean;
  hasRemark: string;
  topicName?: string;
  isMandatory?: boolean;
  remarkSpecificAnswers: string[];
  minPictureRequired?: number;
  referenceFrom?: string;
  findingRemark?: string;
  memo?: string;
}

export interface ReferencesCategoryData {
  id: string;
  masterTableId: string;
  valueId: string;
  value: string;
}

export interface QuestionChecklist {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  fillAuditChecklistId: string;
  locationId: any;
  chkQuestionId: string;
  answers: string[];
  evidencePictures: string[];
  attachments: string[];
  reportFindingItemId: string;
  createdUserId: any;
  updatedUserId: string;
  referencesCategoryData: ReferencesCategoryData;
  memo?: string;
  chkQuestion: ChkQuestion;
  referenceData: ReferenceData;
  updatedUser: {
    username: string;
  };
  reportFindingItem?: FindingReport;
  findingRemark?: string;
}

export interface FillChecklist {
  topic: string;
  questions: QuestionChecklist[];
}

// Fill params

export interface GetFillChecklistParams {
  workspaceId: string;
  fillChecklistId: string;
}

export interface FillQuestionParams {
  fillQuestions: FillQuestionItem[];
  timezone: 'Asia/Ho_Chi_Minh';
}

export interface UpdateFillChecklistParams {
  workspaceId: string;
  fillChecklistId: string;
  data: FillQuestionParams;
  afterSubmit?: () => void;
}

export interface TriggerFillChecklistParams {
  workspaceId: string;
  fillChecklistId: string;
  data: {
    planningRequestId: string;
    timezone: string;
  };
}

export interface SubmitWorkspaceParams {
  id: string;
  data: {
    planningRequestId?: string;
    timezone: string;
  };
  afterSubmit?: () => void;
}

// update finding submit

export interface FindingSummaryParams {
  id: string;
  auditChecklistId: string;
  natureFindingId: string;
  auditTypeId: string;
  isSignificant: string;
  findingRemark: string;
  findingComment: string;
  mainCategoryId: string;
  secondCategoryId: string;
  thirdCategoryId: string;
}

export interface UpdateFindingSummary {
  workspaceId: string;
  findingItemId: string;
  data: FindingSummaryParams;
  afterSubmit?: () => void;
}

// remark

export interface Remark {
  id?: string;
  auditWorkspaceId?: string;
  title: string;
  remark: string;
  isPublic?: boolean;
  attachments?: string[];
}

export interface MasterChiefInspection {
  id: string;
  type: string;
  value: string;
}

export interface RemarkParam {
  data: Remark;
  handleSuccess?: () => void;
}

export interface RemarkItem {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  auditWorkspaceId: string;
  title: string;
  remark: string;
  isPublic: boolean;
  attachments: string[];
  createdUserId: string;
  updatedUserId: string;
  createdUser: ByUser;
  updatedUser: ByUser;
}

export interface ListRemarkResponse {
  data: RemarkItem[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

// References and Categories

export interface ReferencesCategory {
  reference: string;
  name: string;
}

export interface InspectionWorkSpaceSummaryResponse {
  vesselInfo: {
    vesselId: string;
    vesselName: string;
    vesselType: string;
    fleetName: string;
    vesselBuildOn: string;
    shipManagerName: string;
    companyId?: string;
  };
  schedulerInfo: {
    planningRequestId: string;
    workingType: string;
    visitType: string;
    inspectorName: string[];
    plannedFrom: string;
    plannedTo: string;
    portFrom: string;
    portTo: string;
    memo: string;
  };
  inspectionReport: {
    iarId: string;
    status: string;
    dateOfInitiatingReport: string;
    dateOf1stSubmission: string;
    dateOfReportApproval: string;
    dateOfReportDispatched: string;
  };
  reportOfFinding: {
    followUpId?: string;
    rofId: string;
    auditTypes?: string[];
    status: string;
    totalNoOfFindings: string;
    totalCar: string;
    totalCap: string;
    totalOpenCar: string;
    totalCloseCar: string;
    totalDeniedCar: string;
    totalAcceptCar: string;
    verificationNeededCar: string;
    pendingVerificationCar: string;
    caIssuedDate: string;
    capReceivedDate: string;
  };
}

export interface IUpdateAnalyticalFindingRepeat {
  analyticalReportRepeatedFinding?: {
    id: string;
    chkQuestionId: string;
    statusButton: string;
    timeOfRepeating: number;
    suggestedValue: number;
  }[];
}
