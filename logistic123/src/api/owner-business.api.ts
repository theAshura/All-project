import { requestAuthorized } from 'helpers/request';
import {
  GetOwnerBusinessResponse,
  CreateOwnerBusinessParams,
  OwnerBusinessDetailResponse,
  UpdateOwnerBusinessParams,
} from 'models/api/owner-business/owner-business.model';
import { CommonApiParam } from 'models/common.model';
import queryString from 'query-string';
import { ASSETS_API_OWNER_BUSINESS } from './endpoints/config.endpoint';

export const getListOwnerBusinessApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetOwnerBusinessResponse>(
    `${ASSETS_API_OWNER_BUSINESS}?${params}`,
  );
};

export const deleteOwnerBusinessApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_OWNER_BUSINESS}/${dataParams}`);

export const createOwnerBusinessApi = (dataParams: CreateOwnerBusinessParams) =>
  requestAuthorized
    .post<void>(ASSETS_API_OWNER_BUSINESS, dataParams)
    .catch((error) => Promise.reject(error));

export const getOwnerBusinessDetailActionsApi = (id: string) =>
  requestAuthorized.get<OwnerBusinessDetailResponse>(
    `${ASSETS_API_OWNER_BUSINESS}/${id}`,
  );

export const updateOwnerBusinessPermissionDetailActionsApi = (
  dataParams: UpdateOwnerBusinessParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_OWNER_BUSINESS}/${dataParams.id}`,
    dataParams.data,
  );
