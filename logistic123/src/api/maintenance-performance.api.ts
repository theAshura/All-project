import { CommonApiParam } from 'models/common.model';
import queryString from 'query-string';
import { requestAuthorized } from 'helpers/request';
import {
  CreateMaintenancePerformanceParams,
  DeleteMaintenancePerformanceParams,
  GetDetailMaintenancePerformance,
  GetMaintenancePerformanceResponse,
  UpdateMaintenancePerformanceParams,
} from 'models/api/maintenance-performance/maintenance-performance.model';
import { ASSETS_API_MAINTENANCE_PERFORMANCE } from './endpoints/config.endpoint';

export const getListMaintenancePerformanceActionsApi = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetMaintenancePerformanceResponse>(
    `${ASSETS_API_MAINTENANCE_PERFORMANCE}?${params}`,
  );
};
export const createMaintenancePerformanceActionsApi = (
  body: CreateMaintenancePerformanceParams,
) => requestAuthorized.post<void>(ASSETS_API_MAINTENANCE_PERFORMANCE, body);
export const updateMaintenancePerformanceActionsApi = (
  updateParams: UpdateMaintenancePerformanceParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_MAINTENANCE_PERFORMANCE}/${updateParams?.id}`,
    updateParams?.body,
  );
export const deleteMaintenancePerformanceActionsApi = (
  params: DeleteMaintenancePerformanceParams,
) =>
  requestAuthorized.delete<void>(
    `${ASSETS_API_MAINTENANCE_PERFORMANCE}/${params.id}`,
  );
export const getDetailMaintenancePerformanceActionsApi = (id: string) =>
  requestAuthorized.get<GetDetailMaintenancePerformance>(
    `${ASSETS_API_MAINTENANCE_PERFORMANCE}/${id}`,
  );
