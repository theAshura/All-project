import {
  GetAllGroupParams,
  GetAllGroupResponse,
} from 'models/api/group/group.model';
import { CommonApiParam, CommonMessageErrorResponse } from '../../common.model';

export interface GroupManagementStore {
  loading: boolean;
  listGroup: GetAllGroupResponse;
  params: CommonApiParam;
  messageError: CommonMessageErrorResponse[];
}

export type GetAllGroupPayload = GetAllGroupParams;

export interface CreateGroupBody {
  code?: string;
  name?: string;
  description?: string;
}
