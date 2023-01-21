import { SmsDetailResponse, List } from 'models/api/sms/sms.model';
import { ErrorField, CommonApiParam } from 'models/common.model';

export interface SmsStoreModel {
  loading: boolean;
  loadingCompany: boolean;
  disable: boolean;
  params: CommonApiParam;
  errorList: ErrorField[];
  dataFilter: CommonApiParam;
  listSms: List;
  smsDetail: SmsDetailResponse;
}
