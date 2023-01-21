import { AxiosResponse } from "axios";
import { requestWithoutJwt } from "../request";
import { FormLoginProps, LoginResponse } from "./auth.interface";

export const loginRequest = (
  params: FormLoginProps
): Promise<AxiosResponse<LoginResponse>> => {
  return requestWithoutJwt.post<LoginResponse>("/auth/login", params);
};
