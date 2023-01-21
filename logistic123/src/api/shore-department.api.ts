import queryString from 'query-string';
import { requestAuthorized } from 'helpers/request';
import {
  GetListShoreDepartmentResponse,
  GetListShoreDepartmentParams,
  CreateShoreBody,
  EditShoreParams,
  ShoreDepartment,
} from 'models/api/shore-department/shore-department.model';
import { ASSETS_API_SHORE_DEPARTMENT } from './endpoints/config.endpoint';

export const getListShoreDepartmentApi = (
  dataParams: GetListShoreDepartmentParams,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetListShoreDepartmentResponse>(
    `${ASSETS_API_SHORE_DEPARTMENT}?${params}`,
  );
};

export const getShoreDepartmentDetailApi = (id: string) =>
  requestAuthorized.get<ShoreDepartment>(
    `${ASSETS_API_SHORE_DEPARTMENT}/${id}`,
  );

export const deleteShoreDepartmentApi = (id: string) =>
  requestAuthorized.delete(`${ASSETS_API_SHORE_DEPARTMENT}/${id}`);

export const updateShoreDepartmentApi = (dataParams: EditShoreParams) =>
  requestAuthorized.put(
    `${ASSETS_API_SHORE_DEPARTMENT}/${dataParams.id}`,
    dataParams.body,
  );

export const createShoreDepartmentApi = (body: CreateShoreBody) =>
  requestAuthorized.post(ASSETS_API_SHORE_DEPARTMENT, body);
