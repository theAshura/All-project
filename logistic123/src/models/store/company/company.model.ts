import { AvatarType, CommonApiParam } from 'models/common.model';
import { MessageErrorResponse } from 'models/store/MessageError.model';

import { ListCompanyManagementResponse } from 'models/api/company/company.model';
import { NewAsyncOptions } from 'components/ui/async-select/NewAsyncSelect';

export interface CreateManagementParams {
  companyTypeIds: string[];
  code: string;
  name: string;
  abbreviation: string;
  companyIMO: string;
  companyLevel: string;
  isInspection: boolean;
  isQA: boolean;
  status: string;
  parentId?: string;
  groupId?: string;
  country: string;
  stateOrProvince: string;
  logo?: string;
  townOrCity: string;
  address: string;
  phone?: string;
  fax?: string;
  email: string;
  firstName: string;
  subscriptionAs: string[];
  lastName: string;
  senderEmail?: string;
  isUseSystemEmail: boolean;
  recipientEmail: string[];
  subscription?: {
    numUsers: number;
    numJobs: number;
    startDate: string;
    endDate: string;
  };
  latitude?: number;
  longitude?: number;
}

export enum CompanyLevelEnum {
  MAIN_COMPANY = 'Main Company',
  INTERNAL_COMPANY = 'Internal Company',
  EXTERNAL_COMPANY = 'External Company',
}

export enum AllowedSubscriptionsEnum {
  INSPECTION = 'Inspections/Services',
  QA = 'Quality assurance',
}

export enum SubscriptionAsEnum {
  CONSUMER = 'Service provider inspection',
  PROVIDER = 'Service consumer inspection',
  MAIN = 'Main - QA',
  EXTERNAL = 'External - QA',
  VISIBLE_IN_GLOBAL_MARKETPLACE = 'Visible in Global Marketplace',
}

export interface UpdateCompanyManagementParams {
  id: string;
  data: CreateManagementParams;
}

export interface GeoLocation {
  type: string;
  coordinates: number[];
}

export interface CompanyType {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  industry: string;
  industryCode: string;
  companyType: string;
  isDefault: boolean;
  lastUpdatedById: string;
  actors: string[];
  status: string;
}

export interface CompanyManagementDetail {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  companyTypes: CompanyType[];
  name: string;
  code: string;
  abbreviation: string;
  status: string;
  companyLevel: string;
  subscriptionAs: string[];
  isInspection: boolean;
  isQA: boolean;

  senderEmailVerifyStatus: number;
  group?: {
    code: string;
    createdAt: Date;
    description: string;
    id: string;
    name: string;
    numCompanies: number;
    updatedAt: Date;
  };
  groupId: NewAsyncOptions[];
  country: NewAsyncOptions[];
  stateOrProvince: NewAsyncOptions[];
  townOrCity: string;
  address: string;
  phone: string;
  fax: string;
  email: string;
  firstName: string;
  lastName: string;
  createdBy: string;
  parentId?: string;
  numVessels?: number;
  avatar?: AvatarType;
  senderEmail?: string;
  isUseSystemEmail?: boolean;
  recipientEmails?: string[];

  subscription?: {
    id: string;
    createdAt: string;
    updatedAt: string;
    numUsers: string;
    numJobs: string;
    startDate: string;
    endDate: string;
    companyId: string;
    isActive: boolean;
    createdUserId: string;
  };
  geoLocation: GeoLocation;
  companyIMO?: string;
}

export interface CompanyManagementState {
  loading: boolean;
  disable: boolean;
  listCompanyManagementTypes: ListCompanyManagementResponse;
  getCompanyById: CompanyManagementDetail;
  errorList: MessageErrorResponse[];
  params: CommonApiParam;
  avatarCompany?: AvatarType;
}

export interface IEmailCompanyConfig {
  recipientEmails: string[];
  senderEmail: string;
  senderEmailVerifyStatus: number;
  isUseSystemEmail: boolean;
}
