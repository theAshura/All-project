import { ItemStatus } from 'components/common/step-line/lineStepCP';

export const reFormatStatus = (status: string): string => {
  if (!status) {
    return '';
  }

  if (status.includes(ItemStatus.SUBMITTED.toLowerCase())) {
    return ItemStatus.SUBMITTED;
  }

  if (status.includes(ItemStatus.APPROVED.toLowerCase())) {
    return ItemStatus.APPROVED;
  }

  if (status.includes(ItemStatus.CANCELLED.toLowerCase())) {
    return ItemStatus.CANCELLED;
  }

  if (status.includes(ItemStatus.CLOSED_OUT.toLowerCase())) {
    return ItemStatus.CLOSED_OUT;
  }

  if (status.includes(ItemStatus.DRAFT.toLowerCase())) {
    return ItemStatus.DRAFT;
  }

  if (status.includes(ItemStatus.REJECTED.toLowerCase())) {
    return ItemStatus.REJECTED;
  }

  if (status.includes(ItemStatus.REVIEWED.toLowerCase())) {
    return ItemStatus.REVIEWED;
  }

  return status;
};
