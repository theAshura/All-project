import { CompanyObject } from 'models/common.model';
import { StatusHistory } from 'models/api/audit-checklist/audit-checklist.model';
import { AuditType } from '../audit-type/audit-type.model';

export enum Status {
  active = 'active',
  inactive = 'inactive',
}
// export interface ReportTemplate {
//   id: string;
//   name: string;
//   moduleName?: string;
//   code: string;
//   sno?: number;
//   topic?: string;
//   status: string;
//   version: string;
//   topicType: string;
//   auditType: string;
//   minScore: number;
//   maxScore: number;
//   isNew?: boolean;
//   resetForm?: () => void;
// }

export interface GetVersionReportTemplateParam {
  timezone: string;
}

export interface GetVersionReportTemplateResponse {
  code: string;
  verifySignature: string;
}

export interface Child {
  parentId?: string;
  topic?: string;
  minScore?: number;
  maxScore?: number;
  topicType?: string;
  serialNumber?: string;
  type?: string;
  printOption?: string;
}

export interface ReportHeader {
  // thu co id thoi
  id?: string;
  topic?: string;
  minScore?: number;
  maxScore?: number;
  topicType?: string;
  serialNumber?: string;
  auditTypeIds?: string[];
  auditTypes?: AuditType[];
  children?: ReportHeader[];
  parentId?: string;
  printOption?: string;
  type?: string;
  isDefault?: boolean;
}

export interface ReportTemplate {
  id: string;
  moduleName: string;
  status: string;
  version: string;
  vesselTypeIds?: string[];
  auditTypeIds: string[];
  auditEntity: string;
  reportHeaders: ReportHeader[];
  timezone: string;
  isNew?: boolean;
  resetForm?: () => void;
}

export interface CreatedUser {
  username: string;
}

export interface ReportTemplateResponse {
  id: string;
  auditEntity: string;
  createdAt: Date;
  updatedAt: Date;
  moduleName: string;
  version: string;
  serialNumber: string;
  status: string;
  companyId: string;
  createdUserId: string;
  updatedUserId?: any;
  numDependents: number;
  createdUser: CreatedUser;
  updatedUser?: any;
  company?: CompanyObject;
}
export interface GetReportTemplatesResponse {
  data: ReportTemplateResponse[];
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
  version?: string;
  sort?: string;
}
export interface GetReportTemplatesParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  getList?: () => void;
}

export interface CreateReportTemplateParams {
  name: string;
  code: string;
  status: string;
  version: string;
}

export interface UpdateReportTemplateParams {
  id: string;
  data: CreateReportTemplateParams;
}

export interface VesselType {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  code: string;
  name: string;
  vettingRiskScore: number;
  status: string;
  description: string;
  companyId: string;
  createdUserId: string;
  updatedUserId: string;
}
export interface ReportTemplateDetailResponse {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  moduleName?: string;
  version?: string;
  serialNumber?: string;
  status?: string;
  companyId?: string;
  createdUserId?: string;
  updatedUserId?: any;
  numDependents?: number;
  reportHeaders?: ReportHeader[];
  vesselTypes?: VesselType[];
  createdUser?: CreatedUser;
  updatedUser?: any;
  statusHistory?: StatusHistory[];
  auditTypes?: VesselType[];
  auditEntity?: string;
}

export interface Header {
  topic?: string;
  auditTypeIds?: string[];
  minScore?: number;
  maxScore?: number;
  serialNumber?: string;
  children: Header[];
}

export interface updateReportHeaderParam {
  id?: string;
  topic?: string;
  auditTypeIds?: string[];
  minScore?: number;
  maxScore?: number;
}
