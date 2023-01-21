import {
  StandardMaster,
  GetStandardMastersResponse,
  GetElementMastersResponse,
  ElementMaster,
} from 'models/api/element-master/element-master.model';
import { ErrorField, CommonApiParam } from 'models/common.model';

export interface ElementMasterStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  listStandardMasters: GetStandardMastersResponse;
  listStandardNoElements: GetStandardMastersResponse;
  standardMasterDetail: StandardMaster;
  listElementMasters: GetElementMastersResponse;
  elementMasterDetail: ElementMaster;
  errorList: ErrorField[];
  dataFilter: CommonApiParam;
}
