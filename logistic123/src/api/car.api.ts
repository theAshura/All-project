import { requestAuthorized } from 'helpers/request';
import {
  ListCarResponse,
  CreateCarParams,
  ReviewCarCapParams,
  VerifyCarParams,
  CreateCapParams,
  ICapDetailRes,
} from 'models/api/car/car.model';
import { CommonApiParam } from 'models/common.model';
import queryString from 'query-string';
import { ASSETS_API_CAR } from './endpoints/config.endpoint';

export const getListCarApiRequest = (dataParams: CommonApiParam) => {
  const params = queryString.stringify(dataParams);
  return requestAuthorized.get<ListCarResponse>(`${ASSETS_API_CAR}?${params}`);
};

export const createCarApiRequest = (params: CreateCarParams) =>
  requestAuthorized.post<any>(`${ASSETS_API_CAR}`, params);

export const getDetailCarApiRequest = (id: string) =>
  requestAuthorized.get<ICapDetailRes>(`${ASSETS_API_CAR}/${id}`);

export const updateCarApiRequest = (dataParams: CreateCarParams) =>
  requestAuthorized.put<void>(`${ASSETS_API_CAR}/${dataParams.id}`, dataParams);

export const deleteCarApiRequest = (id: string) =>
  requestAuthorized.delete<any>(`${ASSETS_API_CAR}/${id}`);

export const reviewCarAndCapApiRequest = (params: ReviewCarCapParams) => {
  const { carId, capId, ...data } = params;
  return requestAuthorized.post<any>(
    `${ASSETS_API_CAR}/${carId}/cap/${capId}/review`,
    data,
  );
};

export const verifyCarApiRequest = (params: VerifyCarParams) => {
  const { carId, ...data } = params;
  return requestAuthorized.post<any>(
    `${ASSETS_API_CAR}/${carId}/verification`,
    data,
  );
};

export const getDetailCarCapHistory = ({ carId, capId }) =>
  requestAuthorized.get<any>(`${ASSETS_API_CAR}/${carId}/cap/${capId}/history`);

export const createCapApiRequest = (params: CreateCapParams) => {
  const { carId, ...bodyParams } = params;
  return requestAuthorized.post<any>(
    `${ASSETS_API_CAR}/${carId}/cap`,
    bodyParams,
  );
};
export const updateCapApiRequest = (params: CreateCapParams) => {
  const { carId, capId, ...bodyParams } = params;
  return requestAuthorized.put<any>(
    `${ASSETS_API_CAR}/${carId}/cap/${capId}`,
    bodyParams,
  );
};

export const getDetailCarParApiRequest = (carId) =>
  requestAuthorized.get<any>(`${ASSETS_API_CAR}/${carId}/planning-request`);
