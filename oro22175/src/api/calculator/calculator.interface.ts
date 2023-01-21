export interface ParamGetListCalculator {
  page?: string;
  limit?: string;
  content?: string;
}

export interface GetListCalculatorResponse {
  count: number;
  currentPage: number;
  data: CalculatorDetail[];
  totalPage: number;
}

export interface CalculatorDetail {
  _id: string;
  subject: string;
  from: string;
  to: string[];
  productCalculations: ProductCalculation[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface ProductCalculation {
  productName: string;
  rate: number;
  quantitative: string;
  sprayVolume: number;
  productCostGal: number;
  productCostAc: number;
}
