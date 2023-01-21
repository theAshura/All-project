import { requestAuthorized } from 'helpers/request';
import queryString from 'query-string';
import { CommonApiParam } from 'models/common.model';
import { NatureOfFindingsMaster } from 'models/api/nature-of-findings-master/nature-of-findings-master.model';
import { ASSETS_API_NATURE_OF_FINDINGS_MASTER } from './endpoints/config.endpoint';

export const getListNatureOfFindingsMasterActionsApi = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<CommonApiParam>(
    `${ASSETS_API_NATURE_OF_FINDINGS_MASTER}?${params}`,
  );
};

export const deleteNatureOfFindingsMasterActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(
    `${ASSETS_API_NATURE_OF_FINDINGS_MASTER}/${dataParams}`,
  );

export const createNatureOfFindingsMasterActionsApi = (
  dataParams: NatureOfFindingsMaster,
) =>
  requestAuthorized
    .post<NatureOfFindingsMaster>(
      ASSETS_API_NATURE_OF_FINDINGS_MASTER,
      dataParams,
    )
    .catch((error) => Promise.reject(error));

export const getDetailNatureOfFindingsMasterActionApi = (id: string) =>
  requestAuthorized.get<NatureOfFindingsMaster>(
    `${ASSETS_API_NATURE_OF_FINDINGS_MASTER}/${id}`,
  );

export const updateNatureOfFindingsMasterActionApi = (
  id: string,
  data: NatureOfFindingsMaster,
) =>
  requestAuthorized
    .put<void>(`${ASSETS_API_NATURE_OF_FINDINGS_MASTER}/${id}`, data)
    .catch((error) => Promise.reject(error));
