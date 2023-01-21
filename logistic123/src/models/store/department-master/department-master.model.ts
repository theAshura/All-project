import {
  DepartmentMaster,
  ListDepartmentMasterResponse,
} from 'models/api/department-master/department-master.model';
import { ErrorField, CommonApiParam } from 'models/common.model';

export interface DepartmentMasterState {
  loading: boolean;
  disable: boolean;
  listDepartmentMaster: ListDepartmentMasterResponse;
  departmentMasterDetail: DepartmentMaster;
  errorList: ErrorField[];
  params: CommonApiParam;
}
