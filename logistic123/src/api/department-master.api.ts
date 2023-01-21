import { requestAuthorized } from 'helpers/request';
import queryString from 'query-string';
import { CommonApiParam } from 'models/common.model';
import {
  DepartmentMaster,
  ListDepartmentMasterResponse,
  UpdateDepartmentMasterParams,
} from 'models/api/department-master/department-master.model';
import { ASSETS_API_DEPARTMENT } from './endpoints/config.endpoint';

export const getListDepartmentMasterActionsApi = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<ListDepartmentMasterResponse>(
    `${ASSETS_API_DEPARTMENT}?${params}`,
  );
};

export const deleteDepartmentMasterActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_DEPARTMENT}/${dataParams}`);

export const createDepartmentMasterActionsApi = (
  dataParams: DepartmentMaster,
) =>
  requestAuthorized
    .post<DepartmentMaster>(ASSETS_API_DEPARTMENT, dataParams)
    .catch((error) => Promise.reject(error));

export const getDetailDepartmentMasterActionApi = (id: string) =>
  requestAuthorized.get<DepartmentMaster>(`${ASSETS_API_DEPARTMENT}/${id}`);

export const updateDepartmentMasterActionApi = (
  dataParam: UpdateDepartmentMasterParams,
) =>
  requestAuthorized
    .put<void>(`${ASSETS_API_DEPARTMENT}/${dataParam.id}`, dataParam.data)
    .catch((error) => Promise.reject(error));

export const getDepartmentLastAuditTimeAndDueDateApi = (
  id: string,
  auditTypeIds?: string[],
) =>
  requestAuthorized.get<string>(
    `${ASSETS_API_DEPARTMENT}/${id}/last-audit-time-and-due-date`,
    { params: { auditTypeIds } },
  );

export const getDepartmentsLastAuditTimeAndDueDateApi = (
  departmentIds: string[],
  auditTypeIds?: string[],
) =>
  requestAuthorized.post<string>(
    `${ASSETS_API_DEPARTMENT}/last-audit-time-and-due-date`,
    { departmentIds, auditTypeIds },
  );
