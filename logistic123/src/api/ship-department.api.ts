import { requestAuthorized } from 'helpers/request';
import {
  GetShipDepartmentsParams,
  GetShipDepartmentsResponse,
  CreateShipDepartmentParams,
  ShipDepartmentDetailResponse,
  UpdateShipDepartmentParams,
} from 'models/api/ship-department/ship-department.model';
import queryString from 'query-string';
import { ASSETS_API_SHIP_DEPARTMENT } from './endpoints/config.endpoint';

export const getListShipDepartmentsActionsApi = (
  dataParams: GetShipDepartmentsParams,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetShipDepartmentsResponse>(
    `${ASSETS_API_SHIP_DEPARTMENT}?${params}`,
  );
};

export const deleteShipDepartmentActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_SHIP_DEPARTMENT}/${dataParams}`);

export const createShipDepartmentActionsApi = (
  dataParams: CreateShipDepartmentParams,
) =>
  requestAuthorized
    .post<void>(ASSETS_API_SHIP_DEPARTMENT, dataParams)
    .catch((error) => Promise.reject(error));

export const getShipDepartmentDetailActionsApi = (id: string) =>
  requestAuthorized.get<ShipDepartmentDetailResponse>(
    `${ASSETS_API_SHIP_DEPARTMENT}/${id}`,
  );

export const updateShipDepartmentPermissionDetailActionsApi = (
  dataParams: UpdateShipDepartmentParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_SHIP_DEPARTMENT}/${dataParams.id}`,
    dataParams.data,
  );
