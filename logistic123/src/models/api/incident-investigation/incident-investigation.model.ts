import { ErrorField } from 'models/common.model';
import { Port } from 'models/api/port/port.model';
import { IComment } from 'pages/vessel-screening/utils/models/common.model';
import {
  Vessel,
  VesselCharterers,
  VesselOwners,
} from 'models/api/vessel/vessel.model';

export interface ByUser {
  username: string;
}

export interface RemarkType {
  id?: string;
  remark: string;
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

export interface Company {
  name: string;
}

export interface TypeIncidents {
  id?: string;
  code?: string;
  name?: string;
}

export interface IncidentInvestigation {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  description: string;
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
  actionControlNeeds: string;
  immediateAction: string;
  preventiveAction: string;
  correctionAction: string;
  companyId: string;
  vesselId: string;
  portId: string;
  portToId: string;
  company: Company;
  vessel: Vessel;
  port: Port;
  portTo: Port;
  refId: string;
  sNo: string;
  typeIncidents: TypeIncidents[];
  incidentInvestigationRemarks: RemarkType[];
  vesselCharterers?: VesselCharterers[];
  vesselOwners?: VesselOwners[];
  vesselDocHolders?: VesselOwners[];
  createdUser: ByUser;
  updatedUser: ByUser;

  isNew?: boolean;
  handleSuccess?: () => void;
}

export interface GetIncidentInvestigationsResponse {
  data: IncidentInvestigation[];
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
export interface GetIncidentInvestigationsParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  getList?: () => void;
}

export interface CreateIncidentInvestigationParams {
  vesselId: string;
  description: string;
  title: string;
  voyageNo: string;
  totalNumberOfCrew: number;
  dateTimeOfIncident: Date | string;
  typeIds: string[];
  otherType: string;
  atPort: boolean;
  portId: string;
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
  comments: IComment[];
  handleSuccess?: () => void;
}

export interface UpdateIncidentInvestigationParams {
  id: string;
  data: CreateIncidentInvestigationParams;
  resetForm?: () => void;
  handleSuccess?: () => void;
}

export interface IncidentInvestigationDetailResponse {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  description: string;
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
  attachments: string[];

  timeLoss: boolean;
}

export interface ErrorResponsive {
  errorList: ErrorField[];
}
