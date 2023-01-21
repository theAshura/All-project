import { ButtonType } from 'components/ui/button/Button';
import { NewAsyncOptions } from 'components/ui/async-select/NewAsyncSelect';
import { ReactNode } from 'react';
import { ColumnState } from 'ag-grid-community';
import { Moment } from 'moment';
import { LabelListType } from 'constants/module-configuration.cons';

export enum CommonStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface RequestBody {
  entity: string;
  field: string;
  value: string;
}

export enum FilterFor {
  'safetyScore',
  'docSafetyScore',
  'ghgRating',
  'lastInspectionValidity',
  'customerRestricted',
  'blacklistOnMOUWebsite',
  'rightShip',
}

export interface CheckUniqueResponsive {
  isExist: boolean;
  requestBody: RequestBody;
}
export interface PaginationModel {
  page: number;
  pageSize: number;
  totalItem: number;
  totalPage: number;
}

export interface exportParams {
  pageSize?: number;
  fromPage?: number;
  toPage?: number;
}

export interface CommonApiParam {
  filterFor?: FilterFor; // enum
  vesselTypeId?: string;
  workingType?: string;
  fieldType?: string;
  eventTypeId?: string;
  entityType?: string;
  isMapping?: boolean;
  module?: string;
  vesselCode?: string;
  startDate?: string;
  isLeftMenu?: boolean;
  auditEntity?: string;
  vettingRiskScore?: string;
  viqVesselType?: string;
  departmentId?: string;
  auditWorkspaceId?: string;
  type?: string;
  lang?: string;
  portType?: string;
  country?: NewAsyncOptions;
  scope?: string;
  company?: string;
  unplanned?: boolean;
  workSpace?: boolean;
  page?: number;
  groupId?: string;
  pageSize?: number;
  totalItem?: number;
  where?: string;
  pattern?: string;
  sort?: string;
  relations?: string;
  mainCategoryId?: string;
  portMasterId?: string;
  content?: string;
  status?: string;
  role?: string;
  exportType?: string;
  data?: exportParams;
  natureFinding?: string;
  isRefreshLoading?: boolean;
  levels?: string;
  reportFinding?: boolean;
  isUpdate?: boolean;
  auditCompanyId?: boolean;
  ckListStatus?: string;
  rofStatus?: string;
  iarStatus?: string;
  id?: string;
  vesselId?: NewAsyncOptions | string;
  planningRequestId?: NewAsyncOptions | string;
  auditTimeTable?: boolean;
  rankId?: string;
  fromDate?: string;
  actualAuditFrom?: string;
  actualAuditTo?: string;
  toDate?: string;
  workflowType?: string;
  approverType?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
  tabKey?: string;
  dashboard?: boolean;
  internalAuditReport?: boolean;
  handleSuccess?: () => void;
  isNotSaveSearch?: boolean;
  columnsAGGrid?: ColumnState[];
  filterModel?: any;
  dateFilter?: Moment[];
  typeRange?: string;
  companyId?: string;
  tab?: string;
  internalAuditReportId?: string;
  hasElement?: string;
  hasSelf?: string;
  filterRisk?: string;
  isVerified?: boolean;
  vesselScreeningId?: string;
  vesselTypeName?: string;
  groupBy?: string;
  moduleName?: string;
  isDefault?: boolean;
  labelId?: string;
  userDefinedLabel?: string;
  language?: string;
  description?: string;
  action?: LabelListType;
}

export type CommonListParams = Pick<
  CommonApiParam,
  'page' | 'pageSize' | 'content' | 'sort' | 'type'
> & {
  isRefreshLoading?: boolean;
};

export interface SearchProps {
  searchContent?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  page?: string;
  pageSize?: string;
  sorting?: string;
  type?: string;
  startPrice?: number;
  endPrice?: number;
}

export interface CommonMessageErrorResponse {
  fieldName?: string;
  field?: string;
  message: any;
}
export interface UsersPermissions {
  permission: string;
  userIds: string[];
}
export interface UserAssignment {
  planningRequestId?: string;
  auditChecklistId?: string;
  reportFindingFormId?: string;
  internalAuditReportId?: string;
  selfAssessmentId?: string;
  usersPermissions: UsersPermissions[];
}

export interface CommonActionRequest {
  id: string;
  type?: string;
  body?: {
    status?: string;
    remark?: string;
    planningRequestId?: string;
    userAssignment: UserAssignment;
  };
  requestSuccess?: () => void;
}

export enum CampaignStatusType {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}

export interface PhotoModel {
  file: File;
}

export interface RowLabel {
  id: string;
  label: string | ReactNode;
  sort: boolean;
  addAction?: boolean;
  width?: string | number;
  fixedWidth?: string | number;
  minWidth?: number;
  maxWidth?: string | number;
}

export interface DataObj {
  [k: string]: any;
}

