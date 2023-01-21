import { CommonApiParam } from 'models/common.model';
import { requestAuthorized } from 'helpers/request';
import {
  GetInspectionMappingsResponse,
  CreateInspectionMappingParams,
  InspectionMappingDetailResponse,
  UpdateInspectionMappingParams,
  GetNatureOfFindingsResponse,
} from 'models/api/inspection-mapping/inspection-mapping.model';
import queryString from 'query-string';
import {
  ASSETS_API_INSPECTION_MAPPING,
  ASSETS_API_NATURE_FINDING,
} from './endpoints/config.endpoint';

export const getListInspectionMappingsActionsApi = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetInspectionMappingsResponse>(
    `${ASSETS_API_INSPECTION_MAPPING}?${params}`,
  );
};

export const getListNatureOfFindingsActionsApi = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetNatureOfFindingsResponse>(
    `${ASSETS_API_NATURE_FINDING}?${params}`,
  );
};

export const deleteInspectionMappingActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(
    `${ASSETS_API_INSPECTION_MAPPING}/${dataParams}`,
  );

export const createInspectionMappingActionsApi = (
  dataParams: CreateInspectionMappingParams,
) =>
  requestAuthorized
    .post<void>(ASSETS_API_INSPECTION_MAPPING, dataParams)
    .catch((error) => Promise.reject(error));

export const getInspectionMappingDetailActionsApi = (id: string) =>
  requestAuthorized.get<InspectionMappingDetailResponse>(
    `${ASSETS_API_INSPECTION_MAPPING}/${id}`,
  );

export const updateInspectionMappingPermissionDetailActionsApi = (
  dataParams: UpdateInspectionMappingParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_INSPECTION_MAPPING}/${dataParams.id}`,
    dataParams.data,
  );
