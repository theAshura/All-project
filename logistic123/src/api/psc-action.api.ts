import { requestAuthorized } from 'helpers/request';
import {
  GetPscActionParams,
  GetPscActionResponse,
  CreatePscActionParams,
  PscActionDetailResponse,
  UpdatePscActionParams,
} from 'models/api/psc-action/psc-action.model';
import queryString from 'query-string';
import { ASSETS_API_PSC_ACTION } from './endpoints/config.endpoint';

export const getListPscActionsApi = (dataParams: GetPscActionParams) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetPscActionResponse>(
    `${ASSETS_API_PSC_ACTION}?${params}`,
  );
};

export const deletePscActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_PSC_ACTION}/${dataParams}`);

export const createPscActionsApi = (dataParams: CreatePscActionParams) =>
  requestAuthorized
    .post<void>(ASSETS_API_PSC_ACTION, dataParams)
    .catch((error) => Promise.reject(error));

export const getPscActionDetailActionsApi = (id: string) =>
  requestAuthorized.get<PscActionDetailResponse>(
    `${ASSETS_API_PSC_ACTION}/${id}`,
  );

export const updatePscActionPermissionDetailActionsApi = (
  dataParams: UpdatePscActionParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_PSC_ACTION}/${dataParams.id}`,
    dataParams.data,
  );
