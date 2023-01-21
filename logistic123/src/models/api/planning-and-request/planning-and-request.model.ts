import {
  IStepHistory,
  CompanyObject,
  UserAssignments,
} from 'models/common.model';
import { AuditType } from '../audit-type/audit-type.model';
import { Port } from '../port/port.model';
import { User } from '../user/user.model';
import { Vessel, VesselCharterers, VesselOwners } from '../vessel/vessel.model';

export interface AdditionalReviewer {
  // serialNumber?: string;
  // rankId?: string;
  // rank?: { id: string; name: string };
  // reviewer?: { id: string; username?: string };
  // reviewerId?: string;
  // targetDate?: Date;
  // status?: string;
  // createdUser?: { username?: string };
  // comment?: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  comment: string;
  planningRequestId: string;
  reviewedDate: null;
  createdUserId: string;
  createdUser: { id: string; username: string };
}

export interface PlanningRequestOfficeComments {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  serialNumber: string;
  comment: string;
  planningRequestId: string;
  reviewerId: null | string;
  reviewedDate: null | string;
  createdUserId: string;
  updatedUserId: string;
  updatedUser: {
    id: string;
    username: string;
    jobTitle: string;
    email: string;
  };
  createdUser: { id: string; username: string };
}
export interface FocusRequestObj {
  status?: string;
  question?: string;
  deleted?: boolean;
}

export interface PRFocusRequest {
  id: string;
  createdAt: string;
  updatedAt?: string;
  answer?: string;
  memo?: string;
  planningRequestId?: string;
  focusRequestId?: string;
  focusRequestObj?: FocusRequestObj;
}
export interface Department {
  id: string;
  name: string;
}

export interface PlanningAndRequest {
  id?: string;
  refId?: string;
  auditRefId?: string;
  companyName?: string;
  auditCompanyId?: string;
  companyId?: string;
  departmentIds?: string;
  vesselId?: string;
  timezone?: string;
  typeOfAudit?: string;
  auditCompany?: {
    name: string;
  };
  departments?: Department[];
  leadAuditorList?: any;
  fromPortId?: string;
  toPortId?: string;
  auditorList?: string;
  dateOfLastInspection?: Date | string;
  toPortEstimatedTimeArrival?: Date | string;
  toPortEstimatedTimeDeparture?: Date | string;
  fromPortEstimatedTimeArrival?: Date | string;
  fromPortEstimatedTimeDeparture?: Date | string;
  plannedFromDate?: Date | string;
  plannedToDate?: Date | string;
  auditTypeIds?: string[];
  memo?: string;
  attachments?: string[];
  auditorIds?: string[];
  leadAuditorId?: string;
  company?: CompanyObject;
  officeComments?: {
    serialNumber?: string;
    comment?: string;
  }[];
  additionalReviewers?: AdditionalReviewer[];
  auditTypes?: AuditType[];
  auditors?: User[];
  vesselManagerList?: string;
  dateOfLastAudit?: Date;
  departmentCode?: string;
  dueDate?: Date | string;
  fromPort?: Port;
  toPort?: Port;
  leadAuditor?: User;
  status?: string;
  globalStatus?: string;
  createdUser?: {
    username: string;
  };
  createdAt?: Date;
  createdUserId?: string;
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
  previousStatus?: string;
  planningRequestAdditionalReviewers?: AdditionalReviewer[];
  planningRequestOfficeComments?: PlanningRequestOfficeComments[];
  planningRequestHistories?: IStepHistory[];
  reportFindingItems?: any[];
  reviewInProgress?: boolean;
  entityType?: string;
  workingType?: string;
  pRFocusRequests?: PRFocusRequest[];
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
  locationId?: string;
}

export interface ListPlanningAndRequestResponse {
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
  data: Array<PlanningAndRequest>;
}
export interface UpdatePlanningAndRequestParams {
  id: string;
  body: PlanningAndRequest;
}

export interface CancelPlanningAndRequestParams {
  id: string;
  body: {
    comment: string;
    userAssignment?: any;
  };
}
export interface UpdatePlanningAndRequestStatusParams {
  id: string;
  status?: string;
  params?: {
    isRejected?: boolean;
  };
  body?: {
    timezone: string;
    comment?: string;
    remark?: string;
    userAssignment?: any;
  };
}

export interface GetPARByAuditorsParams {
  page?: string;
  pageSize?: string;
  content?: string;
  status?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
  fromDate?: string;
  toDate?: string;
  entityType?: string;
  sort?: string;
  groupBy?: string;
}

export interface IFocusRequest {
  focusRequestId: string;
  question: string;
  memo: string;
  answer: string;
  id?: string;
}

export interface GetMailTemplate {
  entityType?: string;
  mailTypeId?: number;
  vesselTypeId?: string;
  workingType?: string;
  module?: string;
}

export interface AuditLog {
  id: string;
  module: string;
  activity: string;
  planningId: string;
  createdUser: {
    id: string;
    username: string;
    jobTitle: string;
  };
  createdAt: string;
}

export interface ListAuditLogResponse {
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
  data: Array<AuditLog>;
}
