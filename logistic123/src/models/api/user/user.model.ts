import { CommonApiParam } from 'models/common.model';
import {
  AvailableAreaDetail,
  MessageErrorResponse,
} from 'models/store/user/user.model';

export enum Status {
  active = 'active',
  inactive = 'inactive',
}
export interface Country {
  value: string;
  label: string;
  image: string;
}

export interface CreateExperienceUserParams {
  userId?: string;
  position: string;
  companyName: string;
  country: string;
  tillPresent: boolean;
  startDate: Date | string;
  endDate: Date | string;
  handleSuccess?: () => void;
}

export interface UpdateExperienceUserParams {
  id: string;
  data: CreateExperienceUserParams;
  handleSuccess?: () => void;
}

export interface DeleteExperienceUserParams {
  id: string;
  handleSuccess?: () => void;
}

export interface GetListExperienceUserParams {
  id: string;
  params: CommonApiParam;
  handleSuccess?: () => void;
}

export interface Experience {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  position: string;
  companyName: string;
  country: string;
  startDate: Date;
  endDate: Date;
  tillPresent: boolean;
  userId: string;
  createdUserId: string;
  updatedUserId: string;
}

export interface ExperienceDetailResponse {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  position: string;
  companyName: string;
  country: string;
  startDate: Date;
  endDate: Date;
  tillPresent: boolean;
  userId: string;
  createdUserId: string;
  updatedUserId: string;
}
export interface GetListExperiencesUserResponse {
  data: Experience[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface User {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
  avatar?: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  company?: {
    name: string;
  };
  companyId?: string;
  status: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dob: Date;
  nationality: string;
  country: string;
  stateOrProvince: string;
  townOrCity: string;
  address: string;
  postCode?: string;
  roleScope?: string;
  lastLogin?: Date;
  createdUserId?: string;
  parentCompanyId?: string;
  primaryDepartment?: {
    id: string;
    name: string;
    code: string;
  };
  rank: {
    id: string;
    name: string;
    code: string;
  };
  username?: string;
}

export type UserRecord = Pick<User, 'id' | 'username'>;

export interface ListUserRecordResponse {
  data: Array<UserRecord>;
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface GetCountryParams {
  content?: string;
}

export interface GetProvinceParams {
  countryId: string;
  data?: GetCountryParams;
}

export interface ListUserResponse {
  data: Array<User>;
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface exportUserParams {
  pageSize?: number;
  fromPage?: number;
  toPage?: number;
}
export interface GetListUserParams {
  lang?: string;
  page?: number;
  pageSize?: number;
  where?: string;
  pattern?: string;
  sort?: string;
  relations?: string;
  content?: string;
  status?: string;
  role?: string;
  exportType?: string;
  data?: exportUserParams;
  isRefreshLoading?: boolean;
}
export interface AvailableAreaParams {
  country: string | number;
  portIds: (string | number)[];
  preference: string;
}

export interface StateOrProvince {
  value: string;
  label: string;
}

export interface Nationality {
  value: string;
  label: string;
  selected: boolean;
}

export interface CreateUserFormContext {
  postCode: string;
  townOrCity: string;
  dob: string;
  gender: string;
  phoneNumber: string;
  secondaryPhoneNumber?: string;
  address: string;
  addressLine2?: string;
  email: string;
  status: string;
  parentCompanyId?: string;
  companyId?: string;
  jobTitle: string;
  lastName: string;
  firstName: string;
  stateOrProvince: StateOrProvince[];
  nationality: Nationality[];
  country: Country[];
  roles: string[];
  password: string;
  availableAreas: AvailableAreaDetail;
  applyFor?: string;
  divisionIds?: any;
}

export interface CreateUserParams {
  secondaryPhoneNumber?: any;
  avatar?: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  parentCompanyId?: string;
  companyId?: string;
  status: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dob: string;
  nationality: string;
  country: string;
  stateOrProvince: string;
  townOrCity: string;
  address: string;
  addressLine2?: string;
  availableAreas?: AvailableAreaParams[];
  switchableCompanies?: any[];
  roles: string[];
  password?: string;
  postCode?: string;
  employeeId?: string;
  controlType?: string;
  departmentIds?: string[];
  userType?: string;
  primaryDepartmentId?: string;
  rankId?: string;
  handleSuccess?: (id?: string) => void;
  latitude?: number;
  longitude?: number;
  applyFor?: string;
  divisionIds?: any;
}

export interface CreateUserSuccessResponse {
  firstName: string;
  lastName: string;
  username: string;
  jobTitle: string;
  companyId: string;
  status: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dob: Date;
  nationality: string;
  country: string;
  stateOrProvince: string;
  townOrCity: string;
  address: string;
  postCode: string;
  roleScope: string;
  createdUserId: string;
  parentCompanyId: string;
  roles: string[];
  avatar: string;
  employeeId: string;
  rankId: string;
  primaryDepartmentId: string;
  departmentId: string;
  userType: string;
  controlType: string;
  id: string;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserUpdated {
  emailUpdated?: string;
  phoneUpdated?: string;
}
export interface MessageErrEmailAndPhoneNumber {
  emailMsgError?: string;
  phoneMsgError?: string;
}

export interface UpdateUserManagementDetailsParams {
  id: string;
  data: CreateUserParams;
  step?: string;
  handleNextStep?: (err?: MessageErrorResponse[]) => void;
  handleValidate?: (err?: MessageErrorResponse[]) => void;
  handleSuccess?: () => void;
}

export interface ResetPasswordParams {
  id: string;
  oldPassword?: string;
  newPassword: string;
  confirmPassword: string;
  isProfile?: boolean;
  handleSuccess?: () => void;
}

export interface ValidateUserManagementDetailsParams {
  data: {
    id?: string;
    phoneNumber?: string;
    email?: string;
    employeeId?: string;
  };
  handleValidate?: (err?: MessageErrorResponse[]) => void;
}

export interface AccountInformationParams {
  postCode: string;
  townOrCity: string;
  dob: string;
  gender: string;
  phoneNumber: string;
  address: string;
  email: string;
  status: string;
  companyId: string;
  jobTitle: string;
  lastName: string;
  firstName: string;
  stateOrProvince: any;
  nationality: any;
  country: any;
}

// ModalLicenses Certification

export interface CreateLicensesCertificationUserParams {
  userId?: string;
  type: string;
  name: string;
  issuedBy: string;
  issueCountry: string;
  issuedDate: Date;
  expiryDate: Date;
  attachments: string[];
  isVerified: boolean;
  handleSuccess?: () => void;
}

export interface UpdateLicensesCertificationUserParams {
  id: string;
  data: CreateLicensesCertificationUserParams;
  handleSuccess?: () => void;
}

export interface DeleteLicensesCertificationUserParams {
  id: string;
  handleSuccess?: () => void;
}

export interface GetListLicensesCertificationUserParams {
  id: string;
  params: CommonApiParam;
  handleSuccess?: () => void;
}

export interface VerifyUser {
  id: string;
  username: string;
  jobTitle: string;
  email: string;
}

export interface LicensesCertification {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  type: string;
  name: string;
  issuedBy: string;
  issueCountry: string;
  issuedDate: Date;
  expiryDate: Date;
  attachments: string[];
  isVerified: boolean;
  verifiedAt: Date;
  verifiedUserId: string;
  verifyUser: VerifyUser;
  userId: string;
  createdUserId: string;
  updatedUserId: string;
}

export interface LicensesCertificationDetailResponse {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  type: string;
  name: string;
  issuedBy: string;
  issueCountry: string;
  issuedDate: Date;
  expiryDate: Date;
  attachments: string[];
  isVerified: boolean;
  verifiedAt: Date;
  verifiedUserId: string;
  verifyUser: VerifyUser;
  userId: string;
  createdUserId: string;
  updatedUserId: string;
}

export interface TravelDocument {
  id: string;
  createdAt: string;
  updatedAt: string;
  type: string;
  number: string;
  issueCountry: string;
  issuePlace: string;
  issuedDate: string;
  expiryDate: string;
  attachments: any;
  isVerified: boolean;
  verifiedAt: string;
  verifiedUserId: string;
  verifyUser?: {
    email: string;
    id: string;
    jobTitle: string;
    username: string;
  };
}
export interface GetListLicensesCertificationsUserResponse {
  data: LicensesCertification[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}
export interface TravelDocumentResponse {
  data: TravelDocument[];
}
