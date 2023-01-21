import { FillQuestionExtend } from 'models/api/audit-inspection-workspace/audit-inspection-workspace.model';

export const checkRequireAttachment = (item: FillQuestionExtend) => {
  if (item) {
    const { attachments, minPictureRequired } = item;

    if (!minPictureRequired) return false;

    if (!attachments?.length || attachments?.length < minPictureRequired) {
      return true;
    }
  }
  return false;
};

export const checkRequireEvidence = (item: FillQuestionExtend) => {
  if (item) {
    const { requireEvidencePicture, evidencePictures } = item;

    if (requireEvidencePicture && evidencePictures?.length === 0) {
      return true;
    }
  }

  return false;
};

export const isRemark = (item: FillQuestionExtend) => {
  if (!item) {
    return false;
  }
  const {
    remarkSpecificAnswers,
    requireEvidencePicture,
    minPictureRequired,
    hasRemark,
    ...other
  } = item;
  let remark = false;
  const answer = other?.answers[0] || '';
  if (!hasRemark) {
    return false;
  }
  if (hasRemark && hasRemark === 'Specific' && remarkSpecificAnswers) {
    remark = remarkSpecificAnswers?.includes(answer);
    return remark;
  }
  return true;
  // if (hasRemark && hasRemark === 'Specific' && remarkSpecificAnswers) {
  //   remark = remarkSpecificAnswers?.includes(answer);
  // } else if (hasRemark && hasRemark === 'All') {
  //   remark = true;
  // }
  // return remark;
};

export const checkRemark = (item: FillQuestionExtend) => {
  if (!item) {
    return false;
  }
  const { reportFindingItem } = item;

  const dataWithOutFinding = {
    findingRemark: item.findingRemark,
    chkQuestionId: item.chkQuestionId,
  };

  const remark = isRemark(item);
  if (remark && dataWithOutFinding) {
    // eslint-disable-next-line no-restricted-syntax
    for (const [, value] of Object.entries(dataWithOutFinding)) {
      // without finding
      if ((Array.isArray(value) && !value.length) || !value) {
        return true;
      }
    }

    const dataWithFinding = {
      auditTypeId: reportFindingItem.auditTypeId,
      natureFindingId: reportFindingItem.natureFindingId,
    };
    // eslint-disable-next-line no-restricted-syntax
    for (const [, value] of Object.entries(dataWithFinding)) {
      // finding
      if (!value) {
        return true;
      }
    }
  }

  return false;
};

export const checkFinding = (item: FillQuestionExtend) => {
  if (item?.reportFindingItem) {
    const {
      isSignificant,
      id,
      mainCategoryId,
      secondCategoryId,
      thirdCategoryId,
      findingComment,
      rectifiedOnBoard,
      ...otherFinding
    } = item?.reportFindingItem;
    // eslint-disable-next-line no-restricted-syntax
    for (const [, value] of Object.entries(otherFinding)) {
      if (!value) {
        return true;
      }
    }
  }
  return false;
};
