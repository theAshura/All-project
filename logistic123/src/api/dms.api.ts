import { requestAuthorized } from 'helpers/request';
import { UploadResponsive } from 'models/api/audit-inspection-workspace/audit-inspection-workspace.model';
import {
  DMS,
  GetDMSsResponse,
  UpdateDMSParams,
} from 'models/api/dms/dms.model';
import { CommonApiParam } from 'models/common.model';
import queryString from 'query-string';
import {
  ASSETS_API_DMS,
  SUPPORT_API_DELETE_FILES,
  SUPPORT_API_UPLOAD,
  SUPPORT_API_UPLOAD_GET_LIST_IDS,
} from './endpoints/config.endpoint';

export const getListDMSsActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetDMSsResponse>(`${ASSETS_API_DMS}?${params}`);
};

export const deleteDMSActionsApi = (dataParams: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_DMS}/${dataParams}`);

export const createDMSActionsApi = (dataParams: DMS) =>
  requestAuthorized
    .post<void>(ASSETS_API_DMS, dataParams)
    .catch((error) => Promise.reject(error));

export const getDMSDetailActionsApi = (id: string) =>
  requestAuthorized.get<DMS>(`${ASSETS_API_DMS}/${id}`);

export const updateDMSActionsApi = (dataParams: UpdateDMSParams) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_DMS}/${dataParams.id}`,
    dataParams.data,
  );
export const getListFileApi = (data: { ids: any[]; isAttachment?: boolean }) =>
  requestAuthorized.post<UploadResponsive[]>(
    SUPPORT_API_UPLOAD_GET_LIST_IDS,
    data,
  );

export const downloadFileApi = (id) =>
  requestAuthorized.get<string>(`${SUPPORT_API_UPLOAD}/${id}`);

export const deleteFilesApi = (id) =>
  requestAuthorized.post<string>(SUPPORT_API_DELETE_FILES, id);
