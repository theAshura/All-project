export interface CreateCarParams {
  actionRequest: string;
  capTargetPeriod: number;
  periodType: string;
  capTargetEndDate: string;
  reportFindingItemIds: string[];
  planningRequestId: string;
  id?: string;
}

export interface ReviewCarCapParams {
  capId: string;
  carId: string;
  status: string;
  comment: string;
}

export interface VerifyCarParams {
  carId?: string;
  isNeeded?: boolean;
  types: string[];
  status: string;
  verifiedDate?: string;
  verifyBy?: string;
  reason: string;
  attachments?: string[];
}

export interface CreateCapParams {
  actionRequest?: string;
  carId?: string;
  capId?: string;
  planAction?: string;
  rootCause?: string;
  ecdCap?: string;
  acdCap?: string;
  picCap?: string;
  preventiveAction?: string;
  ecdPrevent?: string;
  acdPrevent?: string;
  picPrevent?: string;
  status?: string;
  comments?: {
    comment: string;
    serialNumber: string;
  }[];
}

export interface ICapDetailRes {
  id: string;
  createdAt: string;
  updatedAt: string;
  refNo: string;
  status: string;
  actionRequest: string;
  capTargetPeriod: number;
  periodType: string;
  capTargetEndDate: string;
  attachments: string[];
  planningRequestId: string;
  createdUserId: string;
  updatedUserId: string;
  companyId: string;
  cap: {
    id: string;
    createdAt: string;
    updatedAt: string;
    planAction: string;
    rootCause: string;
    ecdCap: string;
    acdCap: string;
    picCap: string;
    status: string;
    preventiveAction: string;
    ecdPrevent: string;
    acdPrevent: string;
    picPrevent: string;
    createdUserId: string;
    updatedUserId: string;
    companyId: string;
    carId: string;
    capComments: any;
  };
  cARVerification: {
    id: string;
    createdAt: string;
    updatedAt: string;
    isNeeded: boolean;
    reason: string;
    type: string[];
    verifiedDate: string;
    verifiedById: string;
    carId: string;
    attachments: string[];
    createdUserId: string;
    updatedUserId: string;
    companyId: string;
    verifyBy?: string;
    status: string;
  };
  reportFindingItems: [
    {
      id: string;
      natureFindingName: string;
      findingRemark: string;
      findingComment: string;
      reference: string;
    },
  ];
}

export interface ListCarResponse {
  data: ICapDetailRes[];
}
