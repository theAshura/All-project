import { Vessel } from 'models/api/condition-of-class/condition-of-class.model';
import { ErrorField, CommonApiParam } from 'models/common.model';
import { Risk, CommonType, IComment } from './common.model';

export interface ExternalInspectionsRequests {
  EIRComments: IComment[];
  comments?: IComment[];
  id?: string;
  vesselScreeningId: string;
  potentialRisk: number;
  potentialScore: number;
  observedRisk: number;
  observedScore: number;
  timeLoss: boolean;
  externalInspectionsId: string;
}

export interface Inspector {
  id: string;
  firstName: string;
  lastName: string;
}

export interface VesselScreeningExternalInspection {
  attachments: string[];
  id: string;
  authorityId: string;
  comment: string;
  companyId: string;
  createdAt?: Date;
  dateOfInspection: string;
  updatedAt?: Date;
  eventTypeId?: string;
  vesselId?: string;
  isPort: boolean;
  noFindings: boolean;
  portId?: string;
  status?: string;
  nextInspectionDue?: Date;
  refId?: string;
  terminalId: string;
  createdUserId?: string;
  updatedUserId?: any;
  eventType?: CommonType;
  externalInspectionReports: any[];
  inspectorName?: string;
  externalInspectionsRequests: ExternalInspectionsRequests[];
  vessel?: Vessel;
}

export interface GetVesselScreeningExternalInspectionsResponse {
  data: VesselScreeningExternalInspection[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
  risk: Risk[];
}
export interface UpdateExternalInspectionRequestParams {
  id: string;
  data: {
    externalInspectionsId: string;
    vesselScreeningId: string;
    potentialRisk?: number;
    potentialScore?: number;
    observedRisk?: number;
    observedScore?: number;
    timeLoss?: boolean;
    comments: IComment[];
  };
  handleSuccess?: () => void;
}

export interface VesselExternalInspectionStoreModel {
  loading: boolean;
  params: CommonApiParam;
  listExternalInspections: GetVesselScreeningExternalInspectionsResponse;
  externalInspectionDetail: VesselScreeningExternalInspection;
  externalInspectionRequestDetail: ExternalInspectionsRequests;
  errorList: ErrorField[];
  dataFilter: CommonApiParam;
}
