import {
  CommonApiParam,
  CommonMessageErrorResponse,
} from 'models/common.model';
import {
  GetAuditCheckListResponse,
  GetAuditCheckListDetailResponse,
  CreateGeneralInfoResponse,
  GetROFFromIARResponsive,
} from 'models/api/audit-checklist/audit-checklist.model';

export interface CreatedAuditCheckList {
  generalInfo?: CreateGeneralInfoResponse;
  questionList?: any;
}

interface ValueModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  code: string;
  number: number;
  status: string;
  description: string;
  companyId: string;
  createdUserId: string;
  updatedUserId: string;
}

export interface AnswerOption {
  id: string;
  createdAt: Date;
  content: string;
  value?: ValueModel;
  idValue?: string;
}

export interface Question {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
  auditChecklistId: string;
  order: number;
  code: string;
  type: string;
  question: string;
  isMandatory: boolean;
  hasRemark: boolean;
  minPictureRequired?: number;
  ratingCriteria?: string;
  hint?: string;
  topicId: string;
  locationId: string;
  mainCategoryId: string;
  createdUserId?: string;
  updatedUserId?: null;
  answerOptions?: AnswerOption[];
  requireEvidencePicture?: boolean;
  companyMixCode?: string;
  vesselTypeMixCode?: string;
}

export interface QuestionsResponse {
  data: Question[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface AuditCheckListStore {
  loading: boolean;
  params: CommonApiParam;
  listAuditCheckList: GetAuditCheckListResponse;
  createdAuditCheckList?: CreatedAuditCheckList;
  auditCheckListDetail?: GetAuditCheckListDetailResponse;
  errorList: CommonMessageErrorResponse[];
  isCreatedInitialData: boolean;
  listQuestion: Question[];
  listROFFromIAR: GetROFFromIARResponsive;
  dataFilter: CommonApiParam;
}

export interface Location {
  code: string;
  name: string;
}

export interface ReferencesCategoryDatum {
  id: string;
  masterTableId: string;
  valueId: string;
  value: string;
}

export interface QuestionDetail {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  auditChecklistId: string;
  order: number;
  code: string;
  type: string;
  question: string;
  isMandatory?: boolean;
  hasRemark?: string;
  remarkSpecificAnswers: string[];
  requireEvidencePicture: boolean;
  minPictureRequired?: number;
  ratingCriteria?: string;
  hint?: string;
  topicId?: string;
  locationId?: string;
  mainCategoryId?: string;
  createdUserId?: string;
  updatedUserId?: string | null;
  answerOptions?: AnswerOption[];
  topic?: Location;
  location?: Location;
  mainCategory?: Location;
  referencesCategoryData?: ReferencesCategoryDatum[];
  attachments?: string[];
  memo?: string;
}
