import { requestWithJwt } from "api/request";
import { AxiosResponse } from "axios";
import {
  CropGuideDetailResponse,
  ParamSearchCropGuide,
  CropGuidePostParams,
  CropGuideResponse,
} from "./crop-guide.interface";

export const getCropGuide = (
  params: ParamSearchCropGuide
): Promise<AxiosResponse<{ data: CropGuideResponse }>> => {
  return requestWithJwt.get<{ data: CropGuideResponse }>("admin/crop-guides", {
    params,
  });
};

export const postCropGuide = (
  body: CropGuidePostParams
): Promise<AxiosResponse<string>> => {
  return requestWithJwt.post<string>("admin/crop-guides", body);
};

export const putCropGuide = (
  id: string,
  body: CropGuidePostParams
): Promise<AxiosResponse<string>> => {
  return requestWithJwt.put<string>(`admin/crop-guides/${id}`, body);
};

export const getCropGuideDetail = (
  id: string
): Promise<AxiosResponse<{ data: CropGuideDetailResponse }>> => {
  return requestWithJwt.get<{ data: CropGuideDetailResponse }>(
    `admin/crop-guides/${id}`
  );
};

export const deleteCropGuide = (id: string): Promise<AxiosResponse<string>> => {
  return requestWithJwt.delete<string>(`admin/crop-guides/${id}`);
};
