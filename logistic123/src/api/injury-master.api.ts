import { requestAuthorized } from 'helpers/request';
import {
  GetInjuryMastersParams,
  GetInjuryMastersResponse,
  CreateInjuryMasterParams,
  InjuryMasterDetailResponse,
  UpdateInjuryMasterParams,
} from 'models/api/injury-master/injury-master.model';
import queryString from 'query-string';
import { ASSETS_API_INJURY_MASTER } from './endpoints/config.endpoint';

export const getListInjuryMastersActionsApi = (
  dataParams: GetInjuryMastersParams,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetInjuryMastersResponse>(
    `${ASSETS_API_INJURY_MASTER}?${params}`,
  );
};

export const deleteInjuryMasterActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_INJURY_MASTER}/${dataParams}`);

export const createInjuryMasterActionsApi = (
  dataParams: CreateInjuryMasterParams,
) =>
  requestAuthorized
    .post<void>(ASSETS_API_INJURY_MASTER, dataParams)
    .catch((error) => Promise.reject(error));

export const getInjuryMasterDetailActionsApi = (id: string) =>
  requestAuthorized.get<InjuryMasterDetailResponse>(
    `${ASSETS_API_INJURY_MASTER}/${id}`,
  );

export const updateInjuryMasterPermissionDetailActionsApi = (
  dataParams: UpdateInjuryMasterParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_INJURY_MASTER}/${dataParams.id}`,
    dataParams.data,
  );
