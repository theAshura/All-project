import { requestAuthorized } from 'helpers/request';
import { CommonApiParam } from 'models/common.model';
import {
  CreateMainCategoryParams,
  GetMainCategoryResponse,
  MainCategoryDetailResponse,
  UpdateMainCategoryParams,
} from 'models/api/main-category/main-category.model';
import queryString from 'query-string';
import { ASSETS_API_MAIN_CATEGORY } from './endpoints/config.endpoint';

export const getListMainCategoryActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetMainCategoryResponse>(
    `${ASSETS_API_MAIN_CATEGORY}?${params}`,
  );
};

export const deleteMainCategoryActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_MAIN_CATEGORY}/${dataParams}`);

export const createMainCategoryActionsApi = (
  dataParams: CreateMainCategoryParams,
) =>
  requestAuthorized
    .post<void>(ASSETS_API_MAIN_CATEGORY, dataParams)
    .catch((error) => Promise.reject(error));

export const getMainCategoryDetailActionsApi = (id: string) =>
  requestAuthorized.get<MainCategoryDetailResponse>(
    `${ASSETS_API_MAIN_CATEGORY}/${id}`,
  );

export const updateMainCategoryDetailActionsApi = (
  dataParams: UpdateMainCategoryParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_MAIN_CATEGORY}/${dataParams.id}`,
    dataParams.data,
  );
