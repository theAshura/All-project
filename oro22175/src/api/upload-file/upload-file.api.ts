import { RcFile } from "antd/es/upload";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { requestWithJwt, requestWithoutJwt } from "../request";
import { FileUploads, UploadFileResponse } from "./upload-file.interface";

// export const uploadFileRequest = (
//   files: FileUploads[]
// ): Promise<AxiosResponse<UploadFileResponse[]>> => {
//   const formData = new FormData();
//   files.forEach((file) => {
//     formData.append("files", file.originalFile as RcFile);
//   });

//   const config = {
//     headers: { "Content-Type": "multipart/form-data" },
//   } as AxiosRequestConfig;
//   return requestWithJwt.post<UploadFileResponse[]>(
//     "/uploads",
//     formData,
//     config
//   );
// };

export const getFileByIdRequest = (
  id: string
): Promise<AxiosResponse<string>> => {
  return requestWithoutJwt.get<string>(`/uploads/${id}`);
};

export const uploadFileModuleRequest = (
  screen: string,
  file: FileUploads
): Promise<AxiosResponse<UploadFileResponse[]>> => {
  const formData = new FormData();
  formData.append("file", file.originalFile as File);

  const config = {
    headers: { "Content-Type": "multipart/form-data" },
  } as AxiosRequestConfig;
  return requestWithJwt.post<UploadFileResponse[]>(
    `/uploads/${screen}`,
    formData,
    config
  );
};
