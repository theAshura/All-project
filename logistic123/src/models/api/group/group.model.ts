import { CommonListParams } from 'models/common.model';

export interface Group {
  id: string;
  createdAt: string;
  updatedAt: string;
  code: string;
  name: string;
  description: string;
  numCompanies: number;
  isNew?: boolean;
  afterCreate?: () => void;
  resetForm?: () => void;
}

export interface GetAllGroupResponse {
  data: Group[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export type GetAllGroupParams = CommonListParams;

export interface CreateGroupBody {
  code: string;
  name: string;
  description?: string;
  resetForm?: () => void;
  afterCreate?: () => void;
}

export interface EditGroupParams {
  id: string;
  body: CreateGroupBody;
  resetForm?: () => void;
  afterCreate?: () => void;
}
