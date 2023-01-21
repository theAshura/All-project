import {
  CreateExternalParams,
  DeleteExternalParams,
  GetExternalParams,
  UpdateExternalParams,
} from 'models/api/external/external.model';
import queryString from 'query-string';
import { requestAuthorized } from 'helpers/request';
import { ASSETS_API_EXTERNAL } from './endpoints/config.endpoint';

export const getListExternalActionsApi = (dataParams: GetExternalParams) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<any>(`${ASSETS_API_EXTERNAL}?${params}`);
};
export const createExternalActionsApi = (body: CreateExternalParams) =>
  requestAuthorized.post<void>(ASSETS_API_EXTERNAL, body);
export const updateExternalActionsApi = (updateParams: UpdateExternalParams) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_EXTERNAL}/${updateParams?.id}`,
    updateParams?.data,
  );
export const deleteExternalActionsApi = (params: DeleteExternalParams) =>
  requestAuthorized.delete<void>(`${ASSETS_API_EXTERNAL}/${params.id}`);

export const getDetailExternalActionsApi = (id: string) =>
  requestAuthorized.get<any>(`${ASSETS_API_EXTERNAL}/${id}`);
