import { RISK_LEVEL } from './constant';

export const isEditMode = (pathName) => pathName.split('/').includes('edit');

export const getRisk = (score: number) => {
  if (score === 0) {
    return RISK_LEVEL.NEGLIGIBLE;
  }
  if (score <= 2) {
    return RISK_LEVEL.LOW;
  }
  if (score <= 5) {
    return RISK_LEVEL.MEDIUM;
  }
  return RISK_LEVEL.HIGH;
};
