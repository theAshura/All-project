import {
  GetRolesResponse,
  Datum,
  RolePermissionDetailResponse,
} from '../../api/role/role.model';
import { CommonApiParam, ErrorField } from '../../common.model';

export interface ActionsType {
  id: string;
  name: string;
}

export interface RoleAndPermissionStoreModel {
  loading: boolean;
  disable: boolean;
  listActions: ActionsType[];
  params: CommonApiParam;
  listRoles: GetRolesResponse;
  listPermission: Datum[];
  rolePermissionDetail: RolePermissionDetailResponse;
  errorList: ErrorField[];
}
