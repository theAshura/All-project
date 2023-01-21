import { requestAuthorized } from 'helpers/request';
import {
  CreateSecondCategoryParams,
  GetSecondCategoryResponse,
  SecondCategory,
  SecondCategoryDetailResponse,
  UpdateSecondCategoryParams,
} from 'models/api/second-category/second-category.model';
import { CommonApiParam } from 'models/common.model';
import queryString from 'query-string';
import {
  ASSETS_API_SECOND_CATEGORY,
  ASSETS_API_SECOND_CATEGORY_BY_MAIN_ID,
} from './endpoints/config.endpoint';

export const getListSecondCategoryActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetSecondCategoryResponse>(
    `${ASSETS_API_SECOND_CATEGORY}?${params}`,
  );
};

export const getListSecondCategoryByMainIdActionsApi = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<SecondCategory[]>(
    `${ASSETS_API_SECOND_CATEGORY_BY_MAIN_ID}?${params}`,
  );
};

export const deleteSecondCategoryActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_SECOND_CATEGORY}/${dataParams}`);

export const createSecondCategoryActionsApi = (
  dataParams: CreateSecondCategoryParams,
) =>
  requestAuthorized
    .post<void>(ASSETS_API_SECOND_CATEGORY, dataParams)
    .catch((error) => Promise.reject(error));

export const getSecondCategoryDetailActionsApi = (id: string) =>
  requestAuthorized.get<SecondCategoryDetailResponse>(
    `${ASSETS_API_SECOND_CATEGORY}/${id}`,
  );

export const updateSecondCategoryDetailActionsApi = (
  dataParams: UpdateSecondCategoryParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_SECOND_CATEGORY}/${dataParams.id}`,
    dataParams.data,
  );
