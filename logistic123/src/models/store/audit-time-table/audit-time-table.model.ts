import { CommonApiParam, ErrorField } from 'models/common.model';
import {
  GetAuditTimeTablesResponse,
  AuditTimeTableDetailResponse,
  DateCalendarResponse,
} from '../../api/audit-time-table/audit-time-table.model';

export interface AuditTimeTableStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  listAuditTimeTables: GetAuditTimeTablesResponse;
  auditTimeTableDetail: AuditTimeTableDetailResponse;
  errorList: ErrorField[];
  dataCalendar: DateCalendarResponse[];
  dataFilter: CommonApiParam;
}
