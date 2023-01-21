import { CompanyObject } from 'models/common.model';

export enum Scope {
  internal = 'internal',
  external = 'external',
}

export enum Status {
  active = 'active',
  inactive = 'inactive',
}

export interface NatureOfFinding {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  code: string;
  name: string;
  status: string;
  description: string;
  companyId: string;
  createdUserId: string;
  updatedUserId: string;
}

export interface AuditType {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  code: string;
  name: string;
  scope?: string;
  companyId: string;
  createdUserId: string;
  updatedUserId: string;
  status?: string;
  description?: string;
}
export interface NatureFindingNatureFinding {
  id: string;
  name: string;
}

export interface NatureFindingElement {
  id: string;
  natureFinding: NatureFindingNatureFinding;
}

export interface NatureFinding {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  inspectionMappingId: string;
  natureFindingId: string;
  isPrimaryFinding: boolean;
  natureFinding: AuditType;
}

export interface AuditChecklist {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  code: string;
  appType: string;
  chkType: string;
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
  reviewInProgress: boolean;
  companyId: string;
  createdUserId: string;
  updatedUserId: string;
}

export interface Authority {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  code: string;
  name: string;
  status: string;
  description: string;
  companyId: string;
  createdUserId: string;
  updatedUserId: string;
}

export interface CreatedUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  avatar: string;
  username: string;
}
export interface CreatedUserStatus {
  id: string;
  jobTitle: string;
  username: string;
}

export interface InspectionMapping {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  scope: string;
  status: string;
  auditPeriod: number;
  auditTypeId: string;
  windowStartPeriod: number;
  windowEndPeriod: number;
  applicableShip: boolean;
  applicableShore: boolean;
  showViq: boolean;
  extensionApplicable: boolean;
  shoreApprovalRequired: boolean;
  companyId: string;
  createdUserId: string;
  updatedUserId: string;
  createdUser: CreatedUser;
  updatedUser: CreatedUser;
  auditChecklists: AuditChecklist[];
  authorities: AuditType[];
  auditType: AuditType;
  natureFindings: NatureFinding[] | NatureFindingElement[];
  company?: CompanyObject;
  isNew?: boolean;
  resetForm?: () => void;
}

export interface GetInspectionMappingsResponse {
  data: InspectionMapping[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface GetNatureOfFindingsResponse {
  data: NatureOfFinding[];
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
}
export interface GetInspectionMappingsParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  getList?: () => void;
}

export interface CreateInspectionMappingParams {
  scope: string;
  windowStartPeriod: number;
  windowEndPeriod: number;
  auditPeriod: number;
  extensionApplicable: boolean;
  applicableShip: boolean;
  applicableShore: boolean;
  showViq: boolean;
  shoreApprovalRequired: boolean;
  auditTypeId: string;
  primaryFinding: string;
  natureFindingIds: string[];
  auditChecklistIds: string[];
  authorityIds: string[];
}

export interface UpdateInspectionMappingParams {
  id: string;
  data: CreateInspectionMappingParams;
}

export interface StatusHistory {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  inspectionMappingId?: string;
  status?: string;
  createdUser?: CreatedUserStatus;
}

export interface InspectionMappingDetailResponse {
  applicableToVettingInspection: boolean;
  applicableToOtherBoard: boolean;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  scope: string;
  status: string;
  auditPeriod: number;
  auditTypeId: string;
  windowStartPeriod: number;
  windowEndPeriod: number;
  applicableShip: boolean;
  applicableShore: boolean;
  showViq: boolean;
  extensionApplicable: boolean;
  shoreApprovalRequired: boolean;
  companyId: string;
  createdUserId: string;
  updatedUserId: string;
  createdUser: CreatedUser;
  updatedUser: string;
  auditChecklists: AuditChecklist[];
  authorities: AuditType[];
  auditType: AuditType;
  natureFindings: NatureFinding[];
  statusHistory?: StatusHistory[];
}
