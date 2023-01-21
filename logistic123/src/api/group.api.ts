import queryString from 'query-string';
import { requestAuthorized } from 'helpers/request';
import {
  Group,
  GetAllGroupResponse,
  GetAllGroupParams,
  EditGroupParams,
  CreateGroupBody,
} from 'models/api/group/group.model';
import { ASSETS_API_GROUP } from './endpoints/config.endpoint';

export const getAllGroupApi = (dataParams: GetAllGroupParams) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetAllGroupResponse>(
    `${ASSETS_API_GROUP}?${params}`,
  );
};

export const createGroupApi = (body: CreateGroupBody) =>
  requestAuthorized.post(ASSETS_API_GROUP, body);

export const editGroupApi = (params: EditGroupParams) =>
  requestAuthorized.put(`${ASSETS_API_GROUP}/${params.id}`, params.body);

export const getGroupDetailApi = (id: string) =>
  requestAuthorized.get<Group>(`${ASSETS_API_GROUP}/${id}`);

export const deleteGroupApi = (id: string) =>
  requestAuthorized.delete(`${ASSETS_API_GROUP}/${id}`);
