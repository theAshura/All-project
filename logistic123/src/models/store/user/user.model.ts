import {
  CommonMessageErrorResponse,
  CommonApiParam,
  DataObj,
} from 'models/common.model';
import { DepartmentMaster } from 'models/api/department-master/department-master.model';
import { RankMaster } from 'models/api/rank-master/rank-master.model';
import { Port } from 'models/api/port/port.model';
import {
  ListUserResponse,
  UserUpdated,
  GetListExperiencesUserResponse,
  ExperienceDetailResponse,
  GetListLicensesCertificationsUserResponse,
  LicensesCertificationDetailResponse,
} from '../../api/user/user.model';
import {
  NewAsyncOptions,
  OptionProps,
} from '../../../components/ui/async-select/NewAsyncSelect';

export interface ActionsType {
  id: string;
  name: string;
}

export interface RoleUsers {
  id: string;
  createdAt?: Date;
  companyId?: string;
  updatedAt?: Date;
  name: string;
  description?: string;
  status?: string;
  isActive?: boolean;
}

export interface RoleAndPermissionOption {
  value: string;
  label: string;
  isActive?: boolean;
}

export interface Province {
  value: string | number;
  id: number;
  countryId: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Country {
  id: number | string;
  code?: string;
  code3?: string;
  name: string;
  nationality?: string;
  dialCode?: string;
  flagImg?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AvailableAreaSelect {
  countryId: string;
  country: string;
  cities: Array<{ id: string; name: string }>;
  preference: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AvailableArea {
  id?: string;
  userId?: string;
  country: string;
  ports: Port[];
  preference: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AvailableAreaItem {
  country: NewAsyncOptions;
  ports: DataObj[];
  preference: string;
}
export interface AvailableAreaDetail {
  strong?: AvailableAreaItem[];
  neutral?: AvailableAreaItem[];
  no?: AvailableAreaItem[];
}

export interface PrimaryDepartment {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  code: string;
  name: string;
  description: string;
  status: string;
  companyId: string;
  createdUserId: string;
  updatedUserId: null | string;
}

export interface UserDetailResponsive {
  id?: string;
  avatar?: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  companyId: string;
  status: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dob: string;
  nationality: string;
  country: string;
  stateOrProvince?: string;
  townOrCity: string;
  address: string;
  roleScope?: string;
  lastLogin?: null;
  deleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  availableAreas?: AvailableArea[];
  roles: string[];
  rankId?: string;
  departments?: string[];
  userType?: string;
  controlType?: string;
  primaryDepartmentId?: string;
  employeeId?: string;
  departmentIds?: string[];
}

export interface Role {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  status: string;
  companyId?: string;
}

export interface UserManagementDetailStore {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  avatar: null;
  firstName: string;
  lastName: string;
  jobTitle: string;
  companyId: string;
  status: string;
  email: string;
  phoneNumber: string;
  secondaryPhoneNumber: string;
  addressLine2: string;
  gender: string;
  dob: string;
  townOrCity: string;
  address: string;
  roleScope: string;
  nationality?: OptionProps;
  createdUserId?: string;
  country?: OptionProps;
  stateOrProvince?: OptionProps;
  lastLogin: null;
  availableAreas?: AvailableAreaDetail;
  roles: Role[];
  postCode?: string;
  rankId?: string;
  switchableCompanies: any;
  userType?: string;
  controlType?: string;
  employeeId?: string;
  departmentIds?: string[];
  rank?: PrimaryDepartment;
  departments?: PrimaryDepartment[];
  primaryDepartment?: PrimaryDepartment;
  parentCompanyId?: string;
  applyFor?: string;
  divisions?: { id: string }[];
}
export interface AvatarType {
  id?: string;
  url?: string;
}
export interface UserManagementDetailResponse {
  listRolePermission?: RoleUsers[];
  userDetail?: UserManagementDetailStore;
  avatar?: AvatarType;
  listRank?: RankMaster[];
  listDepartment?: DepartmentMaster[];
}
export type MessageErrorResponse = CommonMessageErrorResponse;

export interface UserManagementState {
  loading: boolean;
  disable: boolean;
  listUser: ListUserResponse;
  listUserRecord: ListUserResponse;
  listRolePermissionDetail?: RoleUsers[];
  getUserById?: any;
  listCountry?: Country[];
  listProvince?: Province[];
  userDetailResponse?: UserManagementDetailStore;
  avatar: AvatarType;
  messageError: MessageErrorResponse[];
  params: CommonApiParam;
  userUpdated?: UserUpdated;
  listDepartment: DepartmentMaster[];
  listRank: RankMaster[];
  experience: {
    list: GetListExperiencesUserResponse;
    detail: ExperienceDetailResponse;
    errors: MessageErrorResponse[];
    loading: boolean;
  };
  licensesCertification: {
    list: GetListLicensesCertificationsUserResponse;
    detail: LicensesCertificationDetailResponse;
    errors: MessageErrorResponse[];
    loading: boolean;
  };
  listTravelDocument: any;
  listProvidedInspection: any;
  listChildrenCompany: any;
}

export interface TravelDocumentCreation {
  id?: string;
  userId?: string;
  type: string;
  number: string;
  issuedDate: string;
  expiryDate: string;
  issueCountry: string;
  issuePlace: string;
  attachments: any;
  isVerified: true;
}

export interface UpdateProvidedInspection {
  updateProvidedInspection: {
    id: string;
    isVerified: boolean;
    serviceProvided: boolean;
  }[];
}
