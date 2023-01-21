import { CAR_STATUS } from 'constants/car.const';
import { ActivePermission } from 'constants/common.const';

export const canCurrentUserEditCarCap = (
  workFlowPermissions: string[],
  currentStatus?: string,
): boolean => {
  if (
    workFlowPermissions.some(
      (permission) => permission === ActivePermission.CREATOR,
    ) &&
    (currentStatus === CAR_STATUS.Open || currentStatus === CAR_STATUS.Waiting)
  ) {
    return true;
  }

  if (
    workFlowPermissions.some(
      (permission) => permission === ActivePermission.REVIEWER,
    ) &&
    currentStatus === CAR_STATUS.Submitted
  ) {
    return true;
  }

  if (
    workFlowPermissions.some(
      (permission) => permission === ActivePermission.VERIFICATION,
    ) &&
    currentStatus === CAR_STATUS.Accepted
  ) {
    return true;
  }

  return false;
};

const isDisableStep1 = (workFlowRof, detailCar) => {
  if (
    !workFlowRof?.some(
      (item) =>
        item === ActivePermission.CREATOR || item === ActivePermission.REVIEWER,
    )
  ) {
    return true;
  }
  if (detailCar?.cap?.id) {
    return true;
  }
  return false;
};

const isDisableStep2 = (workFlowCap, detailCar) => {
  if (!workFlowCap?.includes(ActivePermission.CREATOR)) {
    return true;
  }
  if (detailCar?.cap?.status === CAR_STATUS.Draft) {
    return false;
  }
  if (detailCar?.status === CAR_STATUS.Open && !detailCar?.cap) {
    return false;
  }
  if (detailCar?.cap?.status === CAR_STATUS.Denied) {
    return false;
  }
  return true;
};
const isDisableStep3 = (workFlowCap, detailCar) => {
  if (!workFlowCap?.find((i) => i === ActivePermission.REVIEWER)) {
    return true;
  }
  if (detailCar?.cap?.status === CAR_STATUS.Accepted) {
    return true;
  }
  if (detailCar?.cap?.status === CAR_STATUS.Denied) {
    return true;
  }
  return false;
};
const isDisableStep4 = (workFlowCap, detailCar) => {
  if (!workFlowCap?.find((i) => i === ActivePermission.VERIFICATION)) {
    return true;
  }
  if (detailCar?.cARVerification?.id) {
    return true;
  }
  if (detailCar?.cap?.status === CAR_STATUS.Denied) {
    return false;
  }
  return false;
};

export const checkAllStepPermission = (
  workFlowRof: string[],
  workFlowCap: string[],
  detailCar: {
    cap: any;
    status: string;
  },
) =>
  isDisableStep1(workFlowRof, detailCar) &&
  isDisableStep2(workFlowCap, detailCar) &&
  isDisableStep3(workFlowCap, detailCar) &&
  isDisableStep4(workFlowCap, detailCar);
