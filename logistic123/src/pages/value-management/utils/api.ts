import { requestAuthorized } from 'helpers/request';
import queryString from 'query-string';
import {
  GetValueManagementsParams,
  GetValueManagementsResponse,
  CreateValueManagementParams,
  ValueManagementResponse,
  UpdateValueManagementParams,
} from './model';
import { ASSETS_API_VALUE_MANAGEMENT } from '../../../api/endpoints/config.endpoint';

export const getListValueManagementsActionsApi = (
  dataParams: GetValueManagementsParams,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetValueManagementsResponse>(
    `${ASSETS_API_VALUE_MANAGEMENT}?${params}`,
  );
};

export const deleteValueManagementActionsApi = (index: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_VALUE_MANAGEMENT}/${index}`);

export const createValueManagementActionsApi = (
  dataParams: CreateValueManagementParams,
) =>
  requestAuthorized
    .post<void>(ASSETS_API_VALUE_MANAGEMENT, dataParams)
    .catch((error) => Promise.reject(error));

export const getValueManagementDetailActionsApi = (id: string) =>
  requestAuthorized.get<ValueManagementResponse>(
    `${ASSETS_API_VALUE_MANAGEMENT}/${id}`,
  );

export const updateValueManagementPermissionDetailActionsApi = (
  dataParams: UpdateValueManagementParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_VALUE_MANAGEMENT}/${dataParams.id}`,
    dataParams.data,
  );
