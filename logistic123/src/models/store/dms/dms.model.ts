import { DMS, GetDMSsResponse, GetListFile } from 'models/api/dms/dms.model';
import { CommonApiParam, ErrorField } from 'models/common.model';

export interface DMSStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  listDMSs: GetDMSsResponse;
  DMSDetail: DMS;
  errorList: ErrorField[];
  fileList: GetListFile[];
}
