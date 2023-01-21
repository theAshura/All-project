import queryString from 'query-string';
import { requestAuthorized } from 'helpers/request';
import {
  Group,
  GetAllGroupResponse,
  GetAllGroupParams,
  EditGroupParams,
} from 'models/api/group/group.model';
import { ASSETS_API_GROUP } from './endpoints/config.endpoint';

export const getInspectionFollowUpApi = (dataParams: GetAllGroupParams) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetAllGroupResponse>(
    `${ASSETS_API_GROUP}?${params}`,
  );
};

export const ediInspectionFollowUpApi = (params: EditGroupParams) =>
  requestAuthorized.put(`${ASSETS_API_GROUP}/${params.id}`, params.body);

export const getInspectionFollowUpDetailApi = (id: string) =>
  requestAuthorized.get<Group>(`${ASSETS_API_GROUP}/${id}`);

export const deleteInspectionFollowUpApi = (id: string) =>
  requestAuthorized.delete(`${ASSETS_API_GROUP}/${id}`);
