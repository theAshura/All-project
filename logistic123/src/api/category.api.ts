import { requestAuthorized } from 'helpers/request';
import {
  GetCategorysResponse,
  CreateCategoryParams,
  CategoryDetailResponse,
  UpdateCategoryParams,
  CategoryExtend1,
} from 'models/api/category/category.model';
import { CommonApiParam } from 'models/common.model';
import queryString from 'query-string';
import {
  ASSETS_API_CATEGORY,
  ASSETS_API_CATEGORY_GET_LIST_BY_IDS,
} from './endpoints/config.endpoint';

export const getListCategorysActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetCategorysResponse>(
    `${ASSETS_API_CATEGORY}?${params}`,
  );
};

export const getListCategoryByIdsApi = (ids: string[]) =>
  requestAuthorized.post<CategoryExtend1[]>(
    ASSETS_API_CATEGORY_GET_LIST_BY_IDS,
    {
      ids,
    },
  );

export const deleteCategoryActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_CATEGORY}/${dataParams}`);

export const createCategoryActionsApi = (dataParams: CreateCategoryParams) =>
  requestAuthorized
    .post<void>(ASSETS_API_CATEGORY, dataParams)
    .catch((error) => Promise.reject(error));

export const getCategoryDetailActionsApi = (id: string) =>
  requestAuthorized.get<CategoryDetailResponse>(`${ASSETS_API_CATEGORY}/${id}`);

export const updateCategoryPermissionDetailActionsApi = (
  dataParams: UpdateCategoryParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_CATEGORY}/${dataParams.id}`,
    dataParams.data,
  );
