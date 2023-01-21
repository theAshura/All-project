import { requestAuthorized } from 'helpers/request';
import {
  GetInjuryBodyParams,
  GetInjuryBodyResponse,
  CreateInjuryBodyParams,
  InjuryBodyDetailResponse,
  UpdateInjuryBodyParams,
} from 'models/api/injury-body/injury-body.model';
import queryString from 'query-string';
import { ASSETS_API_INJURY_BODY } from './endpoints/config.endpoint';

export const getListInjuryBodyActionsApi = (
  dataParams: GetInjuryBodyParams,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetInjuryBodyResponse>(
    `${ASSETS_API_INJURY_BODY}?${params}`,
  );
};

export const deleteInjuryBodyActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_INJURY_BODY}/${dataParams}`);

export const createInjuryBodyActionsApi = (
  dataParams: CreateInjuryBodyParams,
) =>
  requestAuthorized
    .post<void>(ASSETS_API_INJURY_BODY, dataParams)
    .catch((error) => Promise.reject(error));

export const getInjuryBodyDetailActionsApi = (id: string) =>
  requestAuthorized.get<InjuryBodyDetailResponse>(
    `${ASSETS_API_INJURY_BODY}/${id}`,
  );

export const updateInjuryBodyPermissionDetailActionsApi = (
  dataParams: UpdateInjuryBodyParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_INJURY_BODY}/${dataParams.id}`,
    dataParams.data,
  );
