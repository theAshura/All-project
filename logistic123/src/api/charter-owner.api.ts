import { requestAuthorized } from 'helpers/request';
import {
  GetCharterOwnersResponse,
  CreateCharterOwnerParams,
  CharterOwnerDetailResponse,
  UpdateCharterOwnerParams,
} from 'models/api/charter-owner/charter-owner.model';
import { CommonApiParam } from 'models/common.model';

import queryString from 'query-string';
import { ASSETS_API_CHARTER_OWNER } from './endpoints/config.endpoint';

export const getListCharterOwnersActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetCharterOwnersResponse>(
    `${ASSETS_API_CHARTER_OWNER}?${params}`,
  );
};

export const deleteCharterOwnerActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_CHARTER_OWNER}/${dataParams}`);

export const createCharterOwnerActionsApi = (
  dataParams: CreateCharterOwnerParams,
) =>
  requestAuthorized
    .post<void>(ASSETS_API_CHARTER_OWNER, dataParams)
    .catch((error) => Promise.reject(error));

export const getCharterOwnerDetailActionsApi = (id: string) =>
  requestAuthorized.get<CharterOwnerDetailResponse>(
    `${ASSETS_API_CHARTER_OWNER}/${id}`,
  );

export const updateCharterOwnerPermissionDetailActionsApi = (
  dataParams: UpdateCharterOwnerParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_CHARTER_OWNER}/${dataParams.id}`,
    dataParams.data,
  );
