import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';

export const preventedMenus = [
  `${Features.CONFIGURATION}::${SubFeatures.RISK_FACTOR}::${ActionTypeEnum.VIEW}`,
  `${Features.CONFIGURATION}::${SubFeatures.RISK_FACTOR}::${ActionTypeEnum.CREATE}`,
  `${Features.CONFIGURATION}::${SubFeatures.RISK_FACTOR}::${ActionTypeEnum.UPDATE}`,
  `${Features.CONFIGURATION}::${SubFeatures.RISK_FACTOR}::${ActionTypeEnum.DELETE}`,
  `${Features.CONFIGURATION}::${SubFeatures.VESSEL_OWNER_BUSINESS}::${ActionTypeEnum.VIEW}`,
  `${Features.CONFIGURATION}::${SubFeatures.VESSEL_OWNER_BUSINESS}::${ActionTypeEnum.CREATE}`,
  `${Features.CONFIGURATION}::${SubFeatures.VESSEL_OWNER_BUSINESS}::${ActionTypeEnum.UPDATE}`,
  `${Features.CONFIGURATION}::${SubFeatures.VESSEL_OWNER_BUSINESS}::${ActionTypeEnum.DELETE}`,
  `${Features.CONFIGURATION}::${SubFeatures.DMS}::${ActionTypeEnum.VIEW}`,
  `${Features.CONFIGURATION}::${SubFeatures.DMS}::${ActionTypeEnum.CREATE}`,
  `${Features.CONFIGURATION}::${SubFeatures.DMS}::${ActionTypeEnum.UPDATE}`,
  `${Features.CONFIGURATION}::${SubFeatures.DMS}::${ActionTypeEnum.DELETE}`,
  `${Features.CONFIGURATION}::${SubFeatures.FLEET}::${ActionTypeEnum.VIEW}`,
  `${Features.CONFIGURATION}::${SubFeatures.FLEET}::${ActionTypeEnum.CREATE}`,
  `${Features.CONFIGURATION}::${SubFeatures.FLEET}::${ActionTypeEnum.UPDATE}`,
  `${Features.CONFIGURATION}::${SubFeatures.FLEET}::${ActionTypeEnum.DELETE}`,
  `${Features.QUALITY_ASSURANCE}::${SubFeatures.VIEW_DASHBOARD}::${ActionTypeEnum.VIEW}`,
];

export const configMobileMenu = [
  `${Features.CONFIGURATION}::${SubFeatures.MOBILE_CONFIG}::${ActionTypeEnum.VIEW}`,
  `${Features.CONFIGURATION}::${SubFeatures.MOBILE_CONFIG}::${ActionTypeEnum.CREATE}`,
  `${Features.CONFIGURATION}::${SubFeatures.MOBILE_CONFIG}::${ActionTypeEnum.UPDATE}`,
  `${Features.CONFIGURATION}::${SubFeatures.MOBILE_CONFIG}::${ActionTypeEnum.DELETE}`,
];

export const RIOTINTO_ID = '9a259817-c573-44e3-b9a2-ea01ce9527d2';
export const RIOTINTO_UAT_ID = '86463472-3c11-481c-8049-6babcb1dbfb2';
