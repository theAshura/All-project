import { CompanyObject } from 'models/common.model';

export interface Role {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  status: string;
  companyId: string;
}

export interface WorkflowRole {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  workflowId: string;
  roleId: string;
  permission: string;
  createdUserId: string;
  updatedUserId: string;
  role: Role;
}

export interface WorkflowRoleDetail {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  companyId: string;
  workflowType: string;
  approverType: string;
  status: string;
  createdUserId: string;
  updatedUserId: string;
  description: string;
  version: string;
  workflowRoles: WorkflowRole[];
}

export interface WorkFlow {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  companyId: string;
  workflowType: string;
  approverType: string;
  status: string;
  createdUserId: string;
  updatedUserId: string;
  description: string;
  version: string;
  company?: CompanyObject;
}

// export interface WorkFlow {
//   id?: string;
//   code?: string;
//   name?: string;
//   vettingRiskScore?: number;
//   status?: string;
//   description?: string;
//   createdAt?: Date;
//   createdBy?: string;
//   createdName?: string;
//   updatedAt?: Date;
//   createdUser?: {
//     username?: string;
//   };
//   updatedUser?: {
//     username?: string;
//   };
//   updatedBy?: string;
//   updatedName?: string;
//   isNew?: boolean;
//   resetForm?: () => void;
// }

export interface ListWorkFlowResponse {
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
  data: Array<WorkFlow>;
}
export interface ParamsListWorkFlow {
  page?: number;
  pageSize?: number;
  content?: string;
  status?: string;
  sort?: string;
  vettingRiskScore?: number;
}
export interface GetWorkFlowParams {
  isRefreshLoading?: boolean;
  paramsList?: ParamsListWorkFlow;
  getList?: () => void;
}

export interface WorkflowRoles {
  roleId: string;
  permission: string;
}

export interface CreateWorkflowParams {
  id?: string;
  workflowType: string;
  approverType?: string;
  description?: string;
  workflowRoles?: WorkflowRoles[];
  resetForm?: () => void;
}
