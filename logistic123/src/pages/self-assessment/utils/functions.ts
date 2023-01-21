import { ActivePermission } from 'constants/common.const';
import {
  HEX_COLORS,
  RGB_THRESHHOLD,
  SELF_ASSESSMENT_TYPE_OPTIONS,
  SELF_DECLARATION_STATUS,
} from './constant';
import {
  SelfAssessmentDetailResponse,
  SelfDeclarationDetailResponse,
} from './model';

export const checkHideEditSelfAssessmentButton = (
  item: SelfAssessmentDetailResponse,
  workFlowActiveUserPermission: string[],
) => {
  // Company Admin rule
  if (workFlowActiveUserPermission.length === 0) {
    return true;
  }

  // Contains [reviewer, publisher]
  if (
    workFlowActiveUserPermission.length === 2 &&
    workFlowActiveUserPermission.includes(ActivePermission.REVIEWER) &&
    workFlowActiveUserPermission.includes(ActivePermission.PUBLISHER)
  ) {
    if (item?.type === SELF_ASSESSMENT_TYPE_OPTIONS[1].value) {
      return true;
    }

    return false;
  }

  // Contains [reviewer, creator]
  if (
    workFlowActiveUserPermission.length === 2 &&
    workFlowActiveUserPermission.includes(ActivePermission.REVIEWER) &&
    workFlowActiveUserPermission.includes(ActivePermission.CREATOR)
  ) {
    if (item?.type === SELF_ASSESSMENT_TYPE_OPTIONS[2].value) {
      return true;
    }

    return false;
  }

  // Contains [reviewer]
  if (
    workFlowActiveUserPermission.length === 1 &&
    workFlowActiveUserPermission.includes(ActivePermission.REVIEWER)
  ) {
    if (
      item?.type === SELF_ASSESSMENT_TYPE_OPTIONS[1].value ||
      item?.type === SELF_ASSESSMENT_TYPE_OPTIONS[2].value
    ) {
      return true;
    }

    return false;
  }

  // Contains [creator]
  if (
    workFlowActiveUserPermission.length === 1 &&
    workFlowActiveUserPermission.includes(ActivePermission.CREATOR)
  ) {
    if (item?.type === SELF_ASSESSMENT_TYPE_OPTIONS[2].value) {
      return true;
    }

    return false;
  }

  // Contains [publisher]
  if (
    workFlowActiveUserPermission.length === 1 &&
    workFlowActiveUserPermission.includes(ActivePermission.PUBLISHER)
  ) {
    if (item?.type === SELF_ASSESSMENT_TYPE_OPTIONS[1].value) {
      return true;
    }

    return false;
  }

  return false;
};

