import { IncidentDetail } from 'pages/incidents/utils/models/common.model';
import { ErrorField, CommonApiParam } from 'models/common.model';

export interface ByUser {
  email: string;
  id: string;
  jobTitle: string;
  username: string;
}

export interface IComment {
  comment?: string;
  createdAt?: string;
  createdUser?: ByUser;
  dryDockingRequestId?: string;
  id?: string;
  updatedAt?: Date | string;
  updatedUser?: ByUser;
}

export interface ParamsList {
  page?: number;
  pageSize?: number;
  content?: string;
  status?: string;
  sort?: string;
}
export interface GetVesselScreeningParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  getList?: () => void;
}

export interface GetListVesselScreeningParams extends CommonApiParam {
  id: string;
}

export interface PortType {
  id?: string;
  portId: string;
  terminalId: string;
  berth: string;
  layCanDate: Date;

  createdAt?: Date;
  updatedAt?: Date;
  vesselScreeningId?: string;
  port?: {
    code: string;
    name: string;
    country: string;
  };
  terminal?: {
    code: string;
    name: string;
    portMaster?: {
      code: string;
      name: string;
      country: string;
    };
  };
}

export interface RightShip {
  createAt?: Date;
  docSafetyScore?: any;
  evdi?: string;
  ghgRating?: string;
  ghgRatingDate?: string;
  id?: string;
  inspectionAdditionalData?: string;
  inspectionRequired?: string;
  lastInspectionValidity?: any;
  latInspectionOutcome?: string;
  platformLink?: string;
  plus?: string;
  safetyScore?: number;
  safetyScoreDate?: Date;
  technicalManagerName?: string;
  technicalManagerOwCode?: any;
  updatedAt?: Date;
  vesselId?: string;
}

export interface CreateVesselScreeningParams {
  dateRequest: Date | string;
  nameRequest: string;
  companyRequestId: string;
  nominatingCounterPartyRequest: string;
  phoneRequest: string;
  emailRequest: string;
  vesselId: string;
  transferTypeId: string;
  cargoTypeId: string;
  cargoId?: string;
  totalQuantity: number;
  units: string;
  ports: PortType[];
  remark: string;
  handleSuccess?: () => void;
}

export interface UpdateStatusRequestParams {
  id?: string;
  status: string;
  reviewStatus: string;
  vesselId: string;
  remark?: string;
  picIds: string[];
  ports: PortType[];
  transferTypeId: string;
  cargoTypeId: string;
  cargoId: string;
  totalQuantity: string | number;
  units: string;
}

