import { requestAuthorized } from 'helpers/request';
import { User } from 'models/api/user/user.model';
import {
  ListVesselTypeResponse,
  ParamsListVesselType,
  updateVesselTypeParam,
  VesselType,
} from 'models/api/vessel-type/vessel-type.model';
import queryString from 'query-string';
import {
  AUTH_API_USER,
  ASSETS_API_VESSEL_TYPE,
} from './endpoints/config.endpoint';

export const getListVesselTypeActionsApi = (
  dataParams: ParamsListVesselType,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<ListVesselTypeResponse>(
    `${ASSETS_API_VESSEL_TYPE}?${params}`,
  );
};

export const deleteVesselTypeActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_VESSEL_TYPE}/${dataParams}`);

export const createVesselTypeActionsApi = (dataParams: VesselType) =>
  requestAuthorized
    .post<VesselType>(ASSETS_API_VESSEL_TYPE, dataParams)
    .catch((error) => Promise.reject(error));

export const getListNameUserActionsApi = (dataParams) =>
  requestAuthorized.post<Array<User>>(
    `${AUTH_API_USER}/list-by-ids`,
    dataParams,
  );

export const getDetailVesselTypeActionApi = (id: string) =>
  requestAuthorized.get<VesselType>(`${ASSETS_API_VESSEL_TYPE}/${id}`);

export const updateVesselTypeActionApi = (dataParams: updateVesselTypeParam) =>
  requestAuthorized
    .put<void>(`${ASSETS_API_VESSEL_TYPE}/${dataParams.id}`, dataParams.data)
    .catch((error) => Promise.reject(error));
