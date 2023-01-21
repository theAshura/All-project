import { requestAuthorized } from 'helpers/request';
import queryString from 'query-string';
import { ASSETS_API_VESSEL_SCREENING } from 'api/endpoints/config.endpoint';
import { CommonApiParam } from 'models/common.model';
import {
  VesselScreeningDetail,
  GetVesselScreeningParams,
  GetVesselScreeningResponse,
  CreateVesselScreeningParams,
  GetListVesselScreeningParams,
  GetListVesselScreeningMaintenance,
  UpdateVesselScreeningParamsMaintenance,
  GetListVesselScreeningOtherTechRecords,
  UpdateVesselScreeningParamsOtherTechRecords,
  GetListVesselScreeningDryDocking,
  UpdateVesselScreeningParamsDryDocking,
  GetListVesselScreeningIncidentInvestigation,
  UpdateVesselScreeningParamsIncidentInvestigation,
  GetListVesselScreeningPortStateControl,
  UpdateVesselScreeningParamsPortStateControl,
  UpdateStatusRequestParams,
  ShipParticular,
  PortStateControlRequest,
} from '../models/common.model';

// NOTED: api for overall vessel screening
export const getListVesselScreeningActionsApi = (
  dataParams: GetVesselScreeningParams,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetVesselScreeningResponse>(
    `${ASSETS_API_VESSEL_SCREENING}?${params}`,
  );
};

export const getVesselScreeningDetailActionsApi = (id: string) =>
  requestAuthorized.get<VesselScreeningDetail>(
    `${ASSETS_API_VESSEL_SCREENING}/${id}`,
  );

export const createVesselScreeningActionsApi = (
  dataParams: CreateVesselScreeningParams,
) =>
  requestAuthorized
    .post<void>(ASSETS_API_VESSEL_SCREENING, dataParams)
    .catch((error) => Promise.reject(error));

export const updateVesselScreeningActionsApi = (
  dataParams: UpdateStatusRequestParams,
) => {
  let data: UpdateStatusRequestParams = {
    vesselId: dataParams.vesselId,
    status: dataParams.status,
    reviewStatus: dataParams.reviewStatus,
    picIds: dataParams.picIds,
    ports: dataParams.ports,
    transferTypeId: dataParams.transferTypeId,
    cargoTypeId: dataParams.cargoTypeId,
    cargoId: dataParams.cargoId,
    totalQuantity: dataParams.totalQuantity,
    units: dataParams.units,
  };
  if (dataParams?.remark) {
    data = { ...data, remark: dataParams.remark };
  }
  return requestAuthorized
    .put<void>(`${ASSETS_API_VESSEL_SCREENING}/${dataParams?.id}`, data)
    .catch((error) => Promise.reject(error));
};

export const updateVesselScreeningShipParticularActionsApi = (
  dataParams: ShipParticular,
) =>
  requestAuthorized
    .post<void>(
      `${ASSETS_API_VESSEL_SCREENING}/${dataParams?.vesselScreeningId}/ship-particular`,
      dataParams,
    )
    .catch((error) => Promise.reject(error));

// NOTED: api for tab table: Maintenance Performance
export const getListVesselScreeningMaintenanceActionsApi = (
  id: string,
  dataParams: GetListVesselScreeningParams,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetListVesselScreeningMaintenance>(
    `${ASSETS_API_VESSEL_SCREENING}/${id}/maintenance-performance?${params}`,
  );
};

export const updateVesselScreeningMaintenanceActionsApi = (
  dataParams: UpdateVesselScreeningParamsMaintenance,
) => {
  const { id, data } = dataParams;
  return requestAuthorized.post(
    `${ASSETS_API_VESSEL_SCREENING}/${id}/maintenance-performance`,
    data,
  );
};

export const getListVesselScreeningOtherTechRecordsActionsApi = (
  id: string,
  dataParams: GetListVesselScreeningParams,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetListVesselScreeningOtherTechRecords>(
    `${ASSETS_API_VESSEL_SCREENING}/${id}/other-technical-records?${params}`,
  );
};

export const updateVesselScreeningOtherTechRecordsActionsApi = (
  dataParams: UpdateVesselScreeningParamsOtherTechRecords,
) => {
  const { id, data } = dataParams;
  return requestAuthorized.post(
    `${ASSETS_API_VESSEL_SCREENING}/${id}/other-technical-records`,
    data,
  );
};

// NOTED: api for tab table: port state control
export const getListVesselScreeningPortStateControlActionsApi = (
  id: string,
  dataParams: GetListVesselScreeningParams,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetListVesselScreeningPortStateControl>(
    `${ASSETS_API_VESSEL_SCREENING}/${id}/port-state-control?${params}`,
  );
};

export const getPortStateRequestDetailApi = (dataParams: CommonApiParam) => {
  const { vesselScreeningId, id } = dataParams;
  return requestAuthorized
    .get<PortStateControlRequest>(
      `${ASSETS_API_VESSEL_SCREENING}/${vesselScreeningId}/port-state-control/${id}`,
    )
    .catch((error) => Promise.reject(error));
};

export const updateVesselScreeningPortStateControlActionsApi = (
  dataParams: UpdateVesselScreeningParamsPortStateControl,
) => {
  const { id, data } = dataParams;
  return requestAuthorized.post(
    `${ASSETS_API_VESSEL_SCREENING}/${id}/port-state-control`,
    data,
  );
};

export const getListVesselScreeningIncidentInvestigationActionsApi = (
  id: string,
  dataParams: GetListVesselScreeningParams,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetListVesselScreeningIncidentInvestigation>(
    `${ASSETS_API_VESSEL_SCREENING}/${id}/incident-investigation?${params}`,
  );
};

export const updateVesselScreeningIncidentInvestigationActionsApi = (
  dataParams: UpdateVesselScreeningParamsIncidentInvestigation,
) => {
  const { id, data } = dataParams;
  return requestAuthorized.post(
    `${ASSETS_API_VESSEL_SCREENING}/${id}/incident-investigation`,
    data,
  );
};

export const getListVesselScreeningDryDockingActionsApi = (
  id: string,
  dataParams: GetListVesselScreeningParams,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetListVesselScreeningDryDocking>(
    `${ASSETS_API_VESSEL_SCREENING}/${id}/dry-docking?${params}`,
  );
};

export const updateVesselScreeningDryDockingActionsApi = (
  dataParams: UpdateVesselScreeningParamsDryDocking,
) => {
  const { id, data } = dataParams;
  return requestAuthorized.post(
    `${ASSETS_API_VESSEL_SCREENING}/${id}/dry-docking`,
    data,
  );
};
