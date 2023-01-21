import { LanguageEnum } from 'constants/module-configuration.cons';

export interface ModifiedBy {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
}

export interface Module {
  id: string;
  defaultLabel: string;
  key: string;
}

export interface ModuleLabelConfig {
  moduleId: string;
  labelId: string;
  action: string;
  module: Module;
}

export interface GetListModuleConfigurationData {
  id: string;
  createdAt: string;
  updatedAt: string;
  defaultLabel: string;
  userDefinedLabel: string;
  description: string | null;
  language: string;
  key: string;
  order: number;
  isDefault: boolean;
  parentId?: string;
  companyId?: string | null;
  modifiedById?: string | null;
  modifiedBy?: ModifiedBy | null;
}

export interface GetListModuleConfigurationResponse {
  data: GetListModuleConfigurationData[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface UpdateModuleConfigDetailBody {
  userDefinedLabel: string;
  language: string;
  description: string;
  id: string;
  companyId: string;
}

export interface ListLabelConfigBody {
  id: string;
  createdAt: string;
  updatedAt: string;
  userDefinedLabel: string;
  defaultLabel: string;
  language: string;
  description: string;
  key: string;
  isDefault: boolean;
  modifiedById: string;
  companyId: string;
  moduleId: string;
  modifiedBy: ModifiedBy;
  moduleLabelConfigs: ModuleLabelConfig[];
}

export interface ListLabelConfigResponse {
  data: ListLabelConfigBody[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalItem: number;
}

export interface LabelConfigDetailResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  userDefinedLabel: string;
  defaultLabel: string;
  language: string;
  description: string;
  key: string;
  isDefault: boolean;
  modifiedById: any;
  companyId: any;
  moduleId: string;
  moduleLabelConfigs: ModuleLabelConfig[];
}

export interface ModuleConfigurationModelStore {
  listModuleConfiguration: GetListModuleConfigurationResponse;
  loading: boolean;
  selectedModule: GetListModuleConfigurationData;
  moduleDetail: GetListModuleConfigurationData;
  listLabel: ListLabelConfigResponse;
  labelDetail: LabelConfigDetailResponse;
  internalLoading: boolean;
}

export interface ListLabelDataTable {
  id: string;
  fieldID: string;
  defaultLabel: string;
  userDefineLabel: string;
  moduleName: string;
  description: string;
  updatedDate: Date | string;
  updatedUser: string;
}

export interface ListCompanyDataTable {
  id: string;
  code: string;
  name: string;
  group: string;
  phone: string;
  country: string;
  state: string;

  city: string;
  address: string;
  fax: string;
  email: string;
  status: string;
}

export interface ListModuleConfigDataTable {
  id: string;
  originalName: string;
  description: string;
  updatedDate: string;
  updatedUser: string;
  currentName: string;
}

export interface ModuleInfoValue {
  language: LanguageEnum;
  defaultLabel: string;
  definedLabel: string;
  description: string;
}

export interface LabelDetailValue {
  moduleName: string;
  fieldID: string;
  defaultLabel: string;
  definedLabel: string;
  description: string;
}
