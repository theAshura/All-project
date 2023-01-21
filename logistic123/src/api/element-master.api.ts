import queryString from 'query-string';
import { requestAuthorized } from 'helpers/request';
import {
  GetStandardMastersResponse,
  GetStandardMastersParams,
  StandardMaster,
  GetElementMastersResponse,
  CheckExitsElementStageQParams,
} from 'models/api/element-master/element-master.model';
import {
  ASSETS_API,
  ASSETS_API_STANDARD_MASTER,
  ASSETS_API_ELEMENT_MASTER,
  ASSETS_API_ELEMENT_MASTER_HAS_REF,
} from './endpoints/config.endpoint';

export const getListStandardMasterActionsApi = (
  dataParams: GetStandardMastersParams,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetStandardMastersResponse>(
    `${ASSETS_API_STANDARD_MASTER}?${params}`,
  );
};

export const getStandardMasterDetailActionsApi = (id: string) =>
  requestAuthorized.get<StandardMaster>(`${ASSETS_API_STANDARD_MASTER}/${id}`);

export const deleteStandardMasterActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_STANDARD_MASTER}/${dataParams}`);

export const getListElementMasterActionsApi = (data: any) => {
  const params = queryString.stringify(data?.body);
  return requestAuthorized.get<GetElementMastersResponse>(
    `${ASSETS_API}/${data.id}/element-master?${params}`,
  );
};

export const updateElementMasterActionsApi = (dataParams: any) =>
  requestAuthorized
    .put<void>(`${ASSETS_API}/${dataParams.id}/element-master`, dataParams.body)
    .catch((error) => Promise.reject(error));

export const checkExitsElementStageQActionsApi = (
  dataParams: CheckExitsElementStageQParams,
) =>
  requestAuthorized
    .post<void>(
      `${ASSETS_API_ELEMENT_MASTER}/check-element-stage-q`,
      dataParams,
    )
    .catch((error) => Promise.reject(error));

export const checkElementMasterHasBeenUsedApi = (id: string) =>
  requestAuthorized
    .get<{ hasRef: boolean }>(
      `${ASSETS_API_ELEMENT_MASTER_HAS_REF}/${id}/has-ref`,
    )
    .catch((error) => Promise.reject(error));
