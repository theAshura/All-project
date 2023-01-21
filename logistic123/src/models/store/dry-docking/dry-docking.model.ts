import {
  GetDetailDryDocking,
  GetDryDockingResponse,
} from 'models/api/dry-docking/dry-docking.model';
import { CommonApiParam, CommonErrorResponse } from 'models/common.model';

export interface DryDockingStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  detailDryDocking: GetDetailDryDocking;
  listDryDocking: GetDryDockingResponse;
  errorList: CommonErrorResponse;
  dataFilter: CommonApiParam;
}