export interface TableProps {
  page?: number;
  pageSize?: number;
  totalItem?: number;
  totalPage?: number;
  handleChangePage?: (page: number, pageSize?: number) => void;
  renderRow: (isScrollable?: boolean) => void;
  loading?: boolean;
  rowLabels: RowLabel[];
  isHiddenPagination?: boolean;
}

export interface CompanyObject {
  id: string;
  name: string;
}

export interface TableFilterProps {
  handleChangeSearchValue: (field: string, value: string | number) => void;
  handleClearSearchValue: () => void;
  handleGetList: (getAll?: boolean, isRefreshLoading?: boolean) => void;
  searchContent: string;
}

export interface ErrorField {
  fieldName: string;
  message: string;
}

export interface CommonErrorResponse {
  message: string;
  statusCode: number;
}

export interface ErrorList {
  field: string;
  message: string;
}

export interface AvatarType {
  id?: string;
  url?: string;
}

export interface Action {
  img: string;
  feature?: string;
  subFeature?: string;
  action?: string;
  function?: () => void;
  buttonType?: ButtonType;
  cssClass?: string;
  disable?: boolean;
  onchange?: (value) => void;
  isSwitch?: boolean;
  valueSwitch?: boolean;
  tooltipTitle?: string;
  classNameToggleSwitch?: string;
  disableFeatureChecking?: boolean;
}

export interface Attachment {
  id?: string;
  type?: string;
  key?: string;
  mimetype?: string;
  size?: number;
  originName?: string;
  lastModifiedDate?: Date;
}

export interface IStepHistory {
  auditTimeTableId: string;
  createdAt: string;
  workflowRemark?: string;
  createdUser: {
    id: string;
    jobTitle: string;
    username: string;
  };
  id: string;
  status: string;
  updatedAt: string;
}

export interface AtedUser {
  username: string;
}

export interface AuditTimeTable {
  actualFrom: Date;
  actualTo: Date;
}

export interface AuditType {
  id: string;
  name: string;
}

export interface Auditor {
  id: string;
  employeeId: string;
  username: string;
}

export enum EntityType {
  Vessel = 'Vessel',
  Office = 'Office',
}

export interface Port {
  id: string;
  code: string;
  name: string;
}

export interface PlanningRequestAdditionalReviewer {
  id: string;
  comment: string;
}

export enum Timezone {
  AsiaBangkok = 'Asia/Bangkok',
  AsiaSaigon = 'Asia/Saigon',
}

export enum TypeOfAudit {
  Port = 'port',
}

export interface Owner {
  id: string;
  username: string;
}

export interface Vessel {
  id: string;
  code: string;
  name: string;
  countryFlag: string;
  fleet: AuditType;
  vesselType: AuditType;
  owners: Owner[];
}

export interface HistoryItem {
  id: string;
  createdAt: Date;
  noOfFindings?: string;
  noOfOpenFindings?: string;
  updatedAt: Date;
  refId: string;
  auditNo: string;
  vesselId: string;
  auditCompanyId: string;
  internalAuditId: string;
  typeOfAudit: TypeOfAudit;
  fromPortId: string;
  toPortId: string;
  estimatedTimeDeparture: Date;
  toPortEstimatedTimeArrival: Date;
  internalAuditReport: {
    id: string;
    reportFindingItems: {
      id: string;
      findingStatus: string;
    }[];
  };
  toPortEstimatedTimeDeparture: Date;
  fromPortEstimatedTimeArrival: Date;
  fromPortEstimatedTimeDeparture: Date;
  auditRefId: string;
  departmentCode: string;
  dateOfLastAudit: string;
  dueDate: Date;
  estimatedTimeArrival: Date;
  timezone: Timezone;
  plannedFromDate: Date;
  plannedToDate: Date;
  leadAuditorId: string;
  extensionReq: string;
  workflowId: string;
  status: string;
  previousStatus: string;
  globalStatus: string;
  auditorType: string;
  memo: string;
  auditPlanStatus: string;
  entityType: string;
  departmentId: string;
  dateOfLastInspection: Date;
  workingType: string;
  attachments: string[];
  createdUserId: string;
  updatedUserId: string | string;
  companyId: string;
  createdUser: AtedUser;
  updatedUser: AtedUser;
  vessel: Vessel;
  auditTypes: AuditType[];
  auditors: Auditor[];
  leadAuditor: Auditor;
  auditTimeTable: AuditTimeTable;
  planningRequestAdditionalReviewers: PlanningRequestAdditionalReviewer[];
  auditCompany: string;
  department: string;
  fromPort: Port;
  toPort: Port;
}

export interface HistoryResponse {
  data: HistoryItem[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface NameClass {
  name: string;
  code: string;
}

export interface UserAssignments {
  id: string;
  permission: string;
  user: {
    id: string;
    username: string;
    jobTitle?: string;
    company: NameClass;
    divisions?: NameClass[];
  };
}
