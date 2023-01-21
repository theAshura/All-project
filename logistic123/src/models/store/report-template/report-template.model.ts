import { ErrorField, CommonApiParam } from 'models/common.model';

import {
  GetReportTemplatesResponse,
  ReportTemplateDetailResponse,
} from '../../api/report-template/report-template.model';

export interface ReportTemplateStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  listReportTemplates: GetReportTemplatesResponse;
  ReportTemplateDetail: ReportTemplateDetailResponse;
  errorList: ErrorField[];
  dataFilter: CommonApiParam;
}
