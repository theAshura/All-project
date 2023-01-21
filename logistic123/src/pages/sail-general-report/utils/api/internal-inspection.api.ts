import {
  InternalInspectionsRequests,
  VesselScreeningInternalInspection,
  GetVesselScreeningInternalInspectionsResponse,
  UpdateInternalInspectionRequestParams,
} from 'pages/vessel-screening/utils/models/internal-inspection.model';
import {
  ASSETS_API_SAIL_REPORT_INSPECTION_INTERNAL,
  ASSETS_API_VESSEL_SCREENING,
} from 'api/endpoints/config.endpoint';
import { requestAuthorized } from 'helpers/request';
import queryString from 'query-string';
import { CommonApiParam } from 'models/common.model';

export const getListVesselScreeningInternalInspectionApi = (
  dataParams: CommonApiParam,
) => {
  const { vesselScreeningId, ...other } = dataParams;
  const params = queryString.stringify(other);
  return requestAuthorized.get<GetVesselScreeningInternalInspectionsResponse>(
    `${ASSETS_API_VESSEL_SCREENING}/${vesselScreeningId}/internal-inspections?${params}`,
  );
};

export const getInternalInspectionRequestDetailApi = (
  dataParams: CommonApiParam,
) => {
  const { vesselScreeningId, id } = dataParams;
  return requestAuthorized.get<InternalInspectionsRequests>(
    `${ASSETS_API_VESSEL_SCREENING}/${vesselScreeningId}/internal-inspections/${id}`,
  );
};

export const getVesselScreeningInternalInspectionDetailApi = (
  dataParams: CommonApiParam,
) => {
  const { id, ...other } = dataParams;
  const params = queryString.stringify(other);
  return requestAuthorized.get<VesselScreeningInternalInspection>(
    `${ASSETS_API_SAIL_REPORT_INSPECTION_INTERNAL}/${id}?${params}`,
  );
};

export const updateInternalInspectionRequestApi = (
  dataParams: UpdateInternalInspectionRequestParams,
) => {
  const { id, data } = dataParams;
  return requestAuthorized.post(
    `${ASSETS_API_VESSEL_SCREENING}/${id}/internal-inspections`,
    data,
  );
};
