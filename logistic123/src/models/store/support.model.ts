export interface Province {
  value: string | number;
  id: number;
  countryId: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Country {
  id: number;
  code?: string;
  code3?: string;
  name: string;
  nationality?: string;
  dialCode?: string;
  flagImg?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GetCountryParams {
  content?: string;
}
export interface GetProvinceParams {
  countryId: string;
  data?: GetCountryParams;
}
