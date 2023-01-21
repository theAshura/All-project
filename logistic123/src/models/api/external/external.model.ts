import { CompanyObject } from 'models/common.model';
import { VesselCharterers, VesselOwners } from 'models/api/vessel/vessel.model';

export interface Authority {
  name: string;
}
export interface PortMaster {
  code: string;
  name: string;
  country: string;
}

export interface Company {
  name: string;
}

export interface EventType {
  code: string;
  name: string;
}

export interface VesselType {
  code: string;
}

export interface Fleet {
  code: string;
  name: string;
}

export interface Vessel {
  code: string;
  name: string;
  vesselType: VesselType;
  fleet: Fleet;
  imoNumber: string;
}

export interface Port {
  id: string;
  code: string;
  name: string;
  country: string;
}

export interface PscDeficiency {
  id: string;
  code: string;
  name?: any;
}

export interface PscAction {
  id: string;
  code: string;
  name: string;
  company?: CompanyObject;
}
export interface Viq {
  id: string;
  viqVesselType: string;
}
export interface ExternalInspectionReportsDetail {
  id: string;
  finding: string;
  estimatedCompletion: Date;
  actualCompletion: Date;
  status: string;
  pscDeficiency: PscDeficiency;
  pscAction: PscAction;
  viq: Viq;
}
export interface External {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  eventTypeId: string;
  dateOfInspection: Date;
  noFindings: boolean;
  refId: string;
  comment: string;
  isPort: boolean;
  authorityId: string;
  companyId: string;
  vesselId: string;
  portId: string;
  terminalId?: any;
  createdUserId: string;
  updatedUserId?: any;
  company: Company;
  eventType: EventType;
  vessel: Vessel;
  port: Port;
  terminal?: any;
  attachments: string[];
  inspectorName: string;
  externalInspectionReports: ExternalInspectionReportsDetail[];
}
export interface ExternalInspectionReports {
  id: string;
  pscDeficiencyId: string;
  pscActionId: string;
  finding: string;
  viqId: string;
  estimatedCompletion: string;
  actualCompletion: string;
  status: string;
  mainCategoryId?: string;
  pscAction?: {
    code: string;
    id: string;
    name: string;
  };
  pscDeficiency?: {
    code: string;
    id: string;
    name: string;
  };
  viq?: {
    id: string;
    viqVesselType: string;
  };
  mainCategory?: any;
}

export interface CreateExternalParams {
  vesselId: string;
  eventTypeId: string;
  authorityId: string;
  dateOfInspection: string;
  noFindings: boolean;
  inspectorName: string;
  comment: string;
  isPort: boolean;
  portId?: string;
  terminalId?: string;
  attachments: string[];
  externalInspectionReports?: ExternalInspectionReports[];
  afterCreate: () => void;
  handleSuccess?: () => void;
}
export interface UpdateExternalParams {
  id?: string;
  data: CreateExternalParams;
  resetForm?: () => void;
  handleSuccess?: () => void;
}

export interface GetDetailExternal {
  id: string;
  createdAt: string;
  updatedAt: string;
  eventTypeId: string;
  dateOfInspection: string;
  noFindings: boolean;
  refId: string;
  comment: string;
  isPort: boolean;
  authority: { name: string };
  authorityId: string;
  companyId: string;
  vesselId: string;
  portId: string;
  terminalId: string;
  createdUserId: string;
  updatedUserId: string;
  company: {
    name: string;
  };
  eventType: {
    code: string;
    name: string;
  };
  vessel: {
    code: string;
    name: string;
    imoNumber: string;
    vesselCharterers?: VesselCharterers[];
    vesselOwners?: VesselOwners[];
    vesselDocHolders?: VesselOwners[];
  };
  port: {
    id: string;
    code: string;
    name: string;
    country: string;
  };
  terminal: null;
  inspectorName: string;
  attachments: string[];
  externalInspectionReports: ExternalInspectionReports[];
}
export interface DeleteExternalParams {
  id: string;
  afterDelete: () => void;
}

export interface GetExternalResponse {
  data: External[];
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
  sort?: string;
  type?: string;
}
export interface GetExternalParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  getList?: () => void;
}
