export enum Filters {
  safetyScore = 'safetyScore',
  docSafetyScore = 'docSafetyScore',
  ghgRating = 'ghgRating',
  lastInspectionValidity = 'lastInspectionValidity',
  customerRestricted = 'customerRestricted',
  blacklistOnMOUWebsite = 'blacklistOnMOUWebsite',
  rightShip = 'rightShip',
}

export interface RightShipModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  vesselId: string;
  buildDate: string;
  docHolderName: string;
  docHolderCode: string;
  ghgRatingDate: string;
  ghgRating: string;
  evdi: string;
  verified: boolean;
  plus: string;
  safetyScore: string;
  safetyScoreDate: string;
  indicativeScore: boolean;
  inspectionRequired: string;
  docSafetyScore: string;
  latInspectionOutcome: string;
  lastInspectionValidity: null;
  technicalManagerName: string;
  technicalManagerOwCode: string;
  vessel?: {
    customerRestricted?: boolean;
    blacklistOnMOUWebsite?: boolean;
  };
}

export interface RightShipResponse {
  data: RightShipModel[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface RightShipStore {
  loading: boolean;
  listRightShip: RightShipResponse;
}
