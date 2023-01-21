import { requestAuthorized } from 'helpers/request';
import {
  GetFeatureConfigsParams,
  GetFeatureConfigsResponse,
  CreateFeatureConfigParams,
  FeatureConfigDetailResponse,
  UpdateFeatureConfigParams,
} from 'models/api/feature-config/feature-config.model';
import queryString from 'query-string';
import { ASSETS_API_FEATURE_CONFIG } from './endpoints/config.endpoint';

export const getListFeatureConfigsActionsApi = (
  dataParams: GetFeatureConfigsParams,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetFeatureConfigsResponse>(
    `${ASSETS_API_FEATURE_CONFIG}?${params}`,
  );
};

export const deleteFeatureConfigActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_FEATURE_CONFIG}/${dataParams}`);

export const createFeatureConfigActionsApi = (
  dataParams: CreateFeatureConfigParams,
) =>
  requestAuthorized
    .post<void>(ASSETS_API_FEATURE_CONFIG, dataParams)
    .catch((error) => Promise.reject(error));

export const getFeatureConfigDetailActionsApi = (id: string) =>
  requestAuthorized.get<FeatureConfigDetailResponse>(
    `${ASSETS_API_FEATURE_CONFIG}/${id}`,
  );

export const updateFeatureConfigPermissionDetailActionsApi = (
  dataParams: UpdateFeatureConfigParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_FEATURE_CONFIG}/${dataParams.id}`,
    dataParams.data,
  );
