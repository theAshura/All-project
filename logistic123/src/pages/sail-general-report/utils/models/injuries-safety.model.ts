import { ErrorField, CommonApiParam } from 'models/common.model';
import { IComment, Risk } from './common.model';

export interface InjuriesSafetyRequests {
  comments: IComment[];
  IRComments: IComment[];
  id?: string;
  vesselScreeningId?: string;
  injuryId?: string;
  potentialRisk?: number;
  potentialScore?: number;
  observedRisk?: number;
  observedScore?: number;
  timeLoss?: boolean;
}

export interface Inspector {
  id: string;
  firstName: string;
  lastName: string;
}

export interface VesselScreeningInjuriesSafety {
  id?: string;
  createdAt: string;
  updatedAt: string;
  injuryMasterId: string;
  lostTime: string;
  eventTitle: string;
  departmentId: string;
  locationId: string;
  injuredBodyPart: {
    name: string;
    code: string;
    id: string;
  };
  causes: string;
  countermeasures: string;
  attachments: string[];
  createdUserId: string;
  updatedUserId: string;
  injuryDate: string;
  department: {
    name: string;
    code: string;
    id: string;
  };
  injuryMaster: {
    name: string;
    code: string;
    id: string;
    lti: boolean;
  };
  location: {
    name: string;
    code: string;
    id: string;
  };
  authority: {
    name: string;
  };
  vessel: {
    code: string;
    imoNumber: string;
    name: string;
  };
  vesselId: string;
  sno?: number;
  injuryRequests?: InjuriesSafetyRequests[];
}

export interface GetVesselScreeningInjuriesSafetyResponse {
  data: VesselScreeningInjuriesSafety[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
  risk: Risk[];
}
export interface UpdateInjuriesSafetyRequestParams {
  id: string;
  data: {
    injuryId: string;
    vesselScreeningId: string;
    potentialRisk: number;
    potentialScore?: number;
    observedRisk: number;
    observedScore?: number;
    timeLoss: boolean;
    comments: IComment[];
  };
  handleSuccess?: () => void;
}

export interface VesselInjuriesSafetyStoreModel {
  loading: boolean;
  params: CommonApiParam;
  listInjuriesSafety: GetVesselScreeningInjuriesSafetyResponse;
  injuriesSafetyDetail: VesselScreeningInjuriesSafety;
  injuriesSafetyRequestDetail: InjuriesSafetyRequests;
  errorList: ErrorField[];
  dataFilter: CommonApiParam;
}
