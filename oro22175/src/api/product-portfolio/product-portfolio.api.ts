import { requestWithJwt } from "api/request";
import { AxiosResponse } from "axios";
import {
  ProductPortfolioRequest,
  ProductPortfolioResponse,
} from "./product-portfolio.interface";

export const getProductPortfolio = (): Promise<
  AxiosResponse<ProductPortfolioResponse>
> => {
  return requestWithJwt.get<ProductPortfolioResponse>(
    "admin/configuration/product-portfolio-screen"
  );
};

export const postProductPortfolio = (
  body: ProductPortfolioRequest
): Promise<AxiosResponse<string>> => {
  return requestWithJwt.post<string>(
    "admin/configuration/product-portfolio-screen",
    body
  );
};
