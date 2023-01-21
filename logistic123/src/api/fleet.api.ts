import { requestAuthorized } from 'helpers/request';
import {
  GetFleetsParams,
  GetFleetsResponse,
  GetCompanysResponse,
  Company,
  CreateFleetParams,
  FleetDetailResponse,
  UpdateFleetParams,
  GetCompanysParams,
} from 'models/api/fleet/fleet.model';
import queryString from 'query-string';
import {
  ASSETS_API_FLEET,
  ASSETS_API_COMPANY,
} from './endpoints/config.endpoint';

export const getListFleetsActionsApi = (dataParams: GetFleetsParams) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetFleetsResponse>(
    `${ASSETS_API_FLEET}?${params}`,
  );
};

export const getListCompanyActionsApi = (dataParams: GetCompanysParams) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetCompanysResponse>(
    `${ASSETS_API_COMPANY}?${params}`,
  );
};

export const deleteFleetActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_FLEET}/${dataParams}`);

export const createFleetActionsApi = (dataParams: CreateFleetParams) =>
  requestAuthorized
    .post<void>(ASSETS_API_FLEET, dataParams)
    .catch((error) => Promise.reject(error));

export const getFleetDetailActionsApi = (id: string) =>
  requestAuthorized.get<FleetDetailResponse>(`${ASSETS_API_FLEET}/${id}`);

export const updateFleetPermissionDetailActionsApi = (
  dataParams: UpdateFleetParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_FLEET}/${dataParams.id}`,
    dataParams.data,
  );

export const getListSubCompanyApi = (dataParams: GetCompanysParams) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<Company[]>(
    `${ASSETS_API_COMPANY}/sub-company?${params}`,
  );
};
