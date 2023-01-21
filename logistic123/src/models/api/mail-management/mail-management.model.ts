import { CompanyObject } from 'models/common.model';

export interface NewMailManagement {
  code: string;
  vesselTypeId: string;
  status: string;
  entityType: string;
  module: string;
  workingType: string;
  mailTypeId: number;
  to: string[];
  cc: string[];
  bcc: string[];
  sub: string;
  body: string;
  attachmentKits: string[];
  id?: string;
}

export interface MailType {
  id?: string;
  name: string;
}

export interface CreatedUser {
  username: string;
}

export interface VesselType {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  code: string;
  name: string;
  status: string;
  description: string;
  attachments?: string[];
  fileZip?: string;
  createdUserId: string;
  updatedUserId: string;
  companyId: string;
  vettingRiskScore?: number;
}

export interface Management {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  entityType: string;
  vesselTypeId: string;
  module: string;
  code: string;
  workingType: string;
  mailTypeId: string;
  status: string;
  to: string[];
  cc: string[];
  bcc: string[];
  sub: string;
  body: string;
  name?: string;
  createdUserId: string;
  updatedUserId: string;
  company?: CompanyObject;
  companyId: string;
  createdUser: CreatedUser;
  updatedUser: string;
  mailType: MailType;
  attachmentKits: VesselType[];
  vesselType: VesselType;
}

export interface ListMailManagementResponse {
  data: Management[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface Company {
  name: string;
}

export interface MailManagementDetail {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  entityType: string;
  vesselTypeId: string;
  module: string;
  code: string;
  workingType: string;
  mailTypeId: number;
  status: string;
  to: string[];
  cc: string[];
  bcc: string[];
  sub: string;
  body: string;
  createdUserId: string;
  updatedUserId: string;
  name: string;
  description: string;
  companyId: string;
  company: Company;
  mailType: Company;
  attachmentKits: VesselType[];
  vesselType: VesselType;
  vesselTypes?: VesselType[];
}
