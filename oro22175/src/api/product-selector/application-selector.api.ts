export interface getListApplicationParams {
  page?: string;
  limit?: string;
  content?: string;
  status?: string;
  handleSuccess?: () => void;
  search?: string;
}
import { AxiosResponse } from "axios";
import { requestWithJwt } from "../request";
import {
  ApplicationEditParams,
  ApplicationParams,
  ApplicationResponse,
} from "./application-selector.interface";

export const createApplicationRequest = (
  params: ApplicationParams["dataForm"]
): Promise<AxiosResponse> => {
  return requestWithJwt.post("/admin/application", params);
};
export const editApplicationRequest = (
  params: ApplicationEditParams
): Promise<AxiosResponse> => {
  return requestWithJwt.put(
    `/admin/application/${params?.id}`,
    params.dataForm
  );
};
// export const DetailUserRequest = (params: string): Promise<AxiosResponse> => {
//   return requestWithJwt.post(
//     `https://api.dev.oro.du2.vmo.group/api/v1/users/${params}`
//   );
// };
// step3
export const getListApplicationRequest = (
  params: getListApplicationParams
): Promise<AxiosResponse<ApplicationResponse>> => {
  return requestWithJwt.get<ApplicationResponse>("/admin/application", {
    params,
  });
};

// export const RequestGetListUser = (
//   params: GetListUserParams
// ): Promise<AxiosResponse> => {
//   return requestWithoutJwt.get(
//     `https://api.dev.oro.du2.vmo.group/api/v1/users?${params}`,
//   );
// };

export const deletetApplicationRequest = (
  dataParams: string
): Promise<AxiosResponse<any>> => {
  return requestWithJwt.delete(`/admin/application/${dataParams}`);
};
