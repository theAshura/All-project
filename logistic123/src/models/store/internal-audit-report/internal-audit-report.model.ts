import { AvatarType, CommonApiParam, ErrorField } from 'models/common.model';
import { InspectionFollowUp } from '../../api/inspection-follow-up/inspection-follow-up.model';
import {
  GetInternalAuditReportsResponse,
  InternalAuditReportDetailResponse,
} from '../../api/internal-audit-report/internal-audit-report.model';

export interface InternalAuditReportStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  listInternalAuditReports: GetInternalAuditReportsResponse;
  internalAuditReportDetail: InternalAuditReportDetailResponse;
  errorList: ErrorField[];
  avatarIAR?: AvatarType;
  dataFilter: CommonApiParam;
  listInspectionFollowUp: any;
  inspectionFollowDetail: InspectionFollowUp;
}
