import { AxiosResponse } from "axios";
import { requestWithJwt } from "../request";
import {
  ChangePasswordParams,
  UpdateUserProfileParams,
} from "./user.interface";

export const updateUserProfile = (
  params: Partial<UpdateUserProfileParams>
): Promise<AxiosResponse<void>> => {
  let newParams: Partial<UpdateUserProfileParams> = {
    employeeName: params?.employeeName,
  };
  if (params?.email !== "") {
    newParams = {
      ...newParams,
      email: params?.email,
    };
  }

  return requestWithJwt.put<void>("/admin/users/my-profile", newParams);
};

export const changePassword = (
  params: ChangePasswordParams
): Promise<AxiosResponse<void>> => {
  return requestWithJwt.put<void>("/admin/users/me/change-password", params);
};
