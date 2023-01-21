import queryString from 'query-string';
import { requestAuthorized } from 'helpers/request';
import { ASSETS_API_VOYAGE_INFO } from 'api/endpoints/config.endpoint';
import {
  GetVoyageInfoResponse,
  VoyageInfoDetailResponse,
} from '../models/voyage-info.model';

export const getListVoyageInfoActionsApi = (
  dataParams: GetVoyageInfoResponse,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetVoyageInfoResponse>(
    `${ASSETS_API_VOYAGE_INFO}?${params}`,
  );
};

export const getVoyageInfoDetailActionsApi = (id: string) =>
  requestAuthorized.get<VoyageInfoDetailResponse>(
    `${ASSETS_API_VOYAGE_INFO}/${id}`,
  );
