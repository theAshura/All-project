import { ErrorField } from 'models/common.model';
import { Vessel } from 'models/api/vessel/vessel.model';

export interface Injury {
  refId: string;
  id: string;
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
  isNew?: boolean;
  resetForm?: () => void;
  vessel: Vessel;
  vesselId: string;
  sno?: number;
}

export interface InjuryMaster {
  id: string;
  code: string;
  name: string;
  lti: boolean;
}

export interface InjuryBody {
  id: string;
  code: string;
  name: string;
}

export interface CreateInjuryParams {
  injuryMasterId: string;
  lostTime: string;
  eventTitle: string;
  injuryDate: string;
  departmentId: string;
  locationId: string;
  injuredBodyPartIds: string;
  causes: string;
  countermeasures: string;
  attachments: string[];
  resetForm?: () => void;
  afterCreate?: () => void;
}

export interface GetInjuryResponse {
  data: Injury[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface GetInjuryMasterResponse {
  data: InjuryMaster[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface GetInjuryBodyResponse {
  data: InjuryBody[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface UpdateInjuryParams {
  id: string;
  data: CreateInjuryParams;
  resetForm?: () => void;
  afterUpdate?: () => void;
}

export interface ErrorResponsive {
  errorList: ErrorField[];
}

export interface InjuryDetailResponse {
  injuryRequests: any;
  id: string;
  createdAt: string;
  updatedAt: string;
  injuryMasterId: string;
  lostTime: string;
  eventTitle: string;
  injuryDate: string;
  departmentId: string;
  locationId: string;
  causes: string;
  countermeasures: string;
  attachments: string[];
  createdUserId: string;
  updatedUserId: null;
  companyId: string;
  injuryMaster: {
    id: string;
    code: string;
    name: string;
    lti: boolean;
  };
  department: {
    id: string;
    code: string;
    name: string;
  };
  location: {
    id: string;
    code: string;
    name: string;
  };
  injuredBodyPart: {
    name: string;
    code: string;
    id: string;
  };
  vessel: {
    code: string;
    imoNumber: string;
    name: string;
  };
  vesselId: string;
}
