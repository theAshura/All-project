import { requestAuthorized } from 'helpers/request';
import {
  GetShipDirectResponsiblesResponse,
  CreateShipDirectResponsibleParams,
  ShipDirectResponsibleDetailResponse,
  UpdateShipDirectResponsibleParams,
} from 'models/api/ship-direct-responsible/ship-direct-responsible.model';
import queryString from 'query-string';
import { CommonApiParam } from 'models/common.model';
import { ASSETS_API_SHIP_DIRECT_RESPONSIBLE } from './endpoints/config.endpoint';

export const getListShipDirectResponsiblesActionsApi = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetShipDirectResponsiblesResponse>(
    `${ASSETS_API_SHIP_DIRECT_RESPONSIBLE}?${params}`,
  );
};

export const deleteShipDirectResponsibleActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(
    `${ASSETS_API_SHIP_DIRECT_RESPONSIBLE}/${dataParams}`,
  );

export const createShipDirectResponsibleActionsApi = (
  dataParams: CreateShipDirectResponsibleParams,
) =>
  requestAuthorized
    .post<void>(ASSETS_API_SHIP_DIRECT_RESPONSIBLE, dataParams)
    .catch((error) => Promise.reject(error));

export const getShipDirectResponsibleDetailActionsApi = (id: string) =>
  requestAuthorized.get<ShipDirectResponsibleDetailResponse>(
    `${ASSETS_API_SHIP_DIRECT_RESPONSIBLE}/${id}`,
  );

export const updateShipDirectResponsiblePermissionDetailActionsApi = (
  dataParams: UpdateShipDirectResponsibleParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_SHIP_DIRECT_RESPONSIBLE}/${dataParams.id}`,
    dataParams.data,
  );
