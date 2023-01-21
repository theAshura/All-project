export const SELF_ASSESSMENT_STEPS = {
  standardAndMatrix: 'standard-and-matrix',
  declaration: 'declaration',
  attachment: 'attachment',
};

export const SELF_ASSESSMENT_TYPE_OPTIONS = [
  {
    label: 'Working',
    value: 'Working',
  },
  {
    label: 'Official',
    value: 'Official',
  },
  {
    label: 'Review Prep',
    value: 'Review Prep',
  },
];

export const SELF_DECLARATION_STATUS = {
  pending: 'Pending',
  submitted: 'Submitted',
  reassigned: 'Reassigned',
  approved: 'Approved',
  draft: 'Draft',
  publish: 'Publish',
  review: 'Review',
};
export const SELF_DECLARATION_COMMENT_TITLE = {
  reassign: 'Reassign',
  review: 'Review',
};

export const STANDARD_TYPE = {
  NoSelf: '-1',
  Self: '1',
  Element: '1',
  NoElement: '-1',
};

export const COMMENT_TYPE = {
  CompanyInternal: 'Company internal comment',
  CompanyExternal: 'Company external comment',
};

export const MATRIX_DEVIDERS = {
  coordinate: '__',
  element: '::',
};

export const RGB_THRESHHOLD = {
  red: 0.299,
  green: 0.587,
  blue: 0.114,
  all: 186,
};

export const HEX_COLORS = {
  dark: '#615e69',
  light: '#ffffff',
};

export const COLORS = [
  {
    name: 'Created',
    color: '#3B9FF3',
    border: '#3B9FF3',
    background: '#b5dbff',
  },
  {
    name: 'Submitted',
    color: '#30D158',
    border: '#30D158',
    background: '#eef2fa',
  },
  {
    name: 'Reviewed',
    color: '#A2845E',
    border: '#A2845E',
    background: '#eef2fa',
  },
  {
    name: 'Reviewed',
    color: '#A2845E',
  },
  {
    name: 'Accepted',
    color: '#1E62DC',
    border: '#1E62DC',
    background: '#eef2fa',
  },
  {
    name: 'Approved',
    color: '#66D4CF',
    border: '#66D4CF',
    background: '#eef2fa',
  },
  {
    name: 'In progress',
    color: '#5E5CE6',
    border: '#5E5CE6',
    background: '#eef2fa',
  },
  {
    name: 'Completed',
    color: '#E101E6',
    border: '#E101E6',
    background: '#eef2fa',
  },
  {
    name: 'Updated information',
    color: '#FF9F0A',
    border: '#FF9F0A',
    background: '#eef2fa',
  },
  {
    name: 'Reassigned',
    color: '#FF424E',
    border: '#FF424E',
    background: '#eef2fa',
  },
  {
    name: 'Cancelled',
    color: '#E9453A',
    border: '#E9453A',
    background: '#eef2fa',
  },
  {
    name: 'Planned',
    color: '#0a84ff',
    border: '#0a84ff',
    background: '#eef2fa',
  },
  {
    name: 'Draft',
    color: '#A2845E',
    border: '#A2845E',
    background: '#eef2fa',
  },
  {
    name: 'Unassigned',
    color: '#FF9F0A',
    border: '#FF9F0A',
    background: '#eef2fa',
  },
  {
    name: 'Close out',
    color: '#18ba92',
    border: '#18ba92',
    background: '#eef2fa',
  },
];
