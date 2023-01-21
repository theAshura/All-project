import { requestWithJwt } from "api/request";
import { AxiosResponse } from "axios";
import {
  CalculatorDetail,
  GetListCalculatorResponse,
  ParamGetListCalculator,
} from "./calculator.interface";

export const getCalculatorShareEmail = (
  params: ParamGetListCalculator
): Promise<AxiosResponse<{ data: GetListCalculatorResponse }>> => {
  return requestWithJwt.get<{ data: GetListCalculatorResponse }>(
    "admin/calculator",
    {
      params,
    }
  );
};
export const getCalculatorShareEmailDetail = (
  id: string
): Promise<AxiosResponse<{ data: CalculatorDetail }>> => {
  return requestWithJwt.get<{ data: CalculatorDetail }>(
    `admin/calculator/${id}`
  );
};
