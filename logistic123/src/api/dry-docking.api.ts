import {
  CreateDryDockingParams,
  DeleteDryDockingParams,
  GetDryDockingParams,
  UpdateDryDockingParams,
} from 'models/api/dry-docking/dry-docking.model';
import queryString from 'query-string';
import { requestAuthorized } from 'helpers/request';
import { ASSETS_API_DRY_DOCKING } from './endpoints/config.endpoint';

export const getListDryDockingActionsApi = (
  dataParams: GetDryDockingParams,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<any>(`${ASSETS_API_DRY_DOCKING}?${params}`);
};
export const createDryDockingActionsApi = (body: CreateDryDockingParams) =>
  requestAuthorized.post<void>(ASSETS_API_DRY_DOCKING, body);
export const updateDryDockingActionsApi = (
  updateParams: UpdateDryDockingParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_DRY_DOCKING}/${updateParams?.id}`,
    updateParams?.body,
  );
export const deleteDryDockingActionsApi = (params: DeleteDryDockingParams) =>
  requestAuthorized.delete<void>(`${ASSETS_API_DRY_DOCKING}/${params.id}`);
export const getDetailDryDockingActionsApi = (id: string) =>
  requestAuthorized.get<any>(`${ASSETS_API_DRY_DOCKING}/${id}`);
