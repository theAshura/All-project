import {
  DEFAULT_MODULE_LABELS,
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import {
  IDynamicLabel,
  IModuleDynamicLabel,
} from 'models/api/dynamic/dynamic.model';

export const renderDynamicLabel = (
  listLabels: IDynamicLabel,
  key: string,
): string => listLabels?.[key] || key;

// export const renderDynamicLabel = (
//   listLabels: IDynamicLabel,
//   key: string,
// ): string => {
//   if (listLabels && listLabels?.[key]) {
//     return `${listLabels?.[key]}-done-`;
//   }
//   if (listLabels && !listLabels?.[key]) {
//     return `${key}-missBe-`;
//   }
//   return `${key}-missFe-`;
// };

export const renderDynamicModuleLabel = (
  listLabels: IModuleDynamicLabel[],
  key: DynamicLabelModuleName | string,
  checkByDefaultKey?: boolean,
) => {
  if (checkByDefaultKey) {
    const label = listLabels?.find((item) => item?.defaultLabel === key);
    return label?.userDefinedLabel || DEFAULT_MODULE_LABELS?.[key] || key;
  }
  const label = listLabels?.find((item) => item?.key === key);

  return label?.userDefinedLabel || DEFAULT_MODULE_LABELS?.[key] || key;
};

export const getCurrentModulePageByStatus = (
  isEdit = false,
  isCreated = false,
) => {
  if (isCreated) {
    return ModulePage.Create;
  }

  if (isEdit) {
    return ModulePage.Edit;
  }

  return ModulePage.View;
};
