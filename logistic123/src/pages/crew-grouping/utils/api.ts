import { requestAuthorized } from 'helpers/request';
import { CheckUniqueResponsive } from 'models/common.model';
import queryString from 'query-string';
import {
  GetCrewGroupingsParams,
  GetCrewGroupingsResponse,
  CreateCrewGroupingParams,
  CrewGroupingDetailResponse,
  UpdateCrewGroupingParams,
  CheckExitCodeParams,
} from './model';
import {
  ASSETS_API_CREW_GROUPING,
  ASSETS_API_COMPANY_SUPPORT,
} from '../../../api/endpoints/config.endpoint';

export const getListCrewGroupingsActionsApi = (
  dataParams: GetCrewGroupingsParams,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetCrewGroupingsResponse>(
    `${ASSETS_API_CREW_GROUPING}?${params}`,
  );
};

export const deleteCrewGroupingActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_CREW_GROUPING}/${dataParams}`);

export const createCrewGroupingActionsApi = (
  dataParams: CreateCrewGroupingParams,
) =>
  requestAuthorized
    .post<void>(ASSETS_API_CREW_GROUPING, dataParams)
    .catch((error) => Promise.reject(error));

export const getCrewGroupingDetailActionsApi = (id: string) =>
  requestAuthorized.get<CrewGroupingDetailResponse>(
    `${ASSETS_API_CREW_GROUPING}/${id}`,
  );

export const updateCrewGroupingPermissionDetailActionsApi = (
  dataParams: UpdateCrewGroupingParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_CREW_GROUPING}/${dataParams.id}`,
    dataParams.data,
  );

export const checkExitCodeApi = (dataParams: CheckExitCodeParams) =>
  requestAuthorized
    .post<CheckUniqueResponsive>(ASSETS_API_COMPANY_SUPPORT, dataParams)
    .catch((error) => Promise.reject(error));
