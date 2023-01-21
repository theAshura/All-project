import { CommonApiParam, ErrorField } from 'models/common.model';
import {
  ListMailManagementResponse,
  MailType,
  MailManagementDetail,
} from 'models/api/mail-management/mail-management.model';

export interface MailManagementStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  mailTypes: MailType[];
  mailManagementDetail: MailManagementDetail;
  listMailManagement: ListMailManagementResponse;
  errorList: ErrorField[];
  dataFilter: CommonApiParam;
}
