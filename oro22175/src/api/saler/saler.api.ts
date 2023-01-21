import { requestWithJwt } from "api/request";
import { AxiosResponse } from "axios";
import {
  DataSaler,
  GetListSalerResponse,
  ListSalerParams,
  PostSalerParams,
  StateParams,
  StateResponse,
} from "./saler.interface";

export const getListSeller = (
  params: ListSalerParams
): Promise<AxiosResponse<{ data: GetListSalerResponse }>> => {
  return requestWithJwt.get<{ data: GetListSalerResponse }>("admin/sellers", {
    params,
  });
};

export const postSeller = (
  body: PostSalerParams
): Promise<AxiosResponse<string>> => {
  return requestWithJwt.post<string>("admin/sellers", body);
};

export const putSeller = (
  id: string,
  body: PostSalerParams
): Promise<AxiosResponse<string>> => {
  return requestWithJwt.put<string>(`admin/sellers/${id}`, body);
};

export const getSellerDetail = (
  id: string
): Promise<AxiosResponse<{ data: DataSaler }>> => {
  return requestWithJwt.get<{ data: DataSaler }>(`admin/sellers/${id}`);
};

export const deleteSeller = (id: string): Promise<AxiosResponse<string>> => {
  return requestWithJwt.delete<string>(`admin/sellers/${id}`);
};

export const getListStates = (
  params: StateParams
): Promise<AxiosResponse<StateResponse>> => {
  return requestWithJwt.get<StateResponse>("admin/states", {
    params,
  });
};
