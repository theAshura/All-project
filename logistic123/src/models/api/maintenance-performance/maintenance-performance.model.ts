import { Vessel } from 'models/api/vessel/vessel.model';

export interface Authority {
  name: string;
}

export interface CreatedUser {
  username: string;
}

export interface MaintenancePerformance {
  refId: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  eventType: string;
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
  createdUser: CreatedUser;
  updatedUser: CreatedUser;
  vessel: Vessel;
  vesselId: string;
}

export interface CreateMaintenancePerformanceParams {
  eventType: string;
  recordDate: Date;
  periodFrom: Date;
  periodTo: Date;
  totalPlannedJobs: number;
  overdueCriticalJobs: number;
  overdueJobs: number;
  remarks: string;
  attachments: string[];
  handleSuccess: () => void;
}
export interface UpdateMaintenancePerformanceParams {
  body: CreateMaintenancePerformanceParams;
  id: string;
  handleSuccess: () => void;
}

export interface GetDetailMaintenancePerformance {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  eventType: string;
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
  createdUser: CreatedUser;
  updatedUser: CreatedUser;
}
export interface DeleteMaintenancePerformanceParams {
  id: string;
  handleSuccess: () => void;
}

export interface GetMaintenancePerformanceResponse {
  data: MaintenancePerformance[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}
