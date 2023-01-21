import { ASSETS_API_VESSEL_SCREENING } from 'api/endpoints/config.endpoint';
import { requestAuthorized } from 'helpers/request';
import queryString from 'query-string';
import { CommonApiParam } from 'models/common.model';
import {
  GetVesselPlanAndDrawingsResponse,
  UpdatePlanAndDrawingsRequestParams,
} from '../models/plan-and-drawing.model';

export const getListVesselScreeningPlanAndDrawingApi = (
  dataParams: CommonApiParam,
) => {
  const { vesselScreeningId, ...other } = dataParams;
  const params = queryString.stringify(other);
  return requestAuthorized.get<GetVesselPlanAndDrawingsResponse>(
    `${ASSETS_API_VESSEL_SCREENING}/${vesselScreeningId}/plans-drawings?${params}`,
  );
};

export const updatePlanAndDrawingsRequestApi = (
  dataParams: UpdatePlanAndDrawingsRequestParams,
) => {
  const { id, data } = dataParams;
  return requestAuthorized.post(
    `${ASSETS_API_VESSEL_SCREENING}/${id}/plans-drawings`,
    data,
  );
};
