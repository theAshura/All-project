import { requestAuthorized } from 'helpers/request';
import {
  ListShoreRankResponse,
  ShoreRank,
} from 'models/api/shore-rank/shore-rank.model';
import { CommonApiParam } from 'models/common.model';

import queryString from 'query-string';
import { ASSETS_API_SHORE_RANK } from './endpoints/config.endpoint';

export const getListShoreRankActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<ListShoreRankResponse>(
    `${ASSETS_API_SHORE_RANK}?${params}`,
  );
};

export const deleteShoreRankActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_SHORE_RANK}/${dataParams}`);

export const createShoreRankActionsApi = (dataParams: ShoreRank) =>
  requestAuthorized
    .post<ShoreRank>(ASSETS_API_SHORE_RANK, dataParams)
    .catch((error) => Promise.reject(error));

export const getDetailShoreRankActionApi = (id: string) =>
  requestAuthorized.get<ShoreRank>(`${ASSETS_API_SHORE_RANK}/${id}`);

export const updateShoreRankActionApi = (id: string, data: ShoreRank) =>
  requestAuthorized
    .put<void>(`${ASSETS_API_SHORE_RANK}/${id}`, data)
    .catch((error) => Promise.reject(error));
