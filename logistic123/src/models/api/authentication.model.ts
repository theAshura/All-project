export interface LoginRequestParams {
  email: string;
  password: string;
}

export interface SendPasswordResetCodeParams {
  email: string;
}

export interface JWTDecode {
  companyId: string;
  companyLevel: string;
  createdUserId: string;
  email: string;
  exp: number;
  explicitCompanyId: string;
  groupId: string;
  iat: number;
  id: string;
  parentCompanyId: string;
  roleScope: string;
  userType: string;
}

interface ObjectType {
  id: string;
  name: string;
  logo?: string;
  address?: string;
}
export interface LoginSuccessResponse {
  groupId: () => string;
  id?: string;
  updatedAt?: Date;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  companyId?: string;
  parentCompanyId?: string;
  status?: string;
  email?: string;
  phoneNumber?: string;
  gender?: string;
  dob?: string;
  nationality?: string;
  country?: string;
  stateOrProvince?: string;
  townOrCity?: string;
  address?: string;
  postCode?: string;
  roleScope?: string;
  lastLogin?: Date;
  token?: string;
  companyName?: string;
  rolePermissions?: string[];
  company?: ObjectType;
  group?: ObjectType;
  mainToken?: string;
  switchUserId?: string;
  switchableCompanies?: any;
  username?: string;
  switchedUser?: string;
  parentCompany?: {
    id: string;
    name: string;
    logo?: string;
  };
  mainCompanyId?: string;
  mainCompany?: {
    id: string;
    name: string;
    logo?: string;
  };
  companyLevel?: string;
  mobileConfig?: boolean;
}

export interface objectMessage {
  field: string;
  message: Array<string>;
}
export interface LoginFailResponse {
  message: Array<objectMessage>;
}

export interface ResetPasswordParams {
  token: string;
}
export interface ResetPasswordResponse {
  newPassword: string;
  email: string;
}

export interface TokenResetPasswordParams {
  requestToken: string;
}
export interface TokenResetPasswordResponse {
  requestToken?: string;
  message?: string;
  statusCode?: string;
}

export interface RecoverPasswordParams {
  oldPassword: string;
  newPassword: string;
  confirmPassword?: string;
  email?: string;
}
export interface RecoverPasswordResponse {
  message: '';
}

export interface Role {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  status: string;
  companyId: string;
}

export interface UserProfile {
  avatar: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  lastLogin: string;
  roles: Role[];
}
