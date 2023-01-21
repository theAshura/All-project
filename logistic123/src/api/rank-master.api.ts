import { requestAuthorized } from 'helpers/request';
import queryString from 'query-string';
import { CommonApiParam } from 'models/common.model';
import {
  RankMaster,
  ListRankMasterResponse,
  UpdateRankMasterParams,
} from 'models/api/rank-master/rank-master.model';
import { ASSETS_API_RANK } from './endpoints/config.endpoint';

export const getListRankMasterActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<ListRankMasterResponse>(
    `${ASSETS_API_RANK}?${params}`,
  );
};

export const deleteRankMasterActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_RANK}/${dataParams}`);

export const createRankMasterActionsApi = (dataParams: RankMaster) =>
  requestAuthorized
    .post<RankMaster>(ASSETS_API_RANK, dataParams)
    .catch((error) => Promise.reject(error));

export const getDetailRankMasterActionApi = (id: string) =>
  requestAuthorized.get<RankMaster>(`${ASSETS_API_RANK}/${id}`);

export const updateRankMasterActionApi = (dataParams: UpdateRankMasterParams) =>
  requestAuthorized
    .put<void>(`${ASSETS_API_RANK}/${dataParams.id}`, dataParams.data)
    .catch((error) => Promise.reject(error));
