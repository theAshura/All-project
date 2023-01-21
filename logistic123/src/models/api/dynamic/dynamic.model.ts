import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';

export interface IDynamicLabel {
  [key: string]: string;
}

export interface IDynamicLabels {
  moduelId: string;
  moduleKey: DynamicLabelModuleName;
  list: IDynamicLabel;
  view: IDynamicLabel;
  edit: IDynamicLabel;
}

export interface IModuleDynamicLabel {
  id: string;
  createdAt: string;
  updatedAt: string;
  defaultLabel: string;
  userDefinedLabel: string;
  description: null;
  language: string;
  key: string;
  order: number;
  isDefault: boolean;
  parentId: string;
  companyId: string;
  modifiedById: string;
  modifiedBy: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
  };
}
