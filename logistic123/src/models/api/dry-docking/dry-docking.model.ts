import { Vessel } from 'models/api/vessel/vessel.model';

export interface Authority {
  name: string;
}
export interface PortMaster {
  code: string;
  name: string;
  country: string;
}

export interface DryDocking {
  refId: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  eventType: string;
  plannedDate: Date;
  actualDateFrom: Date;
  actualDateTo: Date;
  portMasterId: string;
  remarks?: string;
  status: string;
  completedDate: Date;
  completionRemarks?: string;
  attachments: string[];
  createdUserId: string;
  updatedUserId?: any;
  companyId: string;
  portMaster: PortMaster;
  vessel: Vessel;
  vesselId: string;
}

export interface CreateDryDockingParams {
  eventType: string;
  plannedDate: string;
  actualDateFrom: string;
  actualDateTo: string;
  portMasterId: string;
  remarks?: string;
  status: string;
  completedDate: string;
  completionRemarks?: string;
  attachments?: string[];
  afterCreate: () => void;
}
export interface UpdateDryDockingParams {
  body: {
    eventType: string;
    plannedDate: string;
    actualDateFrom: string;
    actualDateTo: string;
    portMasterId: string;
    remarks?: string;
    status: string;
    completedDate: string;
    completionRemarks?: string;
    attachments?: string[];
  };
  id: string;
  afterUpdate: () => void;
}

export interface GetDetailDryDocking {
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
  updatedUserId?: string;
  companyId: string;
  portMaster: PortMaster;
  vessel: Vessel;
}
export interface DeleteDryDockingParams {
  id: string;
  afterDelete: () => void;
}

export interface GetDryDockingResponse {
  data: DryDocking[];
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
export interface GetDryDockingParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  getList?: () => void;
}
