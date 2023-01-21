import { CommonApiParam } from 'models/common.model';
import queryString from 'query-string';
import { requestAuthorized } from 'helpers/request';
import {
  CreateOtherTechnicalRecordsParams,
  DeleteOtherTechnicalRecordsParams,
  GetDetailOtherTechnicalRecords,
  GetOtherTechnicalRecordsResponse,
  UpdateOtherTechnicalRecordsParams,
} from 'models/api/other-technical-records/other-technical-records.model';
import { ASSETS_API_OTHER_TECHNICAL } from './endpoints/config.endpoint';

export const getListOtherTechnicalRecordsActionsApi = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetOtherTechnicalRecordsResponse>(
    `${ASSETS_API_OTHER_TECHNICAL}?${params}`,
  );
};
export const createOtherTechnicalRecordsActionsApi = (
  body: CreateOtherTechnicalRecordsParams,
) => requestAuthorized.post<void>(ASSETS_API_OTHER_TECHNICAL, body);
export const updateOtherTechnicalRecordsActionsApi = (
  updateParams: UpdateOtherTechnicalRecordsParams,
) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_OTHER_TECHNICAL}/${updateParams?.id}`,
    updateParams?.body,
  );
export const deleteOtherTechnicalRecordsActionsApi = (
  params: DeleteOtherTechnicalRecordsParams,
) =>
  requestAuthorized.delete<void>(`${ASSETS_API_OTHER_TECHNICAL}/${params.id}`);
export const getDetailOtherTechnicalRecordsActionsApi = (id: string) =>
  requestAuthorized.get<GetDetailOtherTechnicalRecords>(
    `${ASSETS_API_OTHER_TECHNICAL}/${id}`,
  );
