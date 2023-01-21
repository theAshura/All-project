import { requestAuthorized } from 'helpers/request';
import {
  CreateRiskFactorParams,
  GetRiskFactorResponse,
  RiskFactorDetailResponse,
  UpdateRiskFactorParams,
} from 'models/api/risk-factor/risk-factor.model';
import { CommonApiParam } from 'models/common.model';
import queryString from 'query-string';
import { ASSETS_API_RISK_FACTOR } from './endpoints/config.endpoint';

export const getListRiskFactorActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetRiskFactorResponse>(
    `${ASSETS_API_RISK_FACTOR}?${params}`,
  );
};

// export const getListRiskFactorByMainIdActionsApi = (
//   dataParams: CommonApiParam,
// ) => {
//   const params = queryString.stringify(dataParams);
//   return requestAuthorized.get<RiskFactor[]>(
//     `${ASSETS_API_SECOND_CATEGORY_BY_MAIN_ID}?${params}`,
//   );
// };

export const deleteRiskFactorActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_RISK_FACTOR}/${dataParams}`);

export const createRiskFactorActionsApi = (
  dataParams: CreateRiskFactorParams,
) =>
  requestAuthorized
    .post<void>(ASSETS_API_RISK_FACTOR, dataParams)
    .catch((error) => Promise.reject(error));

export const getRiskFactorDetailActionsApi = (id: string) =>
  requestAuthorized.get<RiskFactorDetailResponse>(
    `${ASSETS_API_RISK_FACTOR}/${id}`,
  );

export const updateRiskFactorDetailActionsApi = (
  dataParams: UpdateRiskFactorParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_RISK_FACTOR}/${dataParams.id}`,
    dataParams.data,
  );
