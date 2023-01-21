import { requestWithJwt } from "api/request";
import { AxiosResponse } from "axios";
import {
  ParamSearchProducts,
  ProductDetailResponse,
  ProductRequest,
  ProductResponse,
} from "./product.interface";

export const getProducts = (
  params: ParamSearchProducts
): Promise<AxiosResponse<{ data: ProductResponse }>> => {
  return requestWithJwt.get<{ data: ProductResponse }>("admin/products", {
    params,
  });
};

export const postProduct = (
  body: ProductRequest
): Promise<AxiosResponse<string>> => {
  return requestWithJwt.post<string>("admin/products", body);
};

export const putProduct = (
  id: string,
  body: ProductRequest
): Promise<AxiosResponse<string>> => {
  return requestWithJwt.put<string>(`admin/products/${id}`, body);
};

export const getProduct = (
  id: string
): Promise<AxiosResponse<{ data: ProductDetailResponse }>> => {
  return requestWithJwt.get<{ data: ProductDetailResponse }>(
    `admin/products/${id}`
  );
};

export const deleteProduct = (id: string): Promise<AxiosResponse<string>> => {
  return requestWithJwt.delete<string>(`admin/products/${id}`);
};
