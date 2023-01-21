import { requestAuthorized } from 'helpers/request';
import {
  CreateConditionClassDispensationsParams,
  GetConditionOfClassResponse,
  UpdateConditionOfClassParams,
  ConditionOfClassDetailResponse,
} from 'models/api/condition-of-class/condition-of-class.model';
import { CommonApiParam } from 'models/common.model';
import queryString from 'query-string';
import {
  ASSETS_API_CLASS_DEDENSATIONS,
  ASSETS_API_CLASS_DEDENSATIONS_VESSEL,
} from './endpoints/config.endpoint';

export const getListConditionOfClassActionsApi = (
  dataParams: CommonApiParam,
) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<GetConditionOfClassResponse>(
    dataParams?.vesselScreeningId
      ? `${ASSETS_API_CLASS_DEDENSATIONS_VESSEL}/${dataParams?.vesselScreeningId}/class-dispensations?${params}`
      : `${ASSETS_API_CLASS_DEDENSATIONS}?${params}`,
  );
};

export const deleteConditionOfClassActionsApi = (conditionClassId: string) =>
  requestAuthorized.delete<void>(
    `${ASSETS_API_CLASS_DEDENSATIONS}/${conditionClassId}`,
  );

export const getConditionOfClassDetailActionsApi = (id: string) =>
  requestAuthorized.get<ConditionOfClassDetailResponse>(
    `${ASSETS_API_CLASS_DEDENSATIONS}/${id}`,
  );

export const updateConditionOfClassDetailActionsApi = (
  dataParams: UpdateConditionOfClassParams,
) =>
  dataParams?.vesselScreeningId
    ? requestAuthorized.post<void>(
        `${ASSETS_API_CLASS_DEDENSATIONS_VESSEL}/${dataParams?.vesselScreeningId}/class-dispensations`,
        dataParams.data,
      )
    : requestAuthorized.put<void>(
        `${ASSETS_API_CLASS_DEDENSATIONS}/${dataParams.id}`,
        dataParams.data,
      );

export const createConditionOfClassActionsApi = (
  dataParams: CreateConditionClassDispensationsParams,
) =>
  requestAuthorized
    .post<void>(ASSETS_API_CLASS_DEDENSATIONS, dataParams)
    .catch((error) => Promise.reject(error));
