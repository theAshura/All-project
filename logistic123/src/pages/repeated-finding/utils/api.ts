import { requestAuthorized } from 'helpers/request';
import queryString from 'query-string';
import { CheckUniqueResponsive } from 'models/common.model';
import {
  GetRepeateFindingCalculationResponse,
  GetRepeateFindingCalculationParams,
  CreateRepeateFindingCalculationParams,
  UpdateRepeateFindingCalculationParams,
  CheckExitCodeParams,
} from './model';
import {
  ASSETS_API_COMPANY_SUPPORT,
  ASSETS_API_REPEATED_FINDING,
} from '../../../api/endpoints/config.endpoint';

export const getListRepeateFindingCalculationActionsApi = (
  dataParams: GetRepeateFindingCalculationParams,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetRepeateFindingCalculationResponse>(
    `${ASSETS_API_REPEATED_FINDING}?${params}`,
  );
};

export const deleteRepeateFindingCalculationActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(
    `${ASSETS_API_REPEATED_FINDING}/${dataParams}`,
  );

export const createRepeateFindingCalculationActionsApi = (
  dataParams: CreateRepeateFindingCalculationParams,
) =>
  requestAuthorized
    .post<void>(ASSETS_API_REPEATED_FINDING, dataParams)
    .catch((error) => Promise.reject(error));

export const updateRepeateFindingCalculationActionsApi = (
  dataParams: UpdateRepeateFindingCalculationParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_REPEATED_FINDING}/${dataParams.id}`,
    dataParams.data,
  );
export const checkExitCodeApi = (dataParams: CheckExitCodeParams) =>
  requestAuthorized
    .post<CheckUniqueResponsive>(ASSETS_API_COMPANY_SUPPORT, dataParams)
    .catch((error) => Promise.reject(error));