export const checkHideEditSelfDeclarationButton = (
  item: SelfDeclarationDetailResponse,
  workFlowActiveUserPermission: string[],
) => {
  // Company Admin rule
  if (workFlowActiveUserPermission.length === 0) {
    return true;
  }

  if (
    item?.selfAssessment?.type === SELF_ASSESSMENT_TYPE_OPTIONS[1].value &&
    item?.selfAssessment?.status === 'Closed'
  ) {
    return true;
  }

  // Contains [creator, reviewer, publisher]
  if (
    workFlowActiveUserPermission.length === 3 &&
    workFlowActiveUserPermission.includes(ActivePermission.CREATOR) &&
    workFlowActiveUserPermission.includes(ActivePermission.REVIEWER) &&
    workFlowActiveUserPermission.includes(ActivePermission.PUBLISHER)
  ) {
    if (
      item?.selfAssessment?.type === SELF_ASSESSMENT_TYPE_OPTIONS[0].value &&
      item?.status === SELF_DECLARATION_STATUS.approved
    ) {
      return true;
    }

    if (
      item?.selfAssessment?.type === SELF_ASSESSMENT_TYPE_OPTIONS[1].value &&
      item?.status === SELF_DECLARATION_STATUS.submitted
    ) {
      return true;
    }

    return false;
  }

  // Contains [creator, reviewer]
  if (
    workFlowActiveUserPermission.length === 2 &&
    workFlowActiveUserPermission.includes(ActivePermission.CREATOR) &&
    workFlowActiveUserPermission.includes(ActivePermission.REVIEWER)
  ) {
    if (
      item?.selfAssessment?.type === SELF_ASSESSMENT_TYPE_OPTIONS[0].value &&
      item?.status === SELF_DECLARATION_STATUS.approved
    ) {
      return true;
    }

    if (
      item?.selfAssessment?.type === SELF_ASSESSMENT_TYPE_OPTIONS[1].value &&
      item?.status === SELF_DECLARATION_STATUS.submitted
    ) {
      return true;
    }

    return false;
  }

  // Contains [creator, publisher]
  if (
    workFlowActiveUserPermission.length === 2 &&
    workFlowActiveUserPermission.includes(ActivePermission.CREATOR) &&
    workFlowActiveUserPermission.includes(ActivePermission.PUBLISHER)
  ) {
    if (
      item?.selfAssessment?.type === SELF_ASSESSMENT_TYPE_OPTIONS[0].value &&
      (item?.status === SELF_DECLARATION_STATUS.submitted ||
        item?.status === SELF_DECLARATION_STATUS.approved)
    ) {
      return true;
    }

    if (
      item?.selfAssessment?.type === SELF_ASSESSMENT_TYPE_OPTIONS[1].value &&
      item?.status === SELF_DECLARATION_STATUS.submitted
    ) {
      return true;
    }

    return false;
  }

  // Contains [reviewer, publisher]
  if (
    workFlowActiveUserPermission.length === 2 &&
    workFlowActiveUserPermission.includes(ActivePermission.REVIEWER) &&
    workFlowActiveUserPermission.includes(ActivePermission.PUBLISHER)
  ) {
    if (
      item?.selfAssessment?.type === SELF_ASSESSMENT_TYPE_OPTIONS[0].value &&
      (item?.status === SELF_DECLARATION_STATUS.pending ||
        item?.status === SELF_DECLARATION_STATUS.approved ||
        item?.status === SELF_DECLARATION_STATUS.reassigned)
    ) {
      return true;
    }

    if (
      item?.selfAssessment?.type === SELF_ASSESSMENT_TYPE_OPTIONS[1].value &&
      (item?.status === SELF_DECLARATION_STATUS.pending ||
        item?.status === SELF_DECLARATION_STATUS.submitted)
    ) {
      return true;
    }

    return false;
  }

  // Contains [creator]
  if (
    workFlowActiveUserPermission.length === 1 &&
    workFlowActiveUserPermission.includes(ActivePermission.CREATOR)
  ) {
    if (
      item?.status === SELF_DECLARATION_STATUS.submitted ||
      item?.status === SELF_DECLARATION_STATUS.approved
    ) {
      return true;
    }

    return false;
  }

  // Contains [reviewer]
  if (
    workFlowActiveUserPermission.length === 1 &&
    workFlowActiveUserPermission.includes(ActivePermission.REVIEWER)
  ) {
    if (
      item?.selfAssessment?.type === SELF_ASSESSMENT_TYPE_OPTIONS[0].value &&
      (item?.status === SELF_DECLARATION_STATUS.pending ||
        item?.status === SELF_DECLARATION_STATUS.reassigned ||
        item?.status === SELF_DECLARATION_STATUS.approved)
    ) {
      return true;
    }

    if (
      item?.selfAssessment?.type === SELF_ASSESSMENT_TYPE_OPTIONS[1].value &&
      (item?.status === SELF_DECLARATION_STATUS.pending ||
        item?.status === SELF_DECLARATION_STATUS.submitted)
    ) {
      return true;
    }

    return false;
  }

  // Contains [publisher]
  if (
    workFlowActiveUserPermission.length === 1 &&
    workFlowActiveUserPermission.includes(ActivePermission.PUBLISHER)
  ) {
    return true;
  }

  return false;
};

export const sortByDateOldToNew = (data) => {
  if (data?.length > 0) {
    return data.sort((a, b) => {
      if (String(a?.createdAt) < String(b?.createdAt)) {
        return -1;
      }
      if (String(a?.createdAt) > String(b?.createdAt)) {
        return 1;
      }
      // a must be equal to b
      return 0;
    });
  }
  return [];
};

export const pickTextColorByBackgroundColor = (bgColor: string | undefined) => {
  // bgColor: need to be hex color
  if (!bgColor) {
    return HEX_COLORS.dark;
  }

  const red = parseInt(bgColor.substring(1, 3), 16);
  const green = parseInt(bgColor.substring(3, 5), 16);
  const blue = parseInt(bgColor.substring(5, 7), 16);

  const val =
    red * RGB_THRESHHOLD.red +
    green * RGB_THRESHHOLD.green +
    blue * RGB_THRESHHOLD.blue;

  if (val > RGB_THRESHHOLD.all) {
    return HEX_COLORS.dark;
  }

  return HEX_COLORS.light;
};
