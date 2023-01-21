import { CommonApiParam } from 'models/common.model';
import { requestAuthorized } from 'helpers/request';
import {
  GetVIQsResponse,
  CreateViqParams,
  ViqResponse,
  UpdateVIQParams,
} from 'models/api/viq/viq.model';
import queryString from 'query-string';
import {
  ASSETS_API_VIQ,
  ASSETS_API_PRIORITY_MASTER,
} from './endpoints/config.endpoint';

export const getListVIQsActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);

  return requestAuthorized.get<GetVIQsResponse>(`${ASSETS_API_VIQ}?${params}`);
};

export const getListPriorityActionsApi = () =>
  requestAuthorized.get<GetVIQsResponse>(`${ASSETS_API_PRIORITY_MASTER}`);

// viq CREATE & UPDATE & DELETE

export const createVIQActionsApi = (dataParams: CreateViqParams) =>
  requestAuthorized
    .post<void>(ASSETS_API_VIQ, dataParams)
    .catch((error) => Promise.reject(error));

export const updateVIQDetailActionsApi = (dataParams: UpdateVIQParams) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_VIQ}/${dataParams.id}`,
    dataParams.data,
  );

export const deleteVIQActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_VIQ}/${dataParams}`);

// detail

export const getVIQDetailActionsApi = (id: string) =>
  requestAuthorized.get<ViqResponse>(`${ASSETS_API_VIQ}/${id}`);
