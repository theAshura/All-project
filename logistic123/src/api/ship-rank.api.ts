import { requestAuthorized } from 'helpers/request';
import {
  GetShipRanksParams,
  GetShipRanksResponse,
  CreateShipRankParams,
  ShipRankDetailResponse,
  UpdateShipRankParams,
} from 'models/api/ship-rank/ship-rank.model';
import queryString from 'query-string';
import { ASSETS_API_SHIP_RANK } from './endpoints/config.endpoint';

export const getListShipRanksActionsApi = (dataParams: GetShipRanksParams) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetShipRanksResponse>(
    `${ASSETS_API_SHIP_RANK}?${params}`,
  );
};

export const deleteShipRankActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_SHIP_RANK}/${dataParams}`);

export const createShipRankActionsApi = (dataParams: CreateShipRankParams) =>
  requestAuthorized
    .post<void>(ASSETS_API_SHIP_RANK, dataParams)
    .catch((error) => Promise.reject(error));

export const getShipRankDetailActionsApi = (id: string) =>
  requestAuthorized.get<ShipRankDetailResponse>(
    `${ASSETS_API_SHIP_RANK}/${id}`,
  );

export const updateShipRankPermissionDetailActionsApi = (
  dataParams: UpdateShipRankParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_SHIP_RANK}/${dataParams.id}`,
    dataParams.data,
  );
