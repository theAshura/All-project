import { VesselCharterers, VesselOwners } from '../vessel/vessel.model';

export interface EventType {
  code?: string;
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
  vesselCharterers?: VesselCharterers[];
  vesselOwners?: VesselOwners[];
  vesselDocHolders?: VesselOwners[];
  entityType: string;
  createdAt: Date;
}

export interface Port {
  id?: string;
  code: string;
  name: string;
  country: string;
}

export interface ParamsList {
  page?: number;
  pageSize?: number;
  content?: string;
  status?: string;
  sort?: string;
  type?: string;
}

export interface CreateSailReportInspectionInternalParams {
  eventTypeId: string;
  vesselId: string;
  inspectionDateFrom: Date | string;
  inspectionDateTo: Date | string;
  nextInspectionDue: Date | string;
  status: string;
  portId: string;
  attachments: string[];
  handleSuccess?: () => void;
}

export interface UpdateSailReportInspectionInternalParams {
  id: string;
  data: CreateSailReportInspectionInternalParams;
  handleSuccess?: () => void;
}

export interface SailReportInspectionInternal {
  id: string;
  refId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  eventTypeId?: string;
  vesselId?: string;
  inspectionDateFrom?: Date;
  inspectionDateTo?: Date;
  nextInspectionDue?: Date;
  status?: string;
  portId?: string;
  createdUserId?: string;
  updatedUserId?: any;
  eventType?: EventType;
  vessel?: Vessel;
  port?: Port;
  attachments?: string[];
  vesselCharterers?: VesselCharterers[];
  vesselOwners?: VesselOwners[];
  vesselDocHolders?: VesselOwners[];
  entityType?: string;
}

export interface DeleteSailReportInspectionInternalParams {
  id: string;
  isDetail?: boolean;
  handleSuccess: () => void;
}

export interface GetSailReportInspectionInternalResponse {
  data: SailReportInspectionInternal[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface GetSailReportInspectionInternalParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  getList?: () => void;
}
