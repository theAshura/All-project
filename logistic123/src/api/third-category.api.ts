import { requestAuthorized } from 'helpers/request';
import {
  CreateThirdCategoryParams,
  GetThirdCategoryResponse,
  ThirdCategoryDetailResponse,
  UpdateThirdCategoryParams,
} from 'models/api/third-category/third-category.model';
import { CommonApiParam } from 'models/common.model';
import queryString from 'query-string';
import { ASSETS_API_THIRD_CATEGORY } from './endpoints/config.endpoint';

export const getListThirdCategoryActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetThirdCategoryResponse>(
    `${ASSETS_API_THIRD_CATEGORY}?${params}`,
  );
};

export const deleteThirdCategoryActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_THIRD_CATEGORY}/${dataParams}`);

export const createThirdCategoryActionsApi = (
  dataParams: CreateThirdCategoryParams,
) =>
  requestAuthorized
    .post<void>(ASSETS_API_THIRD_CATEGORY, dataParams)
    .catch((error) => Promise.reject(error));

export const getThirdCategoryDetailActionsApi = (id: string) =>
  requestAuthorized.get<ThirdCategoryDetailResponse>(
    `${ASSETS_API_THIRD_CATEGORY}/${id}`,
  );

export const updateThirdCategoryDetailActionsApi = (
  dataParams: UpdateThirdCategoryParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_THIRD_CATEGORY}/${dataParams.id}`,
    dataParams.data,
  );
