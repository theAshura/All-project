import {
  GetDetailSurveyClassInfo,
  GetSurveyClassInfoResponse,
} from 'models/api/survey-class-info/survey-class-info.model';
import {
  ListTemplate,
  TemplateDetail,
} from 'models/api/template/template.model';
import {
  CommonApiParam,
  CommonErrorResponse,
  ErrorField,
} from 'models/common.model';

export interface SurveyClassInfoStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  detailSurveyClassInfo: GetDetailSurveyClassInfo;
  listSurveyClassInfo: GetSurveyClassInfoResponse;
  errorList: CommonErrorResponse;
  dataFilter: CommonApiParam;
  // TODO: Template
  content: string;
  errorListTemplate: ErrorField[];
  paramTemplate: CommonApiParam;
  listTemplate: ListTemplate;
  templateDetail: TemplateDetail;
}
