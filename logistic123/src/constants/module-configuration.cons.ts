import {
  LabelDetailValue,
  ModuleInfoValue,
} from 'models/store/module-configuration/module-configuration.model';
import * as yup from 'yup';

export enum LanguageEnum {
  ENGLISH = 'en',
  JAPANESE = 'ja',
}

export const ModuleInfoDefaultValue: ModuleInfoValue = {
  language: LanguageEnum.ENGLISH,
  defaultLabel: '',
  definedLabel: '',
  description: '',
};

export const ModuleInfoDefaultSchema = yup.object().shape({
  language: yup.string().required('This field is required'),
  defaultLabel: yup.string().trim().required('This field is required'),
  definedLabel: yup.string().trim().required('This field is required'),
  description: yup.string().nullable(),
});

export enum LabelListType {
  LIST = 'List',
  VIEW = 'View',
  EDIT = 'Edit',
  CREATE = 'Create',
}

export const LabelDetailDefaultValue: LabelDetailValue = {
  moduleName: '',
  fieldID: '',
  defaultLabel: '',
  definedLabel: '',
  description: '',
};

export const LabelDetailDefaultSchema = yup.object().shape({
  moduleName: yup.string().required('This field is required'),
  fieldID: yup.string().trim().required('This field is required'),
  defaultLabel: yup.string().trim().required('This field is required'),
  definedLabel: yup.string().trim().required('This field is required'),
  description: yup.string().nullable(),
});
