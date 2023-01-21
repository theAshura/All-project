import { CommonApiParam, ErrorField } from 'models/common.model';
import {
  GetSailReportInspectionInternalResponse,
  SailReportInspectionInternal,
} from 'models/api/sail-report-inspection-internal/sail-report-inspection-internal.model';

export interface SailReportInspectionInternalModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  listSailReportInspectionInternal: GetSailReportInspectionInternalResponse;
  sailReportInspectionInternalDetail: SailReportInspectionInternal;
  errorList: ErrorField[];
  dataFilter: CommonApiParam;
}
