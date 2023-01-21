import { requestAuthorized } from 'helpers/request';
import {
  ListAuthorityMasterResponse,
  ParamsListAuthorityMaster,
  AuthorityMaster,
} from 'models/api/authority-master/authority-master.model';
import queryString from 'query-string';
import { ASSETS_API_AUTHORITY_MASTER } from './endpoints/config.endpoint';

export const getListAuthorityMasterActionsApi = (
  dataParams: ParamsListAuthorityMaster,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<ListAuthorityMasterResponse>(
    `${ASSETS_API_AUTHORITY_MASTER}?${params}`,
  );
};

export const deleteAuthorityMasterActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(
    `${ASSETS_API_AUTHORITY_MASTER}/${dataParams}`,
  );

export const createAuthorityMasterActionsApi = (dataParams: AuthorityMaster) =>
  requestAuthorized
    .post<AuthorityMaster>(ASSETS_API_AUTHORITY_MASTER, dataParams)
    .catch((error) => Promise.reject(error));

export const getDetailAuthorityMasterActionApi = (id: string) =>
  requestAuthorized.get<AuthorityMaster>(
    `${ASSETS_API_AUTHORITY_MASTER}/${id}`,
  );

export const updateAuthorityMasterActionApi = (
  id: string,
  data: AuthorityMaster,
) =>
  requestAuthorized
    .put<void>(`${ASSETS_API_AUTHORITY_MASTER}/${id}`, data)
    .catch((error) => Promise.reject(error));
