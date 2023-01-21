import { OptionProp } from 'components/ui/select/Select';
import { ErrorField, IStepHistory, CompanyObject } from 'models/common.model';
import { Vessel } from 'models/api/vessel/vessel.model';
import { PlanningAndRequest } from '../planning-and-request/planning-and-request.model';
import { User } from '../user/user.model';

export enum Scope {
  internal = 'internal',
  external = 'external',
}

export enum Status {
  active = 'active',
  inactive = 'inactive',
}

export interface ParamsList {
  page?: number;
  pageSize?: number;
  content?: string;
  status?: string;
  sort?: string;
}
export interface GetAuditTimeTablesParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  getList?: () => void;
}

export interface CalendarDate {
  id?: string;
  date: string;
  from: string;
  to: string;
  process: string;
  auditee: string;
  auditorId: string;
  operator?: string;
}

export interface CreateAuditTimeTableParams {
  planningRequestId: string;
  scope: string;
  actualFrom: string;
  actualTo: string;
  timezone: string;
  calendars: CalendarDate[];
  attachments: string[];
  afterCreate?: () => void;
}

export interface UpdateAuditTimeTableParams {
  id: string;
  data: CreateAuditTimeTableParams;
  afterUpdate?: () => void;
}

export interface ErrorResponsive {
  errorList: ErrorField[];
}

// ------------------------------------------------------------

export interface CreatedUser {
  username: string;
}

export interface Fleet {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  code: string;
  name: string;
  companyId: string;
  status: string;
  createdUserId: string;
  updatedUserId?: any;
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

export interface Company {
  name: string;
}

export interface AuditType {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  code: string;
  name: string;
  scope: string;
  companyId: string;
  createdUserId: string;
  updatedUserId?: any;
}

export interface Auditor {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  avatar?: any;
  employeeId: string;
  firstName: string;
  lastName: string;
  username: string;
  jobTitle: string;
  companyId: string;
  rankId?: any;
  primaryDepartmentId?: any;
  departmentId?: any;
  userType: string;
  status: string;
  controlType: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dob: Date;
  nationality: string;
  country: string;
  stateOrProvince: string;
  townOrCity: string;
  address: string;
  postCode: string;
  roleScope: string;
  password: string;
  salt: string;
  lastLogin: Date;
  createdUserId: string;
  parentCompanyId?: any;
  roles: string[];
}

export interface LeadAuditor {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  avatar?: any;
  employeeId: string;
  firstName: string;
  lastName: string;
  username: string;
  jobTitle: string;
  companyId: string;
  rankId?: any;
  primaryDepartmentId?: any;
  departmentId?: any;
  userType: string;
  status: string;
  controlType: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dob: Date;
  nationality: string;
  country: string;
  stateOrProvince: string;
  townOrCity: string;
  address: string;
  postCode: string;
  roleScope: string;
  password: string;
  salt: string;
  lastLogin: Date;
  createdUserId: string;
  parentCompanyId?: any;
  roles: string[];
}

export interface AuditTimeTable {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  refNo?: any;
  vesselId?: OptionProp;
  planningRequestId: string;
  actualFrom?: any;
  actualTo?: any;
  timezone?: string;
  entityType?: string;
  scope?: any;
  auditors?: string[];
  status?: string;
  companyId?: string;
  createdUserId?: string;
  updatedUserId?: any;
  attachments?: any[];
  createdUser?: CreatedUser;
  updatedUser?: any;
  planningRequest?: PlanningAndRequest;
  sNo: string;
  vessel?: Vessel;
  reviewInProgress: boolean;
  company?: CompanyObject;
}

export interface AuditTimeTableDetailResponse {
  id: string;
  vesselId?: string;
  // code: string;
  // name: string;
  // scope: string;
  status?: string;
  // description?: string;
  // deleted: boolean;
  // createdAt?: Date;
  // updatedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  refNo?: any;
  sNo?: string;
  planningRequestId?: string;
  actualFrom?: any;
  actualTo?: any;
  timezone?: string;
  leadAuditor?: User;
  scope?: string;
  auditors?: string[];
  companyId?: string;
  createdUserId?: string;
  updatedUserId?: any;
  attachments?: any[];
  planningRequest?: PlanningAndRequest;
  vessel?: Vessel;
  statusHistory?: IStepHistory[];
}

export interface GetAuditTimeTablesResponse {
  data: AuditTimeTable[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface AuditorDate {
  id: string;
  firstName: string;
  lastName: string;
}
export interface DateCalendarResponse {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  auditTimeTableId: string;
  date: string;
  from: string;
  to: string;
  process: string;
  auditee: string;
  companyId: string;
  auditorId: string;
  createdUserId: string;
  updatedUserId: string;
  createdUser: string;
  updatedUser: string;
  auditor: AuditorDate;
}
export interface DateCalendarsResponse {
  data: DateCalendarResponse[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}
