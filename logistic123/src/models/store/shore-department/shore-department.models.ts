import {
  GetListShoreDepartmentParams,
  GetListShoreDepartmentResponse,
} from 'models/api/shore-department/shore-department.model';
import { CommonApiParam, CommonMessageErrorResponse } from '../../common.model';

export interface ShoreDepartmentStore {
  loading: boolean;
  listShore: GetListShoreDepartmentResponse;
  params: CommonApiParam;
  messageError: CommonMessageErrorResponse[];
}

export type GetListShoreDepartmentPayload = GetListShoreDepartmentParams;

export interface CreateShoreDepartmentBody {
  code: string;
  name: string;
  description?: string;
  status?: string;
}
