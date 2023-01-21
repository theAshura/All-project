export const PLANNING_STATUES = {
  Draft: 'draft',
  Submitted: 'submitted',
  Reassigned: 'reassigned',
  Rejected: 'rejected',
  Approved: 'approved',
  Accepted: 'accepted',
  Auditor_accepted: 'auditor_accepted',
  PlannedSuccessfully: 'planned successfully',
  Planned_successfully: 'planned_successfully',
  Planned: 'planned',
  InProgress: 'In-progress',
  Completed: 'Completed',
  Cancelled: 'cancelled',
};

export const PlanningAndRequestStatusesOptions = [
  {
    label: 'All',
    value: '',
  },
  {
    label: 'Draft',
    value: 'draft',
  },
  {
    label: 'Submitted',
    value: 'submitted',
  },
  {
    label: 'Approved',
    value: 'approved',
  },
  // {
  //   label: 'Reassigned',
  //   value: 'rejected',
  // },
  {
    label: 'Accepted',
    value: 'auditor_accepted',
  },
  {
    label: 'Planned',
    value: 'planned_successfully',
  },
  {
    label: 'In-progress',
    value: 'In-progress',
  },
  {
    label: 'Completed',
    value: 'Completed',
  },
  {
    label: 'Cancelled',
    value: 'cancelled',
  },
];

export const MAIL_TYPES_IDS = {
  PLANNING_AND_REQUEST: 1,
  INSPECTION_FLOW_UP: 2,
  REPORT_OF_FINDING: 3,
  INSPECTION_REPORT: 4,
};

export const MAIL_MODULES_IDS = {
  PLANNING_AND_REQUEST: 'Planning',
  INSPECTION_FLOW_UP: 'Inspection Follow Up',
  REPORT_OF_FINDING: 'Report of Finding',
  INSPECTION_REPORT: 'Inspection Report',
};

export const MODAL_TYPES = {
  OPEN_TAB: 'open-tab',
  CLOSE_TAB: 'close-tab',
  NORMAL: 'normal',
  FULL_SCREEN: 'full-screen',
};
