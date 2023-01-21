import {
  CommonApiParam,
  ErrorField,
  IStepHistory,
  UserAssignments,
} from 'models/common.model';
import { Port } from 'models/api/port/port.model';
import { IComment } from 'pages/vessel-screening/utils/models/common.model';
import { Vessel } from 'models/api/vessel/vessel.model';
import { IncidentsStatuses } from 'constants/components/incidents.const';

export interface Company {
  name: string;
  companyIMO: string;
}

export interface TypeIncidents {
  id?: string;
  code?: string;
  name?: string;
}

export interface ByUser {
  username: string;
}

export interface RemarkType {
  id?: string;
  remark: string;
  createdAt?: string;
  createdUser?: {
    email: string;
    id: string;
    jobTitle: string;
    username: string;
  };
  updatedAt?: Date | string;
  updatedUser?: {
    email: string;
    id: string;
    jobTitle: string;
    username: string;
  };
}

export interface RiskFactor {
  id?: string;
  name?: string;
  code?: string;
}
export interface Fleet {
  code: string;
  name: string;
}

export interface ReviewType {
  id?: string;
  remark: string;
  riskFactorId: string;
  riskFactor?: RiskFactor;
  vesselAcceptable: boolean | string;
  incidentStatus: string;
  attachments: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
  incidentInvestigationId?: string;
}

export interface IncidentsAssignment {
  usersPermissions: {
    permission: string;
    userIds: string[];
  }[];
}

export interface IncidentDetail {
  id: string;
  createdAt: Date | string;
  status: IncidentsStatuses;
  incidentInvestigationHistories?: IStepHistory[];
  updatedAt: Date | string;
  createdUser: ByUser;
  updatedUser: ByUser;
  description: string;
  userAssignments?: UserAssignments[];
  title: string;
  voyageNo: string;
  totalNumberOfCrew: number;
  dateTimeOfIncident: Date | string;
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
  actionControlNeeds?: string;
  immediateAction: string;
  preventiveAction: string;
  correctionAction: string;
  companyId: string;
  vesselId: string;
  portId: string;
  reviewStatus: string;
  portToId: string;
  company: Company;
  vessel: Vessel;
  port: Port;
  portTo: Port;
  refId: string;
  sNo: string;
  typeIncidents: TypeIncidents[];
  incidentInvestigationRemarks: RemarkType[];
  incidentInvestigationReviews: ReviewType[];
  incidentInvestigationComments: IComment[];
  potentialRisk: number;
  potentialScore: number;
  observedRisk: number;
  observedScore: number;
  timeLoss: boolean;
  attachments: string[];
  createdUserId: string;
}

export interface Risk {
  risk: number;
  count: string;
}

export interface GetListIncidentResponse {
  data: IncidentDetail[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
  risk: Risk[];
}

export interface CreateIncidentParams {
  incidentId?: string;
  vesselId?: string;
  description: string;
  title: string;
  status?: IncidentsStatuses;
  voyageNo: string;
  totalNumberOfCrew: number;
  dateTimeOfIncident: Date | string;
  typeIds: string[];
  otherType: string;

  userAssignment?: IncidentsAssignment;
  atPort: boolean;
  portId: string;
  userAs;
  portToId: string;
  latitude?: string;
  longitude?: string;
  typeOfLoss: string;
  immediateDirectCause: string;
  basicUnderlyingCauses: string;
  rootCause: string;
  contributionFactor: string;
  nonContributionFactor: string;
  actionControlNeeds: string;
  immediateAction: string;
  preventiveAction: string;
  correctionAction: string;
  remarks: RemarkType[];
  reviews: ReviewType[];
  comments?: IComment[];
  potentialRisk: number;
  potentialScore?: number;
  observedRisk: number;
  observedScore?: number;
  timeLoss: boolean;
  reviewStatus: string;
  attachments: string[];
  handleSuccess?: () => void;
}

export interface UpdateIncidentParams {
  id: string;
  data: CreateIncidentParams;
  handleSuccess?: () => void;
}

// summary

export interface NumberIncident {
  timeRange: Date;
  total: string;
}

export interface IncidentPlace {
  atPort: string;
  atSea: string;
}

export interface TypeOfIncident {
  typeName: string;
  total: string;
}

export interface ReviewStatus {
  reviewStatus: string;
  total: string;
}

export interface RiskDetail {
  risk: number;
  count: string;
}

export interface PilotStatus {
  status: string;
  total: string;
}

export interface PilotFeedBackAverageScore {
  average: string;
}

// store

export interface IncidentStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  listIncident: GetListIncidentResponse;
  incidentDetail: IncidentDetail;
  errorList: ErrorField[];
  dataFilter: CommonApiParam;
  numberIncident: NumberIncident[];
  incidentPlace: IncidentPlace[];
  typeOfIncident: TypeOfIncident[];
  reviewStatus: ReviewStatus[];
  riskDetails: RiskDetail[];
}