export interface UpdateVesselScreeningParams {
  id: string;
  data: CreateVesselScreeningParams;
  handleSuccess?: () => void;
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

export interface CommonType {
  code?: string;
  name?: string;
}

export interface CompanyType {
  companyIMO?: string;
  code?: string;
  name?: string;
  parent?: CommonType;
}

export interface Vessel extends CommonType {
  imoNumber?: string;
  name?: string;
  code?: string;
  blacklistOnMOUWebsite?: boolean;
  customerRestricted?: boolean;
}

export interface PortMaster extends CommonType {
  country: string;
}

export interface Terminal extends CommonType {
  portMaster: PortMaster;
}

export interface ShipParticularDetail {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  vesselScreeningId: string;
  typeOfManagement: string;
  status: string;
  remarks: string;
  portId: string;
  vesselOwnerBusinessId: null;
  attachments: any[];
  createdUserId: string;
  updatedUserId: null;
}

export interface ShipParticular {
  shipParticularId?: string;
  vesselScreeningId: string;
  typeOfManagement: string;
  status: string;
  remarks: string;
  portId: string;
  vesselOwnerBusinessId: string;
  attachments: string[];
  handleSuccess?: () => void;
}
export interface LatestDocument {
  createdAt: string;
  id: string;
  originName: string;
  link: string;
}

export interface VesselScreeningDetail {
  name: string;
  pics: any[];
  id: string;
  createdAt: string;
  operatingCompanyName?: string;
  createdUserId: string;
  updatedAt: string;
  updatedUserId: any;
  dateRequest: string;
  nameRequest: string;
  emailRequest: string;
  phoneRequest: string;
  nominatingCounterPartyRequest: string;
  companyRequestId: string;
  cargoTypeId: string;
  cargoId: string;
  reviewStatus?: string;
  vesselId: string;
  transferTypeId: string;
  totalQuantity: number;
  createdUser?: { username: string };
  units: string;
  portId: string;
  terminalId: string;
  updatedUser?: any;
  latestDocuments?: LatestDocument[];
  status: string;
  remark: string;
  requestNo: string;
  companyId: string;
  vessel: Vessel;
  company: CompanyType;
  companyRequest: CommonType;
  transferType: CommonType;
  cargo: CommonType;
  cargoType: CommonType;
  ports: PortType[];
  terminal: Terminal;
  shipParticular: ShipParticularDetail;
  rightShip: RightShip;
  hasOpenIncident: string;
  hasOpenInspection: string;
  riskRating: string;
}

export interface GetVesselScreeningResponse {
  data: VesselScreeningDetail[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface VesselScreeningStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  listVesselScreening: GetVesselScreeningResponse;
  vesselScreeningDetail: VesselScreeningDetail;
  errorList: ErrorField[];
  dataFilter: CommonApiParam;
}

export interface Risk {
  risk: number;
  count: string;
}

// Maintenance Performance

export interface MaintenancePerformanceRequest {
  MPRComments: IComment[];
  id: string;
  vesselScreeningId: string;
  potentialRisk: number;
  potentialScore: number;
  observedRisk: number;
  observedScore: number;
  timeLoss: boolean;
  maintenancePerformanceId: string;
}

export interface VesselScreeningMaintenance {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  eventType: string;
  vesselId: string;
  recordDate: Date;
  periodFrom: Date;
  periodTo: Date;
  totalPlannedJobs: number;
  overdueCriticalJobs: number;
  overdueJobs: number;
  remarks: string;
  attachments: string[];
  createdUserId: string;
  updatedUserId: string;
  companyId: string;
  maintenancePerformanceRequests: MaintenancePerformanceRequest[];
}

export interface UpdateVesselScreeningParamsMaintenance {
  id: string;
  data: {
    maintenancePerformanceId: string;
    vesselScreeningId: string;
    potentialRisk: number;
    potentialScore: number;
    observedRisk: number;
    observedScore: number;
    timeLoss: boolean;
  };
  handleSuccess?: () => void;
}

export interface GetListVesselScreeningMaintenance {
  list: {
    data: VesselScreeningMaintenance[];
    page: number;
    pageSize: number;
    totalPage: number;
    totalItem: number;
  };
  risk: Risk[];
}

export interface VesselMaintenanceStoreModel {
  loading: boolean;
  disable: boolean;
  dataFilter: CommonApiParam;
  list: GetListVesselScreeningMaintenance;
  params: CommonApiParam;
  errors: ErrorField[];
}

// other Tech Records

export interface OtherTechRecordsRequest {
  OTRRComments: IComment[];
  id: string;
  vesselScreeningId: string;
  potentialRisk: number;
  potentialScore: number;
  observedRisk: number;
  observedScore: number;
  timeLoss: boolean;
  otherTechRecordsId: string;
}

export interface VesselScreeningOtherTechRecords {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  eventTypeId: string;
  recordDate: Date;
  techIssueNoteId: string;
  vesselId: string;
  pendingAction: string;
  actionRemarks: string;
  actionStatus: string;
  targetCloseDate: Date;
  actualCloseDate: Date;
  closureRemarks: string;
  initialAttachments: string[];
  attachments: string[];
  createdUserId: string;
  updatedUserId: string;
  companyId: string;
  eventType: {
    id: string;
    name: string;
  };
  techIssueNote: {
    id: string;
    name: string;
  };
  otherTechRecordsRequests: OtherTechRecordsRequest[];
}

export interface UpdateVesselScreeningParamsOtherTechRecords {
  id: string;
  data: {
    otherTechRecordsId: string;
    vesselScreeningId: string;
    potentialRisk: number;
    potentialScore: number;
    observedRisk: number;
    observedScore: number;
    timeLoss: boolean;
  };
  handleSuccess?: () => void;
}

export interface GetListVesselScreeningOtherTechRecords {
  list: {
    data: VesselScreeningOtherTechRecords[];
    page: number;
    pageSize: number;
    totalPage: number;
    totalItem: number;
  };
  risk: Risk[];
}

export interface VesselOtherTechRecordsStoreModel {
  loading: boolean;
  disable: boolean;
  dataFilter: CommonApiParam;
  list: GetListVesselScreeningOtherTechRecords;
  params: CommonApiParam;
  errors: ErrorField[];
}

export interface VesselScreeningTableStoreModel {
  loading: boolean;
  disable: boolean;
  dataFilter: CommonApiParam;
  params: CommonApiParam;
  errors: ErrorField[];
}

// dryDocking

export interface DryDockingRequest {
  id: string;
  vesselScreeningId: string;
  potentialRisk: number;
  potentialScore: number;
  observedRisk: number;
  observedScore: number;
  timeLoss: boolean;
  dryDockingId: string;
  DDRComments?: IComment[];
}

export interface VesselScreeningDryDocking {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  eventType: string;
  vesselId: string;
  plannedDate: Date;
  actualDateFrom: Date;
  actualDateTo: Date;
  portMasterId: string;
  remarks: string;
  status: string;
  completedDate: Date;
  completionRemarks: string;
  attachments: string[];
  createdUserId: string;
  updatedUserId: string;
  companyId: string;
  dryDockingRequests: DryDockingRequest[];
  portMaster: {
    id: string;
    name: string;
    country: string;
  };
}

export interface UpdateVesselScreeningParamsDryDocking {
  id: string;
  data: {
    dryDockingId: string;
    vesselScreeningId: string;
    potentialRisk: number;
    potentialScore: number;
    observedRisk: number;
    observedScore: number;
    timeLoss: boolean;
  };
  handleSuccess?: () => void;
}

export interface GetListVesselScreeningDryDocking {
  list: {
    data: VesselScreeningDryDocking[];
    page: number;
    pageSize: number;
    totalPage: number;
    totalItem: number;
  };
  risk: Risk[];
}

export interface VesselDryDockingStoreModel {
  loading: boolean;
  disable: boolean;
  dataFilter: CommonApiParam;
  list: GetListVesselScreeningDryDocking;
  params: CommonApiParam;
  errors: ErrorField[];
}

// IncidentInvestigation

export interface IncidentInvestigationRequest {
  id?: string;
  vesselScreeningId: string;
  potentialRisk: number;
  potentialScore: number;
  observedRisk: number;
  observedScore: number;
  timeLoss: boolean;
  incidentInvestigationId: string;
}

export interface VesselScreeningIncidentInvestigation {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  description: string;
  title: string;
  sNo: string;
  refId: string;
  voyageNo: string;
  totalNumberOfCrew: number;
  dateTimeOfIncident: Date;
  otherType: string;
  atPort: boolean;
  latitude: string;
  longitude: string;
  typeOfLoss: string;
  immediateDirectCause: string;
  basicUnderlyingCauses: string;
  rootCause: string;
  contributionFactor: string;
  nonContributionFactor: string;
  immediateAction: string;
  preventiveAction: string;
  correctionAction: string;
  companyId: string;
  vesselId: string;
  portId: string;
  typeIncidents: {
    id?: string;
    code?: string;
    name?: string;
  }[];

