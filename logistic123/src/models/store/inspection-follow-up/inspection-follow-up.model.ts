import { CommonApiParam, ErrorField } from 'models/common.model';
import { InspectionFollowUp } from 'models/api/inspection-follow-up/inspection-follow-up.model';

export interface InspectionFollowUpStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  listInspectionFollowUps: InspectionFollowUp[];
  errorList: ErrorField[];
  dataFilter: CommonApiParam;
}
