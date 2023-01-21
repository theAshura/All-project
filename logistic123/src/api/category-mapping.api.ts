import { requestAuthorized } from 'helpers/request';
import {
  CreateCategoryMappingParams,
  CategoryMappingDetailResponse,
  UpdateCategoryMappingParams,
  GetCategoryMappingsResponse,
} from 'models/api/category-mapping/category-mapping.model';
import queryString from 'query-string';
import { CommonApiParam } from 'models/common.model';
import { ASSETS_API_CATEGORY_MAPPING } from './endpoints/config.endpoint';

// const params = queryString.stringify({ lang: 'en' });

export const getListCategoryMappingsActionsApi = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetCategoryMappingsResponse>(
    `${ASSETS_API_CATEGORY_MAPPING}?${params}`,
  );
};

export const createCategoryMappingActionsApi = (
  dataParams: CreateCategoryMappingParams,
) =>
  requestAuthorized
    .post<void>(ASSETS_API_CATEGORY_MAPPING, dataParams)
    .catch((error) => Promise.reject(error));

export const getCategoryMappingDetailActionsApi = (id: string) =>
  requestAuthorized.get<CategoryMappingDetailResponse>(
    `${ASSETS_API_CATEGORY_MAPPING}/${id}`,
  );

export const updateCategoryMappingPermissionDetailActionsApi = (
  dataParams: UpdateCategoryMappingParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_CATEGORY_MAPPING}/${dataParams.id}`,
    dataParams.data,
  );
