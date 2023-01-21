import { ErrorField, CommonApiParam } from 'models/common.model';
import { Risk, CommonType, IComment } from './common.model';

export interface InternalInspectionsRequests {
  IIRComments: IComment[];
  comments: IComment[];
  id?: string;
  vesselScreeningId: string;
  potentialRisk: number;
  potentialScore: number;
  observedRisk: number;
  observedScore: number;
  timeLoss: boolean;
  internalInspectionsId: string;
}

export interface Vessel {
  imoNumber: string;
  code: string;
  name: string;
  vesselType: CommonType;
  fleet: CommonType;
}

export interface VesselScreeningInternalInspection {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  eventTypeId?: string;
  vesselId?: string;
  inspectionDateFrom?: Date;
  inspectionDateTo?: Date;
  portId?: string;
  status?: string;
  nextInspectionDue?: Date;
  refId?: string;
  attachments?: string[];
  createdUserId?: string;
  updatedUserId?: any;
  companyId: string;
  eventType?: CommonType;
  vessel: Vessel;
  internalInspectionsRequests: InternalInspectionsRequests[];
}

export interface GetVesselScreeningInternalInspectionsResponse {
  data: VesselScreeningInternalInspection[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
  risk: Risk[];
}
export interface UpdateInternalInspectionRequestParams {
  id: string;
  data: {
    internalInspectionsId: string;
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

export interface VesselInternalInspectionStoreModel {
  loading: boolean;
  params: CommonApiParam;
  listInternalInspections: GetVesselScreeningInternalInspectionsResponse;
  internalInspectionDetail: VesselScreeningInternalInspection;
  internalInspectionRequestDetail: InternalInspectionsRequests;
  errorList: ErrorField[];
  dataFilter: CommonApiParam;
}
