import { CommonApiParam, ErrorField } from 'models/common.model';
import {
  GetShipDepartmentsResponse,
  ShipDepartmentDetailResponse,
} from '../../api/ship-department/ship-department.model';

export interface ShipDepartmentStoreModel {
  loading: boolean;
  disable: boolean;
  params: CommonApiParam;
  listShipDepartments: GetShipDepartmentsResponse;
  shipDepartmentDetail: ShipDepartmentDetailResponse;
  errorList: ErrorField[];
}
