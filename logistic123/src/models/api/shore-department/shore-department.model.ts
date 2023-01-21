import { CommonListParams } from 'models/common.model';

export interface ShoreDepartment {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  code: string;
  name: string;
  description: string;
  status: string;
  companyId: string;
  createdUser: { username: string };
  updatedUser: { username: string };
  createdUserId: string;
  updatedUserId: string;
}

export interface GetListShoreDepartmentResponse {
  data: ShoreDepartment[];
  page: number;
  pageSize: number;
  totalItem: number;
  totalPage: number;
}

export interface CreateShoreBody {
  code: string;
  name: string;
  description?: string;
  status?: string;
}
export interface EditShoreParams {
  id: string;
  body: CreateShoreBody;
}

export type GetListShoreDepartmentParams = CommonListParams & {
  status?: string;
};
