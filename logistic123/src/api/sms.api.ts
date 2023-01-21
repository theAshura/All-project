import { requestAuthorized } from 'helpers/request';
import {
  CreateSmsParams,
  GetSmsResponse,
  UpdateSmsParams,
  SmsDetailResponse,
} from 'models/api/sms/sms.model';
import { CommonApiParam } from 'models/common.model';
import queryString from 'query-string';
import {
  ASSETS_API_SMS,
  ASSETS_API_VESSEL_SCREENING,
} from './endpoints/config.endpoint';

export const getListSmsActionsApi = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetSmsResponse>(
    dataParams?.vesselScreeningId
      ? `${ASSETS_API_VESSEL_SCREENING}/${dataParams?.vesselScreeningId}/other-sms-records?${params}`
      : `${ASSETS_API_SMS}?${params}`,
  );
};

export const deleteSmsActionsApi = (conditionClassId: string) =>
  requestAuthorized.delete<void>(`${ASSETS_API_SMS}/${conditionClassId}`);

export const getSmsDetailActionsApi = (id: string) =>
  requestAuthorized.get<SmsDetailResponse>(`${ASSETS_API_SMS}/${id}`);

export const updateSmsDetailActionsApi = (dataParams: UpdateSmsParams) =>
  requestAuthorized.put<void>(
    `${ASSETS_API_SMS}/${dataParams.id}`,
    dataParams.data,
  );

export const createSmsActionsApi = (dataParams: CreateSmsParams) =>
  requestAuthorized
    .post<void>(ASSETS_API_SMS, dataParams)
    .catch((error) => Promise.reject(error));
