import { requestWithJwt } from "api/request";
import { AxiosResponse } from "axios";
import {
  ProductTectnologiesRequest,
  ProductTectnologiesResponse,
} from "./product-technologies.interface";

export const getProductTechnologies = (): Promise<
  AxiosResponse<ProductTectnologiesResponse>
> => {
  return requestWithJwt.get<ProductTectnologiesResponse>(
    "admin/configuration/product-technologies-screen"
  );
};

export const postProductTechnologies = (
  body: ProductTectnologiesRequest
): Promise<AxiosResponse<string>> => {
  return requestWithJwt.post<string>(
    "admin/configuration/product-technologies-screen",
    body
  );
};
