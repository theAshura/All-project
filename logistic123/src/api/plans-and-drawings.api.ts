import { requestAuthorized } from 'helpers/request';
import {
  GetPlansAndDrawingsParams,
  GetPlansAndDrawingsResponse,
  CreatePlansAndDrawingParams,
  UpdatePlansAndDrawingParams,
  PlansAndDrawingDetailResponse,
} from 'models/api/plans-and-drawings/plans-and-drawings.model';
import queryString from 'query-string';
import {
  ASSETS_API_PLANNING_AND_DRAWINGS,
  ASSETS_API_PLAN_DRAWING_MASTER,
} from './endpoints/config.endpoint';

export const getListPlansAndDrawingMasterActionsApi = (
  dataParams: GetPlansAndDrawingsParams,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetPlansAndDrawingsResponse>(
    `${ASSETS_API_PLAN_DRAWING_MASTER}?${params}`,
  );
};

export const deletePlansAndDrawingActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(
    `${ASSETS_API_PLANNING_AND_DRAWINGS}/${dataParams}`,
  );

export const createPlansAndDrawingActionsApi = (
  dataParams: CreatePlansAndDrawingParams,
) =>
  requestAuthorized
    .post<void>(ASSETS_API_PLANNING_AND_DRAWINGS, dataParams)
    .catch((error) => Promise.reject(error));

export const getPlansAndDrawingDetailActionsApi = (dataParams) => {
  const { id, vesselId } = dataParams;
  return requestAuthorized.get<PlansAndDrawingDetailResponse>(
    `${ASSETS_API_PLANNING_AND_DRAWINGS}/${id}/vessel/${vesselId}`,
  );
};

export const updatePlansAndDrawingDetailActionsApi = (
  dataParams: UpdatePlansAndDrawingParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_PLANNING_AND_DRAWINGS}/${dataParams.id}/vessel/${dataParams?.data?.vesselId}`,
    dataParams.data,
  );
