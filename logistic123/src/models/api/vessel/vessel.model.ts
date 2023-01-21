import { ExportType, ModuleName } from 'constants/common.const';

interface IName {
  name: string;
  id?: string;
}
interface ICodeName extends IName {
  code: string;
}
interface ICompany extends IName {
  imo: string;
  code: string;
}

interface IVesselType extends IName {
  icon?: string;
}

export interface Owner {
  id: string;
  employeeId: string;
  username: string;
  userType: string;
  controlType: string;
  email: string;
  rank: any;
  departments: any[];
  primaryDepartment: any;
}
export interface DivisionMapping {
  id: string;
  division: {
    id: string;
    code: string;
    name: string;
  };
}

export interface VesselCharterers {
  id?: string;
  companyId: string;
  type: string;
  responsiblePartyInspection: boolean;
  responsiblePartyQA: boolean;
  vesselId?: string;
  fromDate?: string;
  toDate?: string;
  remark?: string;
  company?: {
    id: string;
    code: string;
    name: string;
  };
}

export interface VesselOwners {
  id?: string;
  companyId: string;
  responsiblePartyInspection: boolean;
  responsiblePartyQA: boolean;
  vesselId?: string;
  fromDate?: string;
  toDate?: string;
  remark?: string;
  status?: string;
  company?: {
    id: string;
    code: string;
    name: string;
    companyIMO: string;
  };
}
export interface VesselDocHolder {
  id?: string;
  companyId: string;
  responsiblePartyInspection: boolean;
  responsiblePartyQA: boolean;
  vesselId?: string;
  fromDate?: string;
  toDate?: string;
  remark?: string;
  status?: string;
  company?: {
    id: string;
    code: string;
    name: string;
    companyIMO: string;
  };
}

export interface CreateVesselParams {
  image: string;
  imoNumber: string;
  name: string;
  code: string;
  countryFlag: string;
  vesselTypeId: string;
  callSign: string;
  buildDate: Date | string;
  shipyardName: string;
  shipyardCountry: string;
  officialNumber: string;
  classificationSocietyId: string;
  vesselClass: string;
  hullNumber: string;
  fleetName: string;
  divisionId: string;
  status: 'active';
  docHolderId: string;
  docResponsiblePartyInspection: boolean;
  docResponsiblePartyQA?: boolean;
  deadWeightTonnage: number;
  grt: number;
  nrt: number;
  teuCapacity: string;
  maxDraft: number;
  lightShip: string;
  loa: number;
  lbp: number;
  breath: number;
  height: number;
  depth: number;
  officers: string[];
  rating: string[];
  crewGroupingId: string;
  ownerIds: string[];
  customerRestricted: boolean;
  blacklistOnMOUWebsite: boolean;
  vesselCharterers?: VesselCharterers[];
  vesselOwners?: VesselOwners[];
}

export interface Vessel {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  image: string;
  imoNumber: string;
  name: string;
  code: string;
  countryFlag: string;
  vesselTypeId: string;
  callSign?: string;
  buildDate: Date;
  shipyardName?: string;
  shipyardCountry?: string;
  officialNumber?: string;
  classificationSocietyId: string;
  vesselClass?: string;
  hullNumber?: string;
  fleetName?: string;
  divisionId?: string;
  divisionMapping?: DivisionMapping;
  status?: string;
  docHolderId: string;
  docResponsiblePartyInspection?: boolean;
  docResponsiblePartyQA?: boolean;
  deadWeightTonnage?: string;
  grt: string;
  nrt: string;
  teuCapacity?: string;
  maxDraft?: string;
  lightShip?: string;
  loa?: string;
  lbp?: string;
  breath?: string;
  height?: string;
  depth?: string;
  customerRestricted: boolean;
  blacklistOnMOUWebsite: boolean;
  officers: any[];
  rating: any[];
  crewGroupingId: string;
  companyId?: string;
  createdUserId?: string;
  updatedUserId: null;
  vesselType?: IVesselType;
  company?: ICompany;
  owners?: Owner[];
  classificationSociety: ICodeName;
  division: ICodeName;
  docHolder: ICompany;
  crewGrouping?: ICodeName;
  vesselCharterers?: VesselCharterers[];
  vesselOwners?: VesselOwners[];
  dimensionL?: string;
  dimensionB?: string;
  dimensionH?: string;
  fleet?: {
    name?: string;
  };
  vesselDocHolders?: VesselDocHolder[];
  isImported?: boolean;
}

export interface UpdateVesselParams {
  id: string;
  body: CreateVesselParams;
  handleSuccess?: () => void;
}

export interface ListVesselResponse {
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
  data: Array<Vessel>;
}

export interface GetListVesselParams {
  page?: number;
  pageSize?: number;
  content?: string;
  status?: string;
  sort?: string;
  vesselTypeId?: string;
  isRefreshLoading?: boolean;
  fromPage?: number;
  toPage?: number;
  moduleName?: ModuleName;
}
export interface GetVesselDetail {
  id?: string;
  afterCreate?: () => void;
}
export interface ExportListVesselParams {
  exportType: ExportType;
  params: GetListVesselParams;
}

export interface GetListVesselRequest {
  isLoading?: boolean;
  paramsList?: GetListVesselParams;
}
