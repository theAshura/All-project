import { requestAuthorized } from 'helpers/request';
import {
  CreatePlanningAndDrawingsParams,
  GetPlanningAndDrawingsResponse,
  UpdatePlanningAndDrawingsParams,
  PlanningAndDrawingsDetailResponse,
  GetPlanningAndDrawingsMasterResponse,
  GetPlanningAndDrawingsBodyResponse,
} from 'models/api/planning-and-drawings/planning-and-drawings.model';
import { CommonApiParam } from 'models/common.model';
import queryString from 'query-string';
import {
  ASSETS_API_PLANNING_AND_DRAWINGS,
  ASSETS_API_PLANNING_AND_DRAWINGS_IN_BASIC_INFO,
} from './endpoints/config.endpoint';

export const getListPlanningAndDrawingsActionsApi = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetPlanningAndDrawingsResponse>(
    `${ASSETS_API_PLANNING_AND_DRAWINGS_IN_BASIC_INFO}/${dataParams.vesselScreeningId}/plans-drawings?${params}`,
  );
};

export const getListPlanningAndDrawingsMasterActionsApi = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetPlanningAndDrawingsMasterResponse>(
    `${ASSETS_API_PLANNING_AND_DRAWINGS}?${params}`,
  );
};

export const getListPlanningAndDrawingsBodyActionsApi = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetPlanningAndDrawingsBodyResponse>(
    `${ASSETS_API_PLANNING_AND_DRAWINGS}?${params}`,
  );
};

export const deletePlanningAndDrawingsActionsApi = (conditionClassId: string) =>
  requestAuthorized.delete<void>(
    `${ASSETS_API_PLANNING_AND_DRAWINGS}/${conditionClassId}`,
  );

export const getPlanningAndDrawingsDetailActionsApi = (id: string) =>
  requestAuthorized.get<PlanningAndDrawingsDetailResponse>(
    `${ASSETS_API_PLANNING_AND_DRAWINGS}/${id}`,
  );

export const updatePlanningAndDrawingsDetailActionsApi = (
  dataParams: UpdatePlanningAndDrawingsParams,
) =>
  requestAuthorized.post<void>(
    `${ASSETS_API_PLANNING_AND_DRAWINGS_IN_BASIC_INFO}/${dataParams?.id}/plans-drawings`,
    dataParams.data,
  );

export const createPlanningAndDrawingsActionsApi = (
  dataParams: CreatePlanningAndDrawingsParams,
) =>
  requestAuthorized
    .post<void>(ASSETS_API_PLANNING_AND_DRAWINGS, dataParams)
    .catch((error) => Promise.reject(error));
