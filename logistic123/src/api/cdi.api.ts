import { CommonApiParam } from 'models/common.model';
import { requestAuthorized } from 'helpers/request';
import {
  GetCDIsResponse,
  CreateCDIParams,
  CDIDetailResponse,
  UpdateCDIParams,
} from 'models/api/cdi/cdi.model';
import queryString from 'query-string';
import { ASSETS_API_CDI } from './endpoints/config.endpoint';

export const getListCDIsActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetCDIsResponse>(`${ASSETS_API_CDI}?${params}`);
};

export const deleteCDIActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_CDI}/${dataParams}`);

export const createCDIActionsApi = (dataParams: CreateCDIParams) =>
  requestAuthorized
    .post<void>(ASSETS_API_CDI, dataParams)
    .catch((error) => Promise.reject(error));

export const getCDIDetailActionsApi = (id: string) =>
  requestAuthorized.get<CDIDetailResponse>(`${ASSETS_API_CDI}/${id}`);

export const updateCDIPermissionDetailActionsApi = (
  dataParams: UpdateCDIParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_CDI}/${dataParams.id}`,
    dataParams.data,
  );
