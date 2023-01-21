import { ASSETS_API_TRANSFER_TYPE } from 'api/endpoints/config.endpoint';
import { requestAuthorized } from 'helpers/request';
import queryString from 'query-string';
import {
  GetTransferTypesParams,
  GetTransferTypesResponse,
  CreateTransferTypeParams,
  TransferTypeDetailResponse,
  UpdateTransferTypeParams,
} from './model';

export const getListTransferTypesActionsApi = (
  dataParams: GetTransferTypesParams,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetTransferTypesResponse>(
    `${ASSETS_API_TRANSFER_TYPE}?${params}`,
  );
};

export const deleteTransferTypeActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_TRANSFER_TYPE}/${dataParams}`);

export const createTransferTypeActionsApi = (
  dataParams: CreateTransferTypeParams,
) =>
  requestAuthorized
    .post<void>(ASSETS_API_TRANSFER_TYPE, dataParams)
    .catch((error) => Promise.reject(error));

export const getTransferTypeDetailActionsApi = (id: string) =>
  requestAuthorized.get<TransferTypeDetailResponse>(
    `${ASSETS_API_TRANSFER_TYPE}/${id}`,
  );

export const updateTransferTypePermissionDetailActionsApi = (
  dataParams: UpdateTransferTypeParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_TRANSFER_TYPE}/${dataParams.id}`,
    dataParams.data,
  );
