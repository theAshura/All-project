import {
  ListReportOfFindingResponse,
  ReportOfFinding,
} from 'models/api/report-of-finding/report-of-finding.model';
import { CommonApiParam, ErrorField } from '../../common.model';

export interface ReportOfFindingStore {
  loading: boolean;
  disable: boolean;
  listReportOfFinding: ListReportOfFindingResponse;
  ReportOfFindingDetail: ReportOfFinding;
  errorList: ErrorField[];
  params: CommonApiParam;
  dataFilter: CommonApiParam;
}
