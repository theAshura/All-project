import { requestAuthorized } from 'helpers/request';
import {
  GetStandardMastersParams,
  GetStandardMastersResponse,
  CreateStandardMasterParams,
  StandardMasterDetailResponse,
  UpdateStandardMasterParams,
} from 'models/api/standard-master/standard-master.model';
import queryString from 'query-string';
import { ASSETS_API_STANDARD_MASTER } from './endpoints/config.endpoint';

// const params = queryString.stringify({ lang: 'en' });

export const getListStandardMasterActionsApi = (
  dataParams: GetStandardMastersParams,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetStandardMastersResponse>(
    `${ASSETS_API_STANDARD_MASTER}?${params}`,
  );
};

export const deleteStandardMasterActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_STANDARD_MASTER}/${dataParams}`);

export const createStandardMasterActionsApi = (
  dataParams: CreateStandardMasterParams,
) =>
  requestAuthorized
    .post<void>(ASSETS_API_STANDARD_MASTER, dataParams)
    .catch((error) => Promise.reject(error));

export const getStandardMasterDetailActionsApi = (id: string) =>
  requestAuthorized.get<StandardMasterDetailResponse>(
    `${ASSETS_API_STANDARD_MASTER}/${id}`,
  );

export const updateStandardMasterDetailActionsApi = (
  dataParams: UpdateStandardMasterParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_STANDARD_MASTER}/${dataParams.id}`,
    dataParams.data,
  );
