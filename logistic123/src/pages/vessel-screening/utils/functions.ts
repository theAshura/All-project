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

export const getRevertedRisk = (score: number) => {
  if (score < 2) {
    return RISK_LEVEL.HIGH;
  }
  if (score >= 2 && score < 5) {
    return RISK_LEVEL.MEDIUM;
  }
  if (score >= 5 && score < 10) {
    return RISK_LEVEL.LOW;
  }

  return RISK_LEVEL.NEGLIGIBLE;
};

export const getRiskLevel = (score: number) => {
  if (score < 5) {
    return RISK_LEVEL.HIGH;
  }
  if (score < 8) {
    return RISK_LEVEL.MEDIUM;
  }
  if (score < 10) {
    return RISK_LEVEL.LOW;
  }

  return RISK_LEVEL.NEGLIGIBLE;
};
