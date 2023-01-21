import { CompanyObject } from 'models/common.model';

export interface CreatedUser {
  username: string;
}

export interface AttachmentKit {
  id: string;
  createdAt: string;
  updatedAt: string;
  code: string;
  name: string;
  status: string;
  description: string;
  attachments: string[];
  fileZip: string;
  createdUserId: string;
  updatedUserId: string;
  companyId: string;
  createdUser: CreatedUser;
  updatedUser: string;
  company?: CompanyObject;
}

export interface ListAttachmentKitResponse {
  data: AttachmentKit[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface AttachmentKitData {
  id?: string;
  code: string;
  name: string;
  description?: string;
  status: string;
  attachments?: string[];
  fileZip?: string;
}

export interface Company {
  name: string;
}
export interface AttachmentKitDetail {
  id: string;
  createdAt: string;
  updatedAt: string;
  code: string;
  name: string;
  status: string;
  description: string;
  attachments: string[];
  fileZip: string;
  createdUserId: string;
  updatedUserId: null;
  companyId: string;
  company: Company;
}