  portToId: string;
  incidentInvestigationRequests: IncidentInvestigationRequest[];
}

export interface UpdateVesselScreeningParamsIncidentInvestigation {
  id: string;
  data: {
    incidentInvestigationId: string;
    vesselScreeningId: string;
    potentialRisk: number;
    potentialScore: number;
    observedRisk: number;
    observedScore: number;
    timeLoss: boolean;
  };
  handleSuccess?: () => void;
}

export interface GetListVesselScreeningIncidentInvestigation {
  list: {
    data: IncidentDetail[];
    page: number;
    pageSize: number;
    totalPage: number;
    totalItem: number;
  };
  risk: Risk[];
}

export interface VesselIncidentInvestigationStoreModel {
  loading: boolean;
  disable: boolean;
  dataFilter: CommonApiParam;
  list: GetListVesselScreeningIncidentInvestigation;
  params: CommonApiParam;
  errors: ErrorField[];
}

// Port State Control

export interface PortStateControlRequest {
  PSRComments: IComment[];
  comments: IComment[];
  id?: string;
  vesselScreeningId: string;
  potentialRisk: number;
  potentialScore: number;
  observedRisk: number;
  observedScore: number;
  timeLoss: boolean;
  portStateControlId: string;
}

export interface VesselScreeningPortStateControl {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  eventType: CommonType;
  dateOfInspection: Date;
  noFindings: boolean;
  detention: string;
  refId: string;
  comment: string;
  isPort: boolean;
  authorityId: string;
  companyId: string;
  vesselId: string;
  portId: string;
  terminalId: string;
  createdUserId: string;
  updatedUserId: string;
  portStateControlRequests: PortStateControlRequest[];
  portStateInspectionReports: { id: string; finding: string; status: string }[];
}

export interface UpdateVesselScreeningParamsPortStateControl {
  id: string;
  data: PortStateControlRequest;
  handleSuccess?: () => void;
}

export interface VesselComment {
  id: string;
  comment: string;
  createdAt: string;
  createdUser: { id: string; username: string; jobTitle: string };
}

export interface GetListVesselScreeningPortStateControl {
  list: {
    data: VesselScreeningPortStateControl[];
    page: number;
    pageSize: number;
    totalPage: number;
    totalItem: number;
  };
  risk: Risk[];
}

export interface VesselPortStateControlStoreModel {
  loading: boolean;
  disable: boolean;
  dataFilter: CommonApiParam;
  list: GetListVesselScreeningPortStateControl;
  portStateRequestDetail: PortStateControlRequest;
  params: CommonApiParam;
  errors: ErrorField[];
}
