import { ElementMaster } from 'models/api/element-master/element-master.model';
import {
  ErrorField,
  CommonApiParam,
  UserAssignments,
  UsersPermissions,
} from 'models/common.model';

export enum Status {
  active = 'active',
  inactive = 'inactive',
}

export interface GetVersionSelfAssessmentParam {
  timezone: string;
}

export interface GetVersionSelfAssessmentResponse {
  code: string;
  verifySignature: string;
}

export interface Child {
  parentId?: string;
  topic?: string;
  minScore?: number;
  maxScore?: number;
  topicType?: string;
  serialNumber?: string;
  type?: string;
  printOption?: string;
}

export interface CreatedUser {
  username: string;
}

export interface UserHistory {
  createdAt: string;
  comment?: string;
  createdUser: {
    id: string;
    jobTitle: string;
    username: string;
  };
  id: string;
  status: string;
  updatedAt?: string;
}

export interface ParamsList {
  page?: number;
  pageSize?: number;
  content?: string;
  status?: string;
  version?: string;
  sort?: string;
}
export interface GetSelfAssessmentParams {
  isRefreshLoading: boolean;
  paramsList: ParamsList;
  getList?: () => void;
}

export interface CreateSelfAssessmentParams {
  type?: string;
  standardMasterId?: string;
  lastExternalSubmission?: string;
  submittedTo?: string;
  inspectionTypeId?: string;
  authorityId?: string;
  attachments?: string[];
  closeOpenReviewPrep?: boolean;
  userAssignment?: {
    selfAssessmentId?: string;
    usersPermissions?: UsersPermissions[];
  };
}

export interface UpdateSelfAssessmentParams {
  id: string;
  data: CreateSelfAssessmentParams;
  handleSuccess?: () => void;
}

export interface GetListSelfDeclarationParams {
  selfAssessmentId: string;
  params: CommonApiParam;
  handleSuccess?: () => void;
}

export interface GetSelfDeclarationDetailParams {
  id: string;
  selfAssessmentId: string;
  handleSuccess?: () => void;
}

export interface Compliance {
  answer: string;
  compliance: number;
  colour: string;
}

export interface ReOpenDeclarationParams {
  selfAssessmentId: string;
  selfDeclarationIds: string[];
  handleSuccess?: () => void;
}

export interface ReassignDeclarationParams {
  id: string;
  selfAssessmentId: string;
  comment?: string;
  handleSuccess?: () => void;
}

export interface SelfAssessmentMatrixParams {
  selfAssessmentId: string;
  handleSuccess?: () => void;
}

export interface UnpublishSelfAssessmentParams {
  id: string;
  handleSuccess?: () => void;
}

export interface PublishSelfAssessmentParams {
  id: string;
  handleSuccess?: () => void;
}

export interface VesselType {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  code: string;
  name: string;
  vettingRiskScore: number;
  status: string;
  description: string;
  companyId: string;
  createdUserId: string;
  updatedUserId: string;
}
export interface SelfAssessmentDetailResponse {
  closeOpenReviewPrep: boolean;
  authority?: any;
  authorityId?: string;
  attachments: string[];
  company: { name: string };
  companyId: string;
  createdAt: string;
  createdUserId: string;
  id: string;
  inspectionTypeId: any;
  lastExternalSubmission: string;
  sNo: string;
  selfAssessmentStatus: string;
  createdUser?: { username: string };
  inspectionType?: any;
  selfDeclarations: any[];
  standardMaster: {
    code: string;
    name: string;
    scoreApplicable: boolean;
  };
  updatedUser?: any;
  standardMasterId: string;
  status: string;
  submittedTo: string;
  type: string;
  updatedAt: string;
  updatedUserId: any;
  userAssignments?: UserAssignments[];
  companyName?: string;
}

export interface ReviewPrepComment {
  id?: string;
  topic: string;
  description: string;
  attachments?: string[];
}

