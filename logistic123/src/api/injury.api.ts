import { requestAuthorized } from 'helpers/request';
import {
  CreateInjuryParams,
  GetInjuryResponse,
  UpdateInjuryParams,
  InjuryDetailResponse,
  GetInjuryMasterResponse,
  GetInjuryBodyResponse,
} from 'models/api/injury/injury.model';
import { CommonApiParam } from 'models/common.model';
import queryString from 'query-string';
import {
  ASSETS_API_INJURY,
  ASSETS_API_INJURY_MASTER,
  ASSETS_API_INJURY_BODY,
} from './endpoints/config.endpoint';

export const getListInjuryActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetInjuryResponse>(
    `${ASSETS_API_INJURY}?${params}`,
  );
};

export const getListInjuryMasterActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetInjuryMasterResponse>(
    `${ASSETS_API_INJURY_MASTER}?${params}`,
  );
};

export const getListInjuryBodyActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetInjuryBodyResponse>(
    `${ASSETS_API_INJURY_BODY}?${params}`,
  );
};

export const deleteInjuryActionsApi = (conditionClassId: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_INJURY}/${conditionClassId}`);

export const getInjuryDetailActionsApi = (id: string) =>
  requestAuthorized.get<InjuryDetailResponse>(`${ASSETS_API_INJURY}/${id}`);

export const updateInjuryDetailActionsApi = (dataParams: UpdateInjuryParams) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_INJURY}/${dataParams.id}`,
    dataParams.data,
  );

export const createInjuryActionsApi = (dataParams: CreateInjuryParams) =>
  requestAuthorized
    .post<void>(ASSETS_API_INJURY, dataParams)
    .catch((error) => Promise.reject(error));
