import { requestAuthorized } from 'helpers/request';
import {
  GetLocationsResponse,
  CreateLocationParams,
  LocationDetailResponse,
  UpdateLocationParams,
} from 'models/api/location/location.model';
import { CommonApiParam } from 'models/common.model';
import queryString from 'query-string';
import { ASSETS_API_LOCATION } from './endpoints/config.endpoint';

export const getListLocationsActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetLocationsResponse>(
    `${ASSETS_API_LOCATION}?${params}`,
  );
};

export const deleteLocationActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_LOCATION}/${dataParams}`);

export const createLocationActionsApi = (dataParams: CreateLocationParams) =>
  requestAuthorized
    .post<void>(ASSETS_API_LOCATION, dataParams)
    .catch((error) => Promise.reject(error));

export const getLocationDetailActionsApi = (id: string) =>
  requestAuthorized.get<LocationDetailResponse>(`${ASSETS_API_LOCATION}/${id}`);

export const updateLocationPermissionDetailActionsApi = (
  dataParams: UpdateLocationParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_LOCATION}/${dataParams.id}`,
    dataParams.data,
  );
