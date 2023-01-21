import { CommonApiParam, ErrorField } from 'models/common.model';
import {
  GetAuditTypesResponse,
  AuditTypeDetailResponse,
} from '../../api/audit-type/audit-type.model';

export interface AuditTypeStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  listAuditTypes: GetAuditTypesResponse;
  auditTypeDetail: AuditTypeDetailResponse;
  errorList: ErrorField[];
}
