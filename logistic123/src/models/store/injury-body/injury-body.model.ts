import { ErrorField, CommonApiParam } from 'models/common.model';
import {
  GetInjuryBodyResponse,
  InjuryBodyDetailResponse,
} from 'models/api/injury-body/injury-body.model';

export interface InjuryBodyStoreModel {
  loading: boolean;
  params: CommonApiParam;
  listInjuryBody: GetInjuryBodyResponse;
  InjuryBodyDetail: InjuryBodyDetailResponse;
  errorList: ErrorField[];
}
