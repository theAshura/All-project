import { CommonApiParam } from 'models/common.model';
import { requestAuthorized } from 'helpers/request';
import {
  ExportListVesselParams,
  GetListVesselParams,
  Vessel,
  UpdateVesselParams,
} from 'models/api/vessel/vessel.model';
import queryString from 'query-string';
import {
  ASSETS_API_VESSEL,
  ASSETS_API_CLASSIFICATION_SOCIETY,
} from './endpoints/config.endpoint';

export const getListVesselActionsApi = (dataParams: GetListVesselParams) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetListVesselParams>(
    `${ASSETS_API_VESSEL}?${params}`,
  );
};

export const getDetailVesselActionApi = (id: string) =>
  requestAuthorized.get<Vessel>(`${ASSETS_API_VESSEL}/${id}`);

export const deleteVesselActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_VESSEL}/${dataParams}`);

export const createVesselActionsApi = (dataParams: Vessel) =>
  requestAuthorized
    .post<Vessel>(ASSETS_API_VESSEL, dataParams)
    .catch((error) => Promise.reject(error));

export const exportListVesselActionsApi = (
  dataParams: ExportListVesselParams,
) => {
  const params = queryString.stringify(dataParams.params);
  const paramsPost = queryString.stringify({
    exportType: dataParams.exportType,
  });
  return requestAuthorized.post<GetListVesselParams>(
    `${ASSETS_API_VESSEL}/export?${params}`,
    paramsPost,
  );
};
export const updateVesselActionsApi = (dataParams: UpdateVesselParams) =>
  requestAuthorized.put(
    `${ASSETS_API_VESSEL}/${dataParams.id}`,
    dataParams.body,
  );

export const getVesselLastAuditTimeAndDueDateApi = (
  id: string,
  auditTypeIds?: string[],
) =>
  requestAuthorized.get<string>(
    `${ASSETS_API_VESSEL}/${id}/last-audit-time-and-due-date`,
    { params: { auditTypeIds } },
  );

export const getListClassificationSocietyActionsApi = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<any>(
    `${ASSETS_API_CLASSIFICATION_SOCIETY}?${params}`,
  );
};

export const getListVesselPilotActionsApi = (
  dataParams: GetListVesselParams,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetListVesselParams>(
    `${ASSETS_API_VESSEL}/pilot-terminal?${params}`,
  );
};