export interface GetSelfAssessmentResponse {
  data: SelfAssessmentDetailResponse[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface SelfDeclarationDetailResponse {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  status: string;
  selfClose: boolean;
  closeOpenReviewPrep: boolean;
  targetCompletionDate: any;
  attachments: string[];
  elementMasterId: string;
  selfAssessmentId: string;
  complianceId: string;
  elementMaster: ElementMaster;
  compliance: Compliance;
  companyCommentInternal?: string;
  companyCommentExternal?: string;
  newestInternalComment?: string;
  newestExternalComment?: string;
  refId?: string;
  type?: string;
  selfAssessment?: {
    sNo?: string;
    type?: string;
    status?: string;
    userAssignments?: UserAssignments[];
    createdUserId?: string;
  };
  selfDeclarationDocuments?: {
    id: string;
    documentTitle: string;
  }[];
  selfDeclarationReferences?: {
    id: string;
    documentTitle: string;
    attachments: string[];
  }[];
  selfDeclarationHistories?: UserHistory[];
  reviewPrepComments?: ReviewPrepComment[];
  workFlow?: any[];
  operatingManagerCompletionDate?: string;
  operatingManager?: any;
  proposal?: string;
  newestOpManagerComment?: any;
}

export interface LookBackComment {
  id: string;
  type?: string;
  standard?: string;
  element?: string;
  stage?: string;
  questionNo?: string;
  comment?: string;
  selfDeclaration?: SelfDeclarationDetailResponse;
}

export interface GetLookBackCommentResponse {
  data: LookBackComment[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface Header {
  topic?: string;
  auditTypeIds?: string[];
  minScore?: number;
  maxScore?: number;
  serialNumber?: string;
  children: Header[];
}

export interface GetSelfDeclarationResponse {
  data: SelfDeclarationDetailResponse[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface updateSelfAssessmentHeaderParam {
  id?: string;
  topic?: string;
  auditTypeIds?: string[];
  minScore?: number;
  maxScore?: number;
}

export interface User {
  username: string;
}
export interface Company {
  name: string;
  code: string;
}

export interface ComplianceAnswer {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  standardMasterId: string;
  answer: string;
  compliance: string | number;
  colour: string;
}
export interface StandardMasterElements {
  standardMasterId: string;
  lastUpdatedById: string;
  lastUpdatedOn: string;
  status: string;
  lastUpdatedBy: User;
}

export interface ElementMasterIds {
  id: string;
}

export interface StandardMaster {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  code?: string;
  name?: string;
  status?: string;
  companyId?: string;
  company?: Company;
  fieldName?: string;
  scoreApplicable?: boolean;
  others?: null;
  levels?: string[];
  createdUser?: User;
  updatedUser?: any;
  createdUserId?: string;
  updatedUserId?: any;
  complianceAnswers?: ComplianceAnswer[];
  standardMasterElements?: StandardMasterElements;
  elementMasters?: ElementMasterIds[];
}

export interface SelfDeclarationComment {
  type: string;
  comment: string;
}
export interface SelfDeclarationDocument {
  documentTitle: string;
}
export interface SelfDeclarationReference {
  referenceModule: string;
  attachments: string[];
}

export interface SelfDeclarationParams {
  complianceId?: string;
  selfClose?: boolean;
  targetCompletionDate?: Date | string;
  selfDeclarationComment?: SelfDeclarationComment[];
  selfDeclarationDocument?: SelfDeclarationDocument[];
  selfDeclarationReference?: SelfDeclarationReference[];
  reviewPrepComment?: ReviewPrepComment[];
  attachments?: string[];
  selfDeclarationHistory?: {
    status?: string;
    comment: any;
  };
}

export interface ApproveSelfDeclarationParams {
  selfAssessmentId: string;
  id: string;
  data: SelfDeclarationParams;
  handleSuccess?: () => void;
}

export interface MatrixCompliance {
  id: string;
  compliance: number;
  colour: string;
  answer?: string;
}

export interface SelfAssessmentMatrixCell {
  id: string;
  status: string;
  selfClose: boolean;
  compliance: MatrixCompliance;
  elementMaster: {
    id: string;
    code: string;
    name: string;
    number: number;
    stage: string;
    questionNumber: number;
    elementStageQ: string;
  };
}

export interface SelfAssessmentMatrixResponse {
  stages: string[];
  selfDeclarations: SelfAssessmentMatrixCell[];
  compliances: MatrixCompliance[];
}

export interface SelfAssessmentStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  listSelfAssessment: GetSelfAssessmentResponse;
  listSelfDeclaration: GetSelfDeclarationResponse;
  selfAssessmentDetail: SelfAssessmentDetailResponse;
  selfDeclarationDetail: SelfDeclarationDetailResponse;
  listLookUpCompanyComment: GetLookBackCommentResponse;
  standardMasterDetail: StandardMaster;
  errorList: ErrorField[];
  dataFilter: CommonApiParam;
  selfAssessmentMatrix: SelfAssessmentMatrixResponse;
}

export interface ComplianceAndTargetDateSelfAssessment {
  selfAssessmentId: string;
  selfDeclaration: string;
  complianceId?: string;
  targetCompletionDate?: string;
}
