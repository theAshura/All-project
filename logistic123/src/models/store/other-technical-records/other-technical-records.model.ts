import {
  GetDetailOtherTechnicalRecords,
  GetOtherTechnicalRecordsResponse,
} from 'models/api/other-technical-records/other-technical-records.model';
import {
  ListTemplate,
  TemplateDetail,
} from 'models/api/template/template.model';
import {
  CommonApiParam,
  CommonErrorResponse,
  ErrorField,
} from 'models/common.model';

export interface OtherTechnicalRecordsStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  detailOtherTechnicalRecords: GetDetailOtherTechnicalRecords;
  listOtherTechnicalRecords: GetOtherTechnicalRecordsResponse;
  errorList: CommonErrorResponse;
  dataFilter: CommonApiParam;
  // TODO: Template
  content: string;
  errorListTemplate: ErrorField[];
  paramTemplate: CommonApiParam;
  listTemplate: ListTemplate;
  templateDetail: TemplateDetail;
}
