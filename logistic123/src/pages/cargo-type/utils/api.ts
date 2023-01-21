import { requestAuthorized } from 'helpers/request';
import { CheckUniqueResponsive } from 'models/common.model';
import queryString from 'query-string';
import {
  GetCargoTypesParams,
  GetCargoTypesResponse,
  CreateCargoTypeParams,
  CargoTypeDetailResponse,
  UpdateCargoTypeParams,
  CheckExitCodeParams,
} from './model';
import {
  ASSETS_API_CARGO_TYPE,
  ASSETS_API_COMPANY_SUPPORT,
} from '../../../api/endpoints/config.endpoint';

export const getListCargoTypesActionsApi = (
  dataParams: GetCargoTypesParams,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetCargoTypesResponse>(
    `${ASSETS_API_CARGO_TYPE}?${params}`,
  );
};

export const deleteCargoTypeActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_CARGO_TYPE}/${dataParams}`);

export const createCargoTypeActionsApi = (dataParams: CreateCargoTypeParams) =>
  requestAuthorized
    .post<void>(ASSETS_API_CARGO_TYPE, dataParams)
    .catch((error) => Promise.reject(error));

export const getCargoTypeDetailActionsApi = (id: string) =>
  requestAuthorized.get<CargoTypeDetailResponse>(
    `${ASSETS_API_CARGO_TYPE}/${id}`,
  );

export const updateCargoTypePermissionDetailActionsApi = (
  dataParams: UpdateCargoTypeParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_CARGO_TYPE}/${dataParams.id}`,
    dataParams.data,
  );

export const checkExitCodeApi = (dataParams: CheckExitCodeParams) =>
  requestAuthorized
    .post<CheckUniqueResponsive>(ASSETS_API_COMPANY_SUPPORT, dataParams)
    .catch((error) => Promise.reject(error));
