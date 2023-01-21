import { requestAuthorized } from 'helpers/request';
import { CheckUniqueResponsive } from 'models/common.model';
import queryString from 'query-string';
import {
  GetPlanDrawingsParams,
  GetPlanDrawingsResponse,
  CreatePlanDrawingParams,
  PlanDrawingDetailResponse,
  UpdatePlanDrawingParams,
  CheckExitCodeParams,
} from './model';
import {
  ASSETS_API_PLAN_DRAWING_MASTER,
  ASSETS_API_COMPANY_SUPPORT,
} from '../../../api/endpoints/config.endpoint';

export const getListPlanDrawingsActionsApi = (
  dataParams: GetPlanDrawingsParams,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetPlanDrawingsResponse>(
    `${ASSETS_API_PLAN_DRAWING_MASTER}?${params}`,
  );
};

export const deletePlanDrawingActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(
    `${ASSETS_API_PLAN_DRAWING_MASTER}/${dataParams}`,
  );

export const createPlanDrawingActionsApi = (
  dataParams: CreatePlanDrawingParams,
) =>
  requestAuthorized
    .post<void>(ASSETS_API_PLAN_DRAWING_MASTER, dataParams)
    .catch((error) => Promise.reject(error));

export const getPlanDrawingDetailActionsApi = (id: string) =>
  requestAuthorized.get<PlanDrawingDetailResponse>(
    `${ASSETS_API_PLAN_DRAWING_MASTER}/${id}`,
  );

export const updatePlanDrawingPermissionDetailActionsApi = (
  dataParams: UpdatePlanDrawingParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_PLAN_DRAWING_MASTER}/${dataParams.id}`,
    dataParams.data,
  );

export const checkExitCodeApi = (dataParams: CheckExitCodeParams) =>
  requestAuthorized
    .post<CheckUniqueResponsive>(ASSETS_API_COMPANY_SUPPORT, dataParams)
    .catch((error) => Promise.reject(error));
