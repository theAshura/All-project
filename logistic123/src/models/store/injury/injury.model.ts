import {
  GetInjuryResponse,
  InjuryDetailResponse,
  GetInjuryMasterResponse,
  GetInjuryBodyResponse,
} from 'models/api/injury/injury.model';
import { ErrorField, CommonApiParam } from 'models/common.model';

export interface InjuryStoreModel {
  loading: boolean;
  loadingCompany: boolean;
  disable: boolean;
  params: CommonApiParam;
  errorList: ErrorField[];
  dataFilter: CommonApiParam;
  listInjury: GetInjuryResponse;
  listInjuryMaster: GetInjuryMasterResponse;
  listInjuryBody: GetInjuryBodyResponse;
  injuryDetail: InjuryDetailResponse;
}
