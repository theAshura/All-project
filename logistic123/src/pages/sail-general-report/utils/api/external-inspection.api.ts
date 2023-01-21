import {
  ExternalInspectionsRequests,
  UpdateExternalInspectionRequestParams,
  GetVesselScreeningExternalInspectionsResponse,
  VesselScreeningExternalInspection,
} from 'pages/vessel-screening/utils/models/external-inspection.model';
import {
  ASSETS_API_EXTERNAL,
  ASSETS_API_VESSEL_SCREENING,
} from 'api/endpoints/config.endpoint';
import { requestAuthorized } from 'helpers/request';
import queryString from 'query-string';
import { CommonApiParam } from 'models/common.model';

export const getListVesselScreeningExternalInspectionApi = (
  dataParams: CommonApiParam,
) => {
  const { vesselScreeningId, ...other } = dataParams;
  const params = queryString.stringify(other);
  return requestAuthorized.get<GetVesselScreeningExternalInspectionsResponse>(
    `${ASSETS_API_VESSEL_SCREENING}/${vesselScreeningId}/external-inspections?${params}`,
  );
};

export const getVesselScreeningExternalInspectionDetailApi = (
  dataParams: CommonApiParam,
) => {
  const { id, ...other } = dataParams;
  const params = queryString.stringify(other);
  return requestAuthorized.get<VesselScreeningExternalInspection>(
    `${ASSETS_API_EXTERNAL}/${id}?${params}`,
  );
};

export const getExternalInspectionRequestDetailApi = (
  dataParams: CommonApiParam,
) => {
  const { vesselScreeningId, id } = dataParams;
  return requestAuthorized.get<ExternalInspectionsRequests>(
    `${ASSETS_API_VESSEL_SCREENING}/${vesselScreeningId}/external-inspections/${id}`,
  );
};

export const updateVesselScreeningExternalInspectionRequestApi = (
  dataParams: UpdateExternalInspectionRequestParams,
) => {
  const { id, data } = dataParams;
  return requestAuthorized.post(
    `${ASSETS_API_VESSEL_SCREENING}/${id}/external-inspections`,
    data,
  );
};
