import { CommonApiParam } from 'models/common.model';

export interface Vessel {
  id: string;
  code: string;
  name: string;
  vesselType: {
    id: string;
    code: string;
    name: string;
  };
}

export interface Company {
  id: string;
  name: string;
  code: string;
}

export interface VoyageInfo {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  vesselId: string;
  companyId: string;
  voyageStatus: string;
  voyageNo: string;
  opsCoordinator: string;
  loadDate: Date;
  consecutive: string;
  firstTCI: string;
  lastTCI: string;
  totalLoadCargoVol: string;
  tradeAreaNo: string;
  firstLoadPortNo: string;
  firstLoadPort: string;
  lastDischargePortNo: string;
  lastDischargePort: string;
  fixtureNo: string;
  estimateId: string;
  cargoGradesList: string;
  cargoCounterpartyShortnames: string;
  imosUrl: string;
  lastUpdateGMT: Date;
  completeDateGMT: Date;
  commenceDateGMT: Date;
  oprType: string;
  commenceDateLocal: Date;
  completeDateLocal: Date;
  cargoNo: string;
  cargoName: string;
  vessel: Vessel;
  company: Company;
}

export interface GetVoyageInfoResponse {
  data: VoyageInfo[];
  page?: number;
  pageSize?: number;
  totalPage?: number;
  totalItem?: number;
}

export interface VoyageInfoDetailResponse {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  vesselId: string;
  companyId: string;
  voyageStatus: string;
  voyageNo: string;
  opsCoordinator: string;
  loadDate: Date;
  consecutive: string;
  firstTCI: string;
  lastTCI: string;
  totalLoadCargoVol: string;
  tradeAreaNo: string;
  firstLoadPortNo: string;
  firstLoadPort: string;
  lastDischargePortNo: string;
  lastDischargePort: string;
  fixtureNo: string;
  estimateId: string;
  cargoGradesList: string;
  cargoCounterpartyShortnames: string;
  imosUrl: string;
  lastUpdateGMT: Date;
  completeDateGMT: Date;
  commenceDateGMT: Date;
  oprType: string;
  commenceDateLocal: Date;
  completeDateLocal: Date;
  cargoNo: string;
  cargoName: string;
  vessel: Vessel;
  company: Company;
}

export interface VoyageInfoStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  listVoyageInfo: GetVoyageInfoResponse;
  voyageInfoDetail: VoyageInfoDetailResponse;
}
