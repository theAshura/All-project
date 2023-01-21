import { ErrorField, CommonApiParam } from 'models/common.model';
import {
  GetInjuryMastersResponse,
  InjuryMasterDetailResponse,
} from 'models/api/injury-master/injury-master.model';

export interface InjuryMasterStoreModel {
  loading: boolean;
  params: CommonApiParam;
  listInjuryMasters: GetInjuryMastersResponse;
  InjuryMasterDetail: InjuryMasterDetailResponse;
  errorList: ErrorField[];
}
