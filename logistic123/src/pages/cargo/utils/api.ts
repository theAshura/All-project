import { requestAuthorized } from 'helpers/request';
import { CheckUniqueResponsive } from 'models/common.model';
import queryString from 'query-string';
import {
  GetCargosParams,
  GetCargosResponse,
  CreateCargoParams,
  CargoDetailResponse,
  UpdateCargoParams,
  CheckExitCodeParams,
} from './model';
import {
  ASSETS_API_CARGO,
  ASSETS_API_COMPANY_SUPPORT,
} from '../../../api/endpoints/config.endpoint';

export const getListCargosActionsApi = (dataParams: GetCargosParams) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetCargosResponse>(
    `${ASSETS_API_CARGO}?${params}`,
  );
};

export const deleteCargoActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_CARGO}/${dataParams}`);

export const createCargoActionsApi = (dataParams: CreateCargoParams) =>
  requestAuthorized
    .post<void>(ASSETS_API_CARGO, dataParams)
    .catch((error) => Promise.reject(error));

export const getCargoDetailActionsApi = (id: string) =>
  requestAuthorized.get<CargoDetailResponse>(`${ASSETS_API_CARGO}/${id}`);

export const updateCargoPermissionDetailActionsApi = (
  dataParams: UpdateCargoParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_CARGO}/${dataParams.id}`,
    dataParams.data,
  );

export const checkExitCodeApi = (dataParams: CheckExitCodeParams) =>
  requestAuthorized
    .post<CheckUniqueResponsive>(ASSETS_API_COMPANY_SUPPORT, dataParams)
    .catch((error) => Promise.reject(error));
